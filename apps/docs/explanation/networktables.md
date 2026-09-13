# NetworkTables overview

[NetworkTables](https://github.com/wpilibsuite/allwpilib/blob/main/ntcore/doc/networktables4.adoc) is WPILib’s pub/sub key-value protocol used by FRC robots and dashboards. Version 4.1 runs over WebSockets with MessagePack framing.

ntcore-ts is a TypeScript and React client for that protocol. Use `@ntcore-ts/client` in Node.js or the browser, and `@ntcore-ts/react` for dashboard UIs.

## Features

- Connect by team number (RoboRIO or SystemCore) or by URI
- Typed topics (primitives, arrays, JSON, protobuf, WPILib structs)
- Prefix (wildcard) subscriptions
- Auto-reconnect, queued publishes during disconnect, and on-the-fly server switching
- Client-side Zod validation and RTT-based timestamps
- Per-module logging

## Packages

| Package             | Use when                                    |
| ------------------- | ------------------------------------------- |
| `@ntcore-ts/client` | Node scripts, non-React apps, shared logic  |
| `@ntcore-ts/react`  | React dashboards (`NtcoreProvider` + hooks) |

## Next

- [Getting started](/guide/getting-started)
- [Struct vs protobuf](/explanation/struct-vs-protobuf)
- [API reference](/api/)
