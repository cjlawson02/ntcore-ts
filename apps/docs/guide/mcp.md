# MCP server

[`@ntcore-ts/mcp`](https://www.npmjs.com/package/@ntcore-ts/mcp) is a [Model Context Protocol](https://modelcontextprotocol.io/) server for live NetworkTables. MCP hosts such as Cursor and Claude Desktop can connect, inventory topics, read values (including decoded structs), sample updates, and publish when the write gate is open.

It is built on [`@ntcore-ts/client`](/guide/getting-started). It is not a Driver Station and does not replace offline WPILOG tools.

## Install

```bash
npm install -g @ntcore-ts/mcp
# or run without a global install:
npx ntcore-ts-mcp
```

## Cursor / Claude Desktop

Add a stdio server to your MCP config:

```json
{
  "mcpServers": {
    "ntcore-ts": {
      "command": "npx",
      "args": ["-y", "ntcore-ts-mcp"],
      "env": {
        "NT_ALLOW_WRITES": "0",
        "NT_REQUIRE_LOCALHOST": "1"
      }
    }
  }
}
```

From this monorepo (development):

```json
{
  "mcpServers": {
    "ntcore-ts": {
      "command": "npx",
      "args": ["tsx", "packages/mcp/src/cli.ts"],
      "cwd": "/path/to/ntcore-ts",
      "env": {
        "NT_ALLOW_WRITES": "0",
        "NT_REQUIRE_LOCALHOST": "1"
      }
    }
  }
}
```

Reload the MCP server in the host after changing the config. Point it at a running NT server (for example `npm run serve -w @ntcore-ts/example-robot` on port `5810`).

## Agent workflow

1. Call `nt_guide` first if you need the tool map and write-gate status.
2. `nt_connect` with `host` / `port` (or the team / URI options the tool accepts).
3. `nt_list_topics` with a prefix such as `/MyTable/`.
4. Use `nt_get` / `nt_get_multiple` for scalars, arrays, and JSON.
5. Use `nt_get_decoded` for `struct:…` / protobuf topics (returns JSON).
6. Use `nt_subscribe` for a short timed sample window (`summary` or `samples`).
7. Enable writes only when needed (see below), then `nt_set` / `nt_set_multiple`.
8. `nt_disconnect` when finished.

## Tools

| Tool                                                  | Role                                              |
| ----------------------------------------------------- | ------------------------------------------------- |
| `nt_guide`                                            | Workflow, tool choice, write-gate status          |
| `nt_connect` / `nt_disconnect` / `nt_connection_info` | Session                                           |
| `nt_list_topics`                                      | Inventory (prefix filter)                         |
| `nt_get` / `nt_get_multiple`                          | Scalars / arrays / JSON                           |
| `nt_get_decoded`                                      | Struct / protobuf → JSON                          |
| `nt_subscribe`                                        | Timed sample window                               |
| `nt_list_struct_types`                                | Built-in + discovered struct names                |
| `nt_set_write_mode`                                   | Enable/disable writes (`confirm: true` to enable) |
| `nt_set` / `nt_set_multiple`                          | Gated publish                                     |

## Writes (safety)

Writes are off by default.

- Enable for the session: `nt_set_write_mode({ enabled: true, confirm: true })`
- Or start the process with `NT_ALLOW_WRITES=1`
- Path allowlist (default): `/SmartDashboard/**,/Tuning/**,/MyTable/**` via `NT_WRITE_ALLOWLIST`
- Optional: `NT_REQUIRE_LOCALHOST=1` refuses writes when the NT host is not local

Do not use NT writes to enable or disable a robot on the field.

## Programmatic use

You can drive the same service from Node without an MCP host:

```typescript
import { createNtMcpServer, NtMcpService } from '@ntcore-ts/mcp';

const service = new NtMcpService();
await service.connect({ host: 'localhost', port: 5810 });
const list = service.listTopics('/MyTable/');

const server = createNtMcpServer({ service });
```

## Implementation notes

- Topic discovery uses short-lived prefix snapshots. A long-lived `prefix=/` subscription on the same client instance can block later typed topic subscriptions; the MCP layer snapshot-then-unsubscribes and decodes struct bytes from inventory for `nt_get_decoded`.
- The MCP process sets the client log level to silent so library logs never hit stdout (stdout is the JSON-RPC channel). Package messages go to stderr as single lines.

## See also

- [Getting started](/guide/getting-started) — connect with `@ntcore-ts/client`
- [Struct](/guide/struct) / [Protobuf](/guide/protobuf) — binary topic types agents decode via `nt_get_decoded`
- Package README in the repo: `packages/mcp/README.md`
