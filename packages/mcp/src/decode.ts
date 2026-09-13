import { getBuiltInDescriptor, unpack, type NetworkTables } from '@ntcore-ts/client';

import { toJsonSafe, type JsonValue } from './response.js';

/** Decode a struct wire payload using built-in descriptors when possible. */
export function decodeStructBytes(typeName: string, bytes: Uint8Array): JsonValue | null {
  const isArray = typeName.endsWith('[]');
  const base = isArray ? typeName.slice(0, -2) : typeName;
  const desc = getBuiltInDescriptor(base);
  if (!desc) return null;
  try {
    if (isArray) {
      const elemSize = desc.size;
      if (bytes.length % elemSize !== 0) return null;
      const n = bytes.length / elemSize;
      const arr = [];
      for (let i = 0; i < n; i++) {
        arr.push(unpack(new Uint8Array(bytes.buffer, bytes.byteOffset + i * elemSize, elemSize), desc));
      }
      return toJsonSafe(arr);
    }
    return toJsonSafe(unpack(bytes, desc));
  } catch {
    return null;
  }
}

export function decodeInventoryValue(type: string, rawValue: unknown): JsonValue | null {
  if (rawValue == null) return null;
  if (rawValue instanceof Uint8Array) {
    if (type.startsWith('struct:')) {
      return decodeStructBytes(type.slice('struct:'.length), rawValue);
    }
    return toJsonSafe(rawValue);
  }
  return toJsonSafe(rawValue);
}

/** Parent prefix for a topic path, e.g. /MyTable/Gyro -> /MyTable/ */
export function topicParentPrefix(topic: string): string {
  const idx = topic.lastIndexOf('/');
  if (idx <= 0) return '/';
  return topic.slice(0, idx + 1);
}

export async function snapshotTopic(
  nt: NetworkTables,
  topic: string,
  settleMs = 400
): Promise<{ type: string; rawValue: unknown } | null> {
  const prefix = topicParentPrefix(topic);
  let found: { type: string; rawValue: unknown } | null = null;
  const prefixTopic = nt.getPrefixTopic(prefix);
  const subuid = prefixTopic.subscribe(
    (value, params) => {
      if (params.name === topic) {
        found = { type: params.type, rawValue: value };
      }
    },
    { immediateNotify: true, all: true }
  );
  await new Promise((r) => setTimeout(r, settleMs));
  try {
    prefixTopic.unsubscribe(subuid);
  } catch {
    // ignore
  }
  return found;
}
