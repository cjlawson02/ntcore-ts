# @ntcore-ts/mcp

Model Context Protocol (MCP) server for live [NetworkTables](https://docs.wpilib.org/en/stable/docs/software/networktables/networktables-intro.html), built on [`@ntcore-ts/client`](../client).

Exposes connect/discover/get/decode/subscribe tools to MCP hosts (Cursor, Claude Desktop, etc.), with **gated writes** and structured JSON evidence for agents.

## Install

```bash
npm install -g @ntcore-ts/mcp
# or use npx
npx ntcore-ts-mcp
```

## Cursor / Claude Desktop

```json
{
  "mcpServers": {
    "ntcore-ts": {
      "command": "npx",
      "args": ["-y", "ntcore-ts-mcp"],
      "env": {
        "NT_ALLOW_WRITES": "0"
      }
    }
  }
}
```

Local workspace (monorepo):

```json
{
  "mcpServers": {
    "ntcore-ts": {
      "command": "npx",
      "args": ["tsx", "packages/mcp/src/cli.ts"],
      "cwd": "/path/to/ntcore-ts"
    }
  }
}
```

Inspector:

```bash
npx @modelcontextprotocol/inspector npx tsx packages/mcp/src/cli.ts
```

## Tools

Call **`nt_guide`** first. Highlights:

| Tool                                                  | Role                                              |
| ----------------------------------------------------- | ------------------------------------------------- |
| `nt_connect` / `nt_disconnect` / `nt_connection_info` | Session                                           |
| `nt_list_topics`                                      | Inventory (prefix filter)                         |
| `nt_get` / `nt_get_multiple`                          | Scalars / arrays / JSON                           |
| `nt_get_decoded`                                      | Struct / protobuf → JSON                          |
| `nt_subscribe`                                        | Timed sample window (`summary` or `samples`)      |
| `nt_list_struct_types`                                | Built-in + discovered struct names                |
| `nt_set_write_mode`                                   | Enable/disable writes (`confirm: true` to enable) |
| `nt_set` / `nt_set_multiple`                          | Gated publish                                     |

## Writes (safety)

Writes are **off by default**.

- Enable for the session: `nt_set_write_mode({ enabled: true, confirm: true })`
- Or start with `NT_ALLOW_WRITES=1`
- Path allowlist (default): `/SmartDashboard/**,/Tuning/**,/MyTable/**` via `NT_WRITE_ALLOWLIST`
- Optional: `NT_REQUIRE_LOCALHOST=1` refuses writes to non-local hosts

This is **not** a Driver Station. Do not use NT writes to enable/disable a robot on the field.

## Programmatic use

```typescript
import { createNtMcpServer, NtMcpService } from '@ntcore-ts/mcp';

const service = new NtMcpService();
await service.connect({ host: 'localhost', port: 5810 });
const list = service.listTopics('/MyTable/');

// Or hand the factory to an MCP host transport:
const server = createNtMcpServer({ service });
```

## Docs

Full guide (install, tools, write gate, workflow): [MCP server](https://ntcore.chrislawson.dev/guide/mcp) in the VitePress site (`apps/docs/guide/mcp.md` in this repo).

## Notes

Topic discovery uses **short-lived prefix snapshots**. Leaving a long-lived `prefix=/` subscription open on the same `@ntcore-ts/client` instance prevents later typed topic subscriptions from receiving values; the MCP layer avoids that by snapshot-then-unsubscribe and by decoding struct bytes from inventory for `nt_get_decoded`.

The MCP process sets the client log level to **silent** so `tslog` never writes to stdout (which would corrupt the MCP JSON-RPC channel). Operational messages from this package go to stderr only, as single lines.

## Out of scope (for now)

- Offline WPILOG analysis
- Embedded roboRIO status MCP
- HTTP transport / MCP Resources / persistent poll subscriptions

## License

MIT
