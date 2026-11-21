# @ntcore-ts/mcp

## 2.0.0

### Major Changes

- [#714](https://github.com/cjlawson02/ntcore-ts/pull/714) [`64d8958`](https://github.com/cjlawson02/ntcore-ts/commit/64d8958609c92a84751fe74ab2ea79871ad1856a) Thanks [@jonahsnider](https://github.com/jonahsnider)! - **Breaking:** Node.js 22 or newer is now required. The client uses the runtime's built-in `WebSocket` instead of the `isomorphic-ws` and `ws` packages, and Node.js only provides a global `WebSocket` from version 22. Browsers, Deno, and Bun are unaffected.
  
  If you run the client on Node.js 20 or older, upgrade Node.js before updating this package.
  
  `@ntcore-ts/mcp` runs on Node.js and now declares the same Node.js 22+ requirement.

### Patch Changes

- Updated dependencies [[`64d8958`](https://github.com/cjlawson02/ntcore-ts/commit/64d8958609c92a84751fe74ab2ea79871ad1856a), [`8120681`](https://github.com/cjlawson02/ntcore-ts/commit/8120681b2a69da7c72fa2101488294d261e57d3a), [`96f5aa0`](https://github.com/cjlawson02/ntcore-ts/commit/96f5aa05ee3b43ceb824519574519b4716173035), [`aa65b9e`](https://github.com/cjlawson02/ntcore-ts/commit/aa65b9e7ef677c64175999e2da8bd948eef5f38a), [`5285456`](https://github.com/cjlawson02/ntcore-ts/commit/5285456e4e460207e5826d14d07261eb983dfac9), [`d6580a8`](https://github.com/cjlawson02/ntcore-ts/commit/d6580a8ccef1044bbc9fc1446073ba37643993e3), [`68d3685`](https://github.com/cjlawson02/ntcore-ts/commit/68d36853dc1b5a67e01773884f9639fccf41bbe6)]:
  - @ntcore-ts/client@2.0.0

## 1.1.0 (2026-11-07)

[Compare changes](https://github.com/cjlawson02/ntcore-ts/compare/@ntcore-ts/mcp-v1.0.0...@ntcore-ts/mcp-v1.1.0)


### Features

* release 1.1.0 - structs, publish fixes, and performance ([#684](https://github.com/cjlawson02/ntcore-ts/issues/684)) ([a82a6dc](https://github.com/cjlawson02/ntcore-ts/commit/a82a6dc8addbbe7c0505e332d922f998c4fbd493))

## 1.1.0-beta.3 (2026-11-07)

[Compare changes](https://github.com/cjlawson02/ntcore-ts/compare/@ntcore-ts/mcp-v1.1.0-beta.2...@ntcore-ts/mcp-v1.1.0-beta.3)


### Bug Fixes

* publish packages with valid dist entry points ([3a667cd](https://github.com/cjlawson02/ntcore-ts/commit/3a667cd134a1484ce7763918ab21bf56ab140ef3))

## 1.1.0-beta.2 (2026-11-07)

[Compare changes](https://github.com/cjlawson02/ntcore-ts/compare/@ntcore-ts/mcp-v1.1.0-beta.1...@ntcore-ts/mcp-v1.1.0-beta.2)

### Bug Fixes

- **release:** load each package's release config ([#679](https://github.com/cjlawson02/ntcore-ts/issues/679)) ([2281951](https://github.com/cjlawson02/ntcore-ts/commit/228195144a8cdf52aac4ceaaa636a1889711924b))

## 1.0.0

First stable release of `@ntcore-ts/mcp` — a Model Context Protocol server for live NetworkTables, built on `@ntcore-ts/client`. MCP hosts (Cursor, Claude Desktop, and others) can connect, inventory topics, read values (including decoded structs), sample updates, and publish when the write gate is open.

This is not a Driver Station. NetworkTables cannot enable or disable the robot (FMS/Driver Station does that). Do not let an agent command a live robot — published values can still move mechanisms if robot code is listening.

### Tools

- **`nt_guide`** — start here. Workflow, tool choice (`nt_get` vs `nt_get_decoded` vs `nt_subscribe`), write-gate status, and safety rules.
- **`nt_connect` / `nt_disconnect` / `nt_connection_info`** — session. Connect by host/URI or team number (RoboRIO or SystemCore).
- **`nt_list_topics`** — inventory with optional prefix filter.
- **`nt_get` / `nt_get_multiple`** — scalars, arrays, and JSON.
- **`nt_get_decoded`** — struct / protobuf payloads as JSON.
- **`nt_subscribe`** — timed sample window (`summary` or `samples`).
- **`nt_list_struct_types`** — built-in and discovered struct type names.
- **`nt_set_write_mode`** — enable or disable writes for the session (`confirm: true` required to enable).
- **`nt_set` / `nt_set_multiple`** — gated publish. Fails if the gate is off, the path is outside the allowlist, or types mismatch.

### Write safety

Writes are **off by default**.

- Enable for the session: `nt_set_write_mode({ enabled: true, confirm: true })`.
- Or start the process with `NT_ALLOW_WRITES=1`.
- Path allowlist (default): `/SmartDashboard/**`, `/Tuning/**`, `/MyTable/**`, `/Telemetry/**`, `/Tunables/**` via `NT_WRITE_ALLOWLIST`. The last two are the WPILib 2027 topic trees.
- Optional: `NT_REQUIRE_LOCALHOST=1` refuses writes to non-local hosts.

### Runtime

- **stdio MCP server** — `npx ntcore-ts-mcp` (or `npx -y ntcore-ts-mcp` in host configs). Client logging is silenced so stdout stays JSON-RPC.
- **Programmatic API** — `createNtMcpServer`, `NtMcpService`, `NtSession`, `WriteGate`, and helpers for tests or in-process hosts.
- Server version is read from this package’s `package.json`.
