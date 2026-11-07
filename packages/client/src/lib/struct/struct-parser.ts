import { parseStruct } from 'wpilib-struct';

import {
  isPrimitiveType,
  getPrimitiveSize,
  type PrimitiveTypeName,
  type StructDescriptor,
  type StructFieldDescriptor,
} from './struct-descriptor';

export type ParsedField = {
  typeName: string;
  name: string;
  arraySize: number;
  bitWidth: number;
  enumValues?: Record<string, number>;
};

/**
 * Parses a WPILib struct schema and adapts it to the field format used by the codec.
 * @throws Error on malformed schema.
 */
export function parseSchema(schema: string): ParsedField[] {
  return parseStruct(schema).map((field) => ({
    typeName: field.value,
    name: field.name,
    arraySize: field.arraySize ?? 1,
    bitWidth: field.bitWidth ?? 0,
    enumValues: field.enumSpecification
      ? Object.fromEntries([...field.enumSpecification].map(([name, value]) => [name, Number(value)]))
      : undefined,
  }));
}

/**
 * Builds a StructDescriptor from parsed fields and a resolver for nested struct sizes.
 *
 * Implements the WPILib `StructDescriptor.calculateOffsets()` algorithm for bitfield
 * coalescing. Fields are densely packed with no alignment padding. Consecutive bitfields
 * of the same underlying type share a single storage unit (e.g. two `uint8:4` fields
 * occupy 1 byte, not 2). When the type changes or bits overflow the storage unit, a new
 * unit starts.
 *
 * @see https://github.com/wpilibsuite/allwpilib — StructDescriptor.java, calculateOffsets()
 */
export function buildStructDescriptor(
  typeName: string,
  parsedFields: ParsedField[],
  getNestedDescriptor: (name: string) => StructDescriptor | null
): StructDescriptor {
  function resolveElemSize(f: ParsedField): { elemSize: number; nested: StructDescriptor | null } {
    if (isPrimitiveType(f.typeName)) {
      const elemSize = getPrimitiveSize(f.typeName as PrimitiveTypeName);
      if (f.bitWidth > 0 && f.bitWidth > elemSize * 8) {
        throw new Error(
          `Struct schema: bitfield width ${f.bitWidth} exceeds type ${f.typeName} size (${elemSize} bytes)`
        );
      }
      return { elemSize, nested: null };
    }
    if (f.typeName === typeName) {
      throw new Error(`Struct schema: circular struct reference "${f.typeName}" in "${typeName}"`);
    }
    const nested = getNestedDescriptor(f.typeName);
    if (!nested) {
      throw new Error(`Struct schema: unknown or circular struct type "${f.typeName}" in "${typeName}"`);
    }
    return { elemSize: nested.size, nested };
  }

  const fields: StructFieldDescriptor[] = [];
  // Mirrors WPILib's calculateOffsets state: byte offset, bit position within the
  // current bitfield storage unit, and the byte-size of that storage unit (0 = none active).
  let offset = 0;
  let shift = 0;
  let prevBitfieldSize = 0;

  for (const f of parsedFields) {
    const { elemSize, nested } = resolveElemSize(f);
    const isBitfield = f.bitWidth > 0 && f.bitWidth < elemSize * 8;

    if (!isBitfield) {
      // Non-bitfield: close any active bitfield storage unit, then lay out normally.
      shift = 0;
      offset += prevBitfieldSize;
      prevBitfieldSize = 0;

      if (nested) {
        fields.push({
          name: f.name,
          offset,
          size: elemSize,
          arraySize: f.arraySize,
          bitWidth: 0,
          bitShift: 0,
          nestedDescriptor: nested,
        });
      } else {
        fields.push({
          name: f.name,
          offset,
          size: elemSize,
          arraySize: f.arraySize,
          bitWidth: 0,
          bitShift: 0,
          enumValues: f.enumValues,
          primitive: f.typeName as PrimitiveTypeName,
        });
      }
      offset += elemSize * f.arraySize;
    } else {
      // Bitfield coalescing: consecutive bitfields of the same underlying type pack into
      // a shared storage unit at increasing bitShift offsets (LSB-first). Three cases:
      const bitWidth = f.bitWidth;
      const isBool = f.typeName === 'bool';

      if (isBool && prevBitfieldSize !== 0 && shift + 1 <= prevBitfieldSize * 8) {
        // Case 1: Bool adopts the preceding bitfield's storage type if it fits (1 bit).
        // This is a WPILib special case — a bool:1 packs into any active storage unit.
      } else if (elemSize !== prevBitfieldSize || shift + bitWidth > elemSize * 8) {
        // Case 2: Type changed or bits won't fit — start a new storage unit.
        shift = 0;
        offset += prevBitfieldSize;
      }
      // Case 3 (implicit): Same type, fits — continues packing into current unit.

      prevBitfieldSize =
        isBool && prevBitfieldSize !== 0 && shift + 1 <= prevBitfieldSize * 8 ? prevBitfieldSize : elemSize;

      fields.push({
        name: f.name,
        offset,
        size: prevBitfieldSize,
        arraySize: 1,
        bitWidth,
        bitShift: shift,
        enumValues: f.enumValues,
        primitive: f.typeName as PrimitiveTypeName,
      });
      shift += bitWidth;
    }
  }

  // Account for any trailing bitfield storage unit.
  const totalSize = offset + prevBitfieldSize;
  return { typeName, size: totalSize, fields };
}
