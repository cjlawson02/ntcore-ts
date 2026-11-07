# [@ntcore-ts/mcp-v1.1.0](https://github.com/cjlawson02/ntcore-ts/compare/@ntcore-ts/mcp-v1.0.0...@ntcore-ts/mcp-v1.1.0) (2026-11-07)


### Features

* release 1.1.0 - structs, publish fixes, and performance ([#684](https://github.com/cjlawson02/ntcore-ts/issues/684)) ([a82a6dc](https://github.com/cjlawson02/ntcore-ts/commit/a82a6dc8addbbe7c0505e332d922f998c4fbd493))

# [@ntcore-ts/mcp-v1.1.0-beta.3](https://github.com/cjlawson02/ntcore-ts/compare/@ntcore-ts/mcp-v1.1.0-beta.2...@ntcore-ts/mcp-v1.1.0-beta.3) (2026-11-07)


### Bug Fixes

* publish packages with valid dist entry points ([3a667cd](https://github.com/cjlawson02/ntcore-ts/commit/3a667cd134a1484ce7763918ab21bf56ab140ef3))

# [@ntcore-ts/mcp-v1.1.0-beta.2](https://github.com/cjlawson02/ntcore-ts/compare/@ntcore-ts/mcp-v1.1.0-beta.1...@ntcore-ts/mcp-v1.1.0-beta.2) (2026-11-07)

### Bug Fixes

- **release:** load each package's release config ([#679](https://github.com/cjlawson02/ntcore-ts/issues/679)) ([2281951](https://github.com/cjlawson02/ntcore-ts/commit/228195144a8cdf52aac4ceaaa636a1889711924b))

# Changelog

## @ntcore-ts/mcp-v1.0.0

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
