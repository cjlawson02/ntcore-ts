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
- Path allowlist (default): `/SmartDashboard/**`, `/Tuning/**`, `/MyTable/**` via `NT_WRITE_ALLOWLIST`.
- Optional: `NT_REQUIRE_LOCALHOST=1` refuses writes to non-local hosts.

### Runtime

- **stdio MCP server** — `npx ntcore-ts-mcp` (or `npx -y ntcore-ts-mcp` in host configs). Client logging is silenced so stdout stays JSON-RPC.
- **Programmatic API** — `createNtMcpServer`, `NtMcpService`, `NtSession`, `WriteGate`, and helpers for tests or in-process hosts.
- Server version is read from this package’s `package.json`.
