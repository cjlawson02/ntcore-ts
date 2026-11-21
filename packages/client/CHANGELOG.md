# @ntcore-ts/client

## 2.0.0

### Major Changes

- [#714](https://github.com/cjlawson02/ntcore-ts/pull/714) [`64d8958`](https://github.com/cjlawson02/ntcore-ts/commit/64d8958609c92a84751fe74ab2ea79871ad1856a) Thanks [@jonahsnider](https://github.com/jonahsnider)! - **Breaking:** Node.js 22 or newer is now required. The client uses the runtime's built-in `WebSocket` instead of the `isomorphic-ws` and `ws` packages, and Node.js only provides a global `WebSocket` from version 22. Browsers, Deno, and Bun are unaffected.
  
  If you run the client on Node.js 20 or older, upgrade Node.js before updating this package.
  
  `@ntcore-ts/mcp` runs on Node.js and now declares the same Node.js 22+ requirement.

- [#721](https://github.com/cjlawson02/ntcore-ts/pull/721) [`d6580a8`](https://github.com/cjlawson02/ntcore-ts/commit/d6580a8ccef1044bbc9fc1446073ba37643993e3) Thanks [@cjlawson02](https://github.com/cjlawson02)! - **Breaking (types only):** Values passed to subscriber callbacks, returned by `getValue()`, and returned by the React hooks are now typed as `ReadonlyValue<T>`. Every subscriber of a topic receives the same object, so arrays and decoded struct, protobuf, and JSON values are read-only all the way down; `Uint8Array` values are unchanged. Code that mutated a received value, for example `value.sort()`, no longer compiles. Copy it first (`[...value].sort()`). `setValue()` accepts read-only values, so passing a received value back in still works. Runtime behavior is unchanged.

### Minor Changes

- [#707](https://github.com/cjlawson02/ntcore-ts/pull/707) [`5285456`](https://github.com/cjlawson02/ntcore-ts/commit/5285456e4e460207e5826d14d07261eb983dfac9) Thanks [@jonahsnider](https://github.com/jonahsnider)! - Add `addAnnounceListener`, `addUnannounceListener`, and `addPropertiesListener` to prefix topics to track subtopics that haven't sent a value yet, go away, or change properties. Pass `{ immediateNotify: true }` to `addAnnounceListener` to also hear about subtopics already announced on the connection. Unannounce listeners also run for every subtopic when the connection drops, and properties updates are applied to the subtopic's announce params, with `null` deleting a property. `immediateNotify` on `subscribe` no longer replays values from unannounced subtopics.

### Patch Changes

- [#713](https://github.com/cjlawson02/ntcore-ts/pull/713) [`8120681`](https://github.com/cjlawson02/ntcore-ts/commit/8120681b2a69da7c72fa2101488294d261e57d3a) Thanks [@jonahsnider](https://github.com/jonahsnider)! - Remove the `tslog` dependency (about 23 KB gzipped) and log through the built-in `console` instead. Each level now writes to the matching console method (`console.debug`, `console.info`, `console.warn`) with a `[MODULE]` prefix, so browser DevTools can filter library logs by level. Outside the browser, lines start with an ISO timestamp; turn it on or off with `setLogTimestamps()`. Use `setLogHandler()` to send log lines to your own logger instead of the console.

- [#718](https://github.com/cjlawson02/ntcore-ts/pull/718) [`96f5aa0`](https://github.com/cjlawson02/ntcore-ts/commit/96f5aa05ee3b43ceb824519574519b4716173035) Thanks [@cjlawson02](https://github.com/cjlawson02)! - Fix two NT4 protocol handling bugs:
  
  - Subscribing to a topic before publishing it no longer marks the topic as a publisher. Announces sent for a subscription omit `pubuid`, and the client treated that as a match for a topic with no pubuid, so `publish()` was skipped and `setValue()` threw "is not a publisher".
  - A `properties` update that deletes a property (for example `{ persistent: null }`, sent when robot code calls `setPersistent(false)`) is now accepted. Previously it failed validation and every message in the same text frame was dropped.

- [#706](https://github.com/cjlawson02/ntcore-ts/pull/706) [`aa65b9e`](https://github.com/cjlawson02/ntcore-ts/commit/aa65b9e7ef677c64175999e2da8bd948eef5f38a) Thanks [@jonahsnider](https://github.com/jonahsnider)! - Keep topic properties that aren't part of the NT4 spec, like `unit`, instead of dropping them when parsing announce and properties messages
  
  Unknown keys are also kept in `properties` update messages. The `TopicProperties` type accepted by `publish()` and `setProperties()` still lists only `persistent`, `retained`, and `cached`, so misspelled keys remain a compile error.

- [#710](https://github.com/cjlawson02/ntcore-ts/pull/710) [`68d3685`](https://github.com/cjlawson02/ntcore-ts/commit/68d36853dc1b5a67e01773884f9639fccf41bbe6) Thanks [@jonahsnider](https://github.com/jonahsnider)! - Fix topics created after another subscription already covers them never receiving values. The server announces each topic and sends its value only once per client, so a topic created after, for example, a prefix subscription to `/` was never announced and ignored every update. When a topic or prefix topic gets its first subscriber, it now picks up the announcements the client already has and any current value another topic already holds. The new subscriber receives each replayed value once (with or without `immediateNotify`), values the client set itself are never overwritten, and `topicsonly` subscribers get no values.

## 1.1.1

### Patch Changes

- [#685](https://github.com/cjlawson02/ntcore-ts/pull/685) [`ccd1b6d`](https://github.com/cjlawson02/ntcore-ts/commit/ccd1b6d16f34ab8baa9f0d0823238a873ece2b82) Thanks [@cjlawson02](https://github.com/cjlawson02)! - Fix published type declarations failing to resolve under `moduleResolution: node16`/`nodenext`.

## 1.1.0 (2026-11-07)

[Compare changes](https://github.com/cjlawson02/ntcore-ts/compare/@ntcore-ts/client-v1.0.0...@ntcore-ts/client-v1.1.0)


### Features

* release 1.1.0 - structs, publish fixes, and performance ([#684](https://github.com/cjlawson02/ntcore-ts/issues/684)) ([a82a6dc](https://github.com/cjlawson02/ntcore-ts/commit/a82a6dc8addbbe7c0505e332d922f998c4fbd493))

## 1.1.0-beta.4 (2026-11-07)

[Compare changes](https://github.com/cjlawson02/ntcore-ts/compare/@ntcore-ts/client-v1.1.0-beta.3...@ntcore-ts/client-v1.1.0-beta.4)


### Bug Fixes

* publish packages with valid dist entry points ([3a667cd](https://github.com/cjlawson02/ntcore-ts/commit/3a667cd134a1484ce7763918ab21bf56ab140ef3))

## 1.1.0-beta.3 (2026-11-07)

[Compare changes](https://github.com/cjlawson02/ntcore-ts/compare/@ntcore-ts/client-v1.1.0-beta.2...@ntcore-ts/client-v1.1.0-beta.3)

### Bug Fixes

- **release:** load each package's release config ([#679](https://github.com/cjlawson02/ntcore-ts/issues/679)) ([2281951](https://github.com/cjlawson02/ntcore-ts/commit/228195144a8cdf52aac4ceaaa636a1889711924b))

Note: there may be breaking changes between each beta version, but if a breaking change is introduced out of beta, it will be a major version change

## 1.0.0

First stable release of `@ntcore-ts/client` under the `@ntcore-ts` scope. This is the public 1.x line: the package is renamed from `ntcore-ts-client`, topic factories follow WPILib naming (`getDoubleTopic`, `getStructTopic`, …), geometry types are first-class, and `close()` tears down the singleton so it does not leak.

### Breaking Changes (from `ntcore-ts-client` 3.x)

- **ESM-only.** The package is published as `"type": "module"` with no CommonJS build. Use `import` (bundlers and Node ESM); `require('@ntcore-ts/client')` is not supported.
- **Package renamed** from `ntcore-ts-client` to `@ntcore-ts/client`. Update your imports accordingly.
- **Removed `client` getter** from `NetworkTables`. The underlying `PubSubClient` is now private.
- **Renamed `NetworkTablesTypeInfos.kArrayBuffer`** to `kUint8Array` to match the actual value type (`Uint8Array`).
- **Typed factories.** Use `getDoubleTopic`, `getStringTopic`, …, `getJsonTopic`, `getProtobufTopic`, `getStructTopic`, and `getPrefixTopic`. `createTopic(name, typeInfo)` remains only when the type is not known until runtime; passing a protobuf or `struct:…` type throws.
- **`getStructTopic` requires a type when creating a topic.** Pass a descriptor (`getStructTopic(name, Pose2d)`) or `{ typeName }`. A later call with the same name and no `typeName` returns the cached instance. A mismatched `typeName` (e.g. `Pose2d` vs `Pose2d[]`) throws.
- **`setProperties` takes a `TopicProperties` object** (e.g. `{ persistent: true, retained: true }`).
- **Subscribe `id` / `save` are internal.** Public `subscribe(callback, options?)` only.
- **Protocol Zod schemas are not public barrel exports.** Import types (`SubscribeOptions`, `TopicProperties`, …) from `@ntcore-ts/client`.
- **`zod` is a runtime dependency.** Install `zod` in the app only if you write custom validators.

### New Features

- **WPILib-style scalar factories** — `getBooleanTopic`, `getDoubleTopic`, `getIntegerTopic`, `getFloatTopic`, `getStringTopic`, matching array factories, `getRawTopic`, and `getJsonTopic`.
- **JSON topics** — `getJsonTopic<T>(name, defaultValue?, { validator })` returns a parsed object; wire format is a JSON string with type `'json'`.
- **Protobuf topics** — `getProtobufTopic` with automatic schema registration, encoding/decoding, and optional zod validation. `protoFilePath` is Node-only; `protoSource` (file text) and `messageType` (prebuilt protobufjs `Type`) work in the browser.
- **Struct topics** — `getStructTopic(name, Pose2d)` (or `{ typeName, schema }`) for WPILib struct-encoded topics with binary encoding/decoding and built-in schemas.
- **Geometry types** — `Pose2d`, `Translation2d`, `Rotation2d`, and the rest of the built-in WPILib struct shapes, plus matching Zod schemas (`Pose2dSchema`, …).
- **Configurable logging** — per-module log levels via `NetworkTables.setLogLevel()`, `NetworkTables.setModuleLogLevel()`, and `NetworkTables.getModuleLogLevel()`. Exported `LogLevel` enum and `LoggerModule` type.
- **`close()` / `retain()` / `release()`** — `close()` disconnects, unsubscribes/unpublishes, stops reconnect, and drops the singleton. `retain`/`release` share an instance across owners (used by `NtcoreProvider`).
- **`stopAutoConnect()` / `startAutoConnect()`** — control automatic reconnection.
- **`getRttMs()`** — best round-trip time to the robot in milliseconds.
- **Runtime data validation** — topic values are validated against their declared type using zod.
- **Prefix topics** — `getPrefixTopic` wildcard subscriptions; local publishes notify prefix subscribers; `immediateNotify` replays cached matching subtopic values (client-side only; not a fake topic named the prefix).
- **SystemCore team addressing** — `getInstanceByTeam(team, port, 'systemcore')` connects to `10.TE.AM.2` (WPILib `SetServerTeam`). The default remains RoboRIO mDNS (`roborio-<team>-frc.local`). Also `changeTeam()`, `getRobotAddress()`, `getTeamIpAddress()`, `parseRobotAddress()`, and `SYSTEMCORE_MDNS_HOST` (`robot.local`).
- **Publish waits for a real `announce`** — `publish()` resolves when the server sends `announce` with `pubuid` (WPILib 2027 / [allwpilib#8515](https://github.com/wpilibsuite/allwpilib/pull/8515)). The client does not synthesize announcements or send a subscribe hotfix for [wpilibsuite/allwpilib#7680](https://github.com/wpilibsuite/allwpilib/issues/7680).
- **In-flight operation management** — prevents duplicate schema registrations and topic publishes during reconnection.
- **Singleton topic reuse** — a later `getJsonTopic` / `getProtobufTopic` / `getStructTopic` for the same name returns the existing instance and applies options. A later `validator` replaces the previous one.
- **Additional type numbers** — `float`, `json`, `rpc`, `msgpack`, `protobuf`, `structschema`, and `float[]` on `NetworkTablesTypeInfos`.

### Bug Fixes

- Fixed `raw` type number (now correctly `5` instead of `3`).
- Fixed `setProperties` filtering for `'announce'` messages instead of `'properties'` with `ack` field, which caused unnecessary timeouts.
- Fixed race condition where publish/setProperties timeouts weren't cleared on success.
- Fixed publisher updates not being queued until topic announcement.
- Fixed `pubuid` not being sent correctly on updates.
- Fixed heartbeat handling and exposed RTT measurement.
- `close()` stops the reconnect timer; a previous socket `onclose` cannot start a new connection after teardown.
- Stale websocket handlers after `reinstantiate()` are ignored.
- JSON topic reuse no longer wipes an existing value.
- Protobuf `applyOptions({ protoSource })` parses immediately; a failed `protoFilePath` load does not poison an already-working message type.
- Struct array vs scalar type mismatches throw instead of silently casting.
- Prefix local notify uses the topic’s public value (not only the wire value).
- Schema parse failures are isolated; proto source/schema size is capped.

### Migration from `ntcore-ts-client` 3.x

1. Change the dependency from `ntcore-ts-client` to `@ntcore-ts/client`.
2. Replace `NetworkTablesTypeInfos.kArrayBuffer` with `NetworkTablesTypeInfos.kUint8Array`.
3. Remove any usage of the `client` getter on `NetworkTables` instances.
4. Prefer `getDoubleTopic(name)` (etc.) over `createTopic(name, NetworkTablesTypeInfos.kDouble)`.
5. Struct/protobuf/prefix: `getStructTopic('/MyTable/PoseStruct', Pose2d)`, `getProtobufTopic(name, options)`, `getPrefixTopic(prefix)`.
6. `setProperties({ retained: true })` instead of boolean arguments.
7. Call `nt.close()` when the client is done (React: `NtcoreProvider` retains/releases for you).
8. Import `Pose2d` / `Pose2dSchema` from `@ntcore-ts/client`. Custom validators still need `zod` in the app; the client depends on it itself.

## 3.1.3

- Hotfix: Fix `raw` type number to be `5` instead of `3`
- Updated dependencies

### Non-library changes

- Swap from jest to vitest

## 3.1.2

- Hotfix: WPILib 2025.2.1 needs a subscription after publish to receive the announcement. Implements this hotfix and other small null-check fixes.

## 3.1.1

- Hotfix: export modules correctly and fix doc generation

## 3.1.0

- Fix 2025 Robot issues
  - Fixes publisher and subscriber ID generations to start counting at 0. Avoids integer overflows.
  - Remove RTT websocket that is unnecessary since the client can respond to PING and PONG messages

- Fix timeout for publishing pre-connection to wait for robot connection

## 3.0.0-beta.1

### Breaking Changes

- **BREAKING CHANGE: Remove immediateNotify from subscribe**
  - This complicated prefix topics and was not a very valuable feature
  - Workaround: you can manually call the subscription's callback yourself after subscribing

### Changes

- Add prefix topic support
  - You can now subscribe to multiple topics with a single subscription
  - This is done by creating a topic with a prefix, and then subscribing to that topic
  - For example, if you have topics `/MyTable/Accelerometer/X`, `/MyTable/Accelerometer/Y`, and `/MyTable/Accelerometer/Z`, you can create a prefix topic `/MyTable/Accelerometer/` and subscribe to that to get notifications for all three subtopics

## 2.0.0

### Breaking Changes

- **BREAKING CHANGE: Drop support for v4.0**
  - The API now requires NT v4.1 to function
- **BRAKING CHANGE: publish and setProperties are now asynchronous**
  - Please await these calls to know when the changes take effect
    - After awaiting publish, it is safe to set new values to the topic

### Changes

- Add support for v4.1
  - No support for PING/PONG messages - Node/JS limitation
  - No support added yet for cached messages
- Updated dependencies

## 1.0.0

### Breaking Changes

- **BREAKING CHANGE: removed NetworkTables.createInstance\*()**
  - Please use NetworkTables.getInstanceByTeam() and NetworkTables.getInstanceByURI()
- **BREAKING CHANGE: removed NetworkTableTypeInfos**
  - Fixed typo: now called `NetworkTablesTypeInfos` (NetworkTables plural! With **S**!)

## 0.2.2

### Changes

- Updated dependencies
- Existing topics are type checked better

## 0.2.1

### Changes

- Updated dependencies and changelog

## 0.2.0

### Breaking Changes

- **BREAKING CHANGE: deprecated NetworkTables.createInstance\*()**
  - Please use NetworkTables.getInstanceByTeam() and NetworkTables.getInstanceByURI()
- **BREAKING CHANGE: removed NetworkTables.getInstance() and NetworkTables.getServerURL()**
- **BREAKING CHANGE: deprecated NetworkTableTypeInfos**
  - Fixed typo: now called `NetworkTablesTypeInfos` (NetworkTables plural! With **S**!)

### New Features

- feat: allow multiple connections

### Bug fixes

- fix: rename NetworkTableTypeInfos to NetworkTablesTypeInfos
- fix: connect to the correct mDNS address
  - We were trying to connect to `roborio-frc-<team>.local` instead of `roborio-<team>-frc.local`
- fix: bug with creating instance on same URI w/ different port
- fix: queue value to published topic w/o server connection

### Misc commits

- chore: bump version

- chore: update deps
- style: prepend nt client id with `ntcore-ts-`
- chore: update deps
- chore: bump version to 0.2.0

### Non-library changes

- Improve docs by @Pokesi in <https://github.com/cjlawson02/ntcore-ts-client/pull/15>

- fix(ci): temporarily disable linting through CI by @cjlawson02 in <https://github.com/cjlawson02/ntcore-ts-client/pull/16>
- chore: upgrade tslib and dev deps by @cjlawson02 in <https://github.com/cjlawson02/ntcore-ts-client/pull/17>
- feat(dev): add commitlint for conventional commits enforcement by @cjlawson02 in <https://github.com/cjlawson02/ntcore-ts-client/pull/18>
- build(deps-dev): bump @typescript-eslint/eslint-plugin from 5.48.2 to 5.49.0 by @dependabot in <https://github.com/cjlawson02/ntcore-ts-client/pull/20>
- build(deps-dev): bump @typescript-eslint/parser from 5.48.2 to 5.49.0 by @dependabot in <https://github.com/cjlawson02/ntcore-ts-client/pull/19>
- build(deps-dev): bump eslint-plugin-jsdoc from 39.6.7 to 40.0.0 by @dependabot in <https://github.com/cjlawson02/ntcore-ts-client/pull/27>
- build(deps): bump tslib from 2.4.1 to 2.5.0 by @dependabot in <https://github.com/cjlawson02/ntcore-ts-client/pull/25>
- build(deps-dev): bump jest and @types/jest by @dependabot in <https://github.com/cjlawson02/ntcore-ts-client/pull/28>

## 0.0.1-beta.5

- Breaking changes:
  - renamed NetworkTableTypes to NetworkTablesTypes

## 0.0.1-beta.4

- Note: beta.1-beta.3 were tests of publishing to NPM and small fixes
- Fixed dependency issue
- Added keywords
- Breaking changes:
  - renamed Topic to NetworkTablesTopic
  - renamed NetworkTableTypeInfo to NetworkTablesTypeInfo
  - Moved to ES5/CommonJS compiling

## 0.0.1-beta.0

- Initial Release
