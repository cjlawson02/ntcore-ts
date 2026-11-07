export { NtcoreContext, NtcoreProvider, useNtcore } from './lib/context.js';
export type { NtcoreProviderProps } from './lib/context.js';
export { useTopic } from './lib/use-topic.js';
export type { UseTopicOptions, UseTopicResult } from './lib/use-topic.js';
export { usePrefixTopic, usePrefixTopicMap } from './lib/use-prefix-topic.js';
export type { PrefixTopicUpdate, PrefixTopicMapEntry } from './lib/use-prefix-topic.js';
export { useProtobufTopic } from './lib/use-protobuf-topic.js';
export type { UseProtobufTopicOptions, UseProtobufTopicResult } from './lib/use-protobuf-topic.js';
export { useStructTopic } from './lib/use-struct-topic.js';
export type { UseStructTopicOptions, UseStructTopicTypeOptions, UseStructTopicResult } from './lib/use-struct-topic.js';
export { useConnectionStatus } from './lib/use-connection-status.js';

export type {
  NetworkTablesTypeInfo,
  NetworkTablesTypes,
  SubscribeOptions,
  TopicProperties,
  RobotPlatform,
  ParsedRobotAddress,
} from '@ntcore-ts/client';
export {
  NetworkTables,
  NetworkTablesTypeInfos,
  LogLevel,
  getRobotAddress,
  getTeamIpAddress,
  parseRobotAddress,
  SYSTEMCORE_MDNS_HOST,
} from '@ntcore-ts/client';
