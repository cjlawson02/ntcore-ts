import { BUILT_IN_STRUCT_TYPE_NAMES, type NetworkTables } from '@ntcore-ts/client';

import { toJsonSafe, type JsonValue } from './response.js';

export const BUILTIN_STRUCT_TYPE_NAMES = [...BUILT_IN_STRUCT_TYPE_NAMES];

export type TopicHandle = {
  getValue: () => unknown;
  subscribe: (cb: (value: unknown) => void, options?: Record<string, unknown>) => number;
  unsubscribe: (subuid: number) => void;
  publish: (props?: Record<string, unknown>) => void | Promise<unknown>;
  setValue: (value: unknown) => void;
  lastChangedTime?: number;
  typeInfo?: [number, string];
};

/** Resolve a typed topic handle from a NetworkTables wire type string. */
export function resolveTopic(nt: NetworkTables, name: string, type: string): TopicHandle {
  switch (type) {
    case 'boolean':
      return nt.getBooleanTopic(name) as unknown as TopicHandle;
    case 'double':
      return nt.getDoubleTopic(name) as unknown as TopicHandle;
    case 'int':
      return nt.getIntegerTopic(name) as unknown as TopicHandle;
    case 'float':
      return nt.getFloatTopic(name) as unknown as TopicHandle;
    case 'string':
      return nt.getStringTopic(name) as unknown as TopicHandle;
    case 'boolean[]':
      return nt.getBooleanArrayTopic(name) as unknown as TopicHandle;
    case 'double[]':
      return nt.getDoubleArrayTopic(name) as unknown as TopicHandle;
    case 'int[]':
      return nt.getIntegerArrayTopic(name) as unknown as TopicHandle;
    case 'float[]':
      return nt.getFloatArrayTopic(name) as unknown as TopicHandle;
    case 'string[]':
      return nt.getStringArrayTopic(name) as unknown as TopicHandle;
    case 'json':
      return nt.getJsonTopic(name) as unknown as TopicHandle;
    case 'raw':
      return nt.getRawTopic(name) as unknown as TopicHandle;
    default:
      break;
  }

  if (type.startsWith('struct:')) {
    const typeName = type.slice('struct:'.length);
    return nt.getStructTopic(name, { typeName }) as unknown as TopicHandle;
  }

  if (type.startsWith('proto:') || type === 'protobuf') {
    return nt.getProtobufTopic(name) as unknown as TopicHandle;
  }

  return nt.getRawTopic(name) as unknown as TopicHandle;
}

export function readTopicValue(topic: TopicHandle): { value: JsonValue; timestamp: number | null } {
  const value = topic.getValue();
  return {
    value: toJsonSafe(value),
    timestamp: topic.lastChangedTime ?? null,
  };
}

export function isStructOrProtobufType(type: string): boolean {
  return type.startsWith('struct:') || type.startsWith('proto:') || type === 'protobuf';
}
