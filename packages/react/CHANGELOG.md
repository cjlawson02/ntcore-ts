# [@ntcore-ts/react-v1.0.1-beta.3](https://github.com/cjlawson02/ntcore-ts/compare/@ntcore-ts/react-v1.0.1-beta.2...@ntcore-ts/react-v1.0.1-beta.3) (2026-11-07)


### Bug Fixes

* publish packages with valid dist entry points ([3a667cd](https://github.com/cjlawson02/ntcore-ts/commit/3a667cd134a1484ce7763918ab21bf56ab140ef3))

# [@ntcore-ts/react-v1.0.1-beta.2](https://github.com/cjlawson02/ntcore-ts/compare/@ntcore-ts/react-v1.0.1-beta.1...@ntcore-ts/react-v1.0.1-beta.2) (2026-11-07)

### Bug Fixes

- **release:** load each package's release config ([#679](https://github.com/cjlawson02/ntcore-ts/issues/679)) ([2281951](https://github.com/cjlawson02/ntcore-ts/commit/228195144a8cdf52aac4ceaaa636a1889711924b))

# Changelog

## @ntcore-ts/react-v1.0.0

First stable release of `@ntcore-ts/react` — React bindings for `@ntcore-ts/client`. Hooks throw outside `NtcoreProvider`, struct/protobuf APIs match the client factories, and writer hooks unpublish on unmount by default.

### Breaking Changes

- **ESM-only.** The package is published as `"type": "module"` with no CommonJS build. Use `import` (bundlers and Node ESM); `require('@ntcore-ts/react')` is not supported.

### Hooks

- **`useTopic`** — subscribe to a NetworkTables topic and get the latest value as React state. Supports optional publishing with `publish: true` or `publish: { retained: true }`, with `isReadyToWrite` guard. For JSON, pass `NetworkTablesTypeInfos.kJson` with an object `T` (uses `getJsonTopic`).
- **`useProtobufTopic`** — subscribe to a protobuf-encoded topic with automatic decoding. Supports optional zod validation, `protoFilePath` (Node), `protoSource` / `messageType` (browser), and publishing.
- **`useStructTopic(name, Pose2d)`** or **`useStructTopic<T>(name, options?)`** — subscribe to a WPILib struct-encoded topic. Prefer a geometry descriptor from `@ntcore-ts/client`. Options: `typeName`, `schema`, `defaultValue`, `validator`, `subscribeOptions`, `publish`, `unpublishOnUnmount`.
- **`usePrefixTopic`** — subscribe to all topics under a prefix and get the latest single update `{ name, value, type } | null`.
- **`usePrefixTopicMap`** — subscribe to all topics under a prefix and get a map of topic name → `{ value, type }`. Updates are batched with `requestAnimationFrame`.
- **`useConnectionStatus`** — returns `{ connected, connecting, rtt }` with live robot connection state. `connecting` reflects auto-reconnect while disconnected; `rtt` is −1 when not connected.

### Components

- **`NtcoreProvider`** — context provider. Accepts `team` (number) or `uri` (string) with optional `port` and, with `team`, optional `platform` (`'roborio'` | `'systemcore'`). Validates port at render time. Changing `team` / `uri` / `port` / `platform` switches the singleton; the previous instance is released and closed when no provider still retains it.
- **`useNtcore`** — returns the `NetworkTables` instance from the nearest `NtcoreProvider`. **Throws** when used outside a provider.

### Publishing

- Pass `publish: true` or `publish: { retained: true }` to become the publisher. Only call `setValue` when `isReadyToWrite` is true.
- Writer hooks call `topic.unpublish()` on unmount by default. Set `unpublishOnUnmount: false` to remain publisher after unmount.
- Unmount waits for an in-flight `publish()` and skips `unpublish()` when `pubuid` is null so remounts cannot steal the publisher.

### Re-exports

- Re-exports `NetworkTables`, `NetworkTablesTypeInfos`, `LogLevel`, `getRobotAddress`, `getTeamIpAddress`, `parseRobotAddress`, `SYSTEMCORE_MDNS_HOST`, and types `NetworkTablesTypeInfo`, `NetworkTablesTypes`, `SubscribeOptions`, `TopicProperties`, `RobotPlatform` from `@ntcore-ts/client`.
- Geometry types (`Pose2d`, `Pose2dSchema`, …) are imported from `@ntcore-ts/client`, not from this package.
