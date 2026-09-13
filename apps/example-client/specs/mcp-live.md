# Feature: MCP live NetworkTables tools

In-process `@ntcore-ts/mcp` `NtMcpService` against the live example-robot NT4 server. Covers connect, inventory, get, decoded struct, timed subscribe summary, and gated writes.

## User stories

- As an agent host, I want to connect to a sim robot and discover topics so I can inspect live state.
- As an agent host, I want decoded struct values and timed summaries so I can gather evidence without a GUI.
- As an agent host, I want writes gated by default so I do not accidentally publish to the robot.

## Acceptance criteria

| ID    | Description                                                                                           |
| ----- | ----------------------------------------------------------------------------------------------------- |
| MCP-1 | `nt_connect` to localhost:5810 reports connected                                                      |
| MCP-2 | `nt_list_topics` includes `/MyTable/Gyro` with type `double`                                          |
| MCP-3 | `nt_get` returns a finite Gyro value                                                                  |
| MCP-4 | `nt_get_decoded` returns a Pose2d-shaped object for `/MyTable/PoseStruct`                             |
| MCP-5 | `nt_subscribe` summary for `/MyTable/` includes Gyro with count ≥ 1                                   |
| MCP-6 | `nt_set` fails while write gate is off                                                                |
| MCP-7 | With write gate on, publishing `/MyTable/PoseStructFromClient` is echoed on `/MyTable/PoseStructEcho` |

## Tests

| Test                                              | Covers | Status      |
| ------------------------------------------------- | ------ | ----------- |
| `[MCP-1] connects to example-robot`               | MCP-1  | Implemented |
| `[MCP-2] lists Gyro topic`                        | MCP-2  | Implemented |
| `[MCP-3] gets Gyro value`                         | MCP-3  | Implemented |
| `[MCP-4] decodes PoseStruct`                      | MCP-4  | Implemented |
| `[MCP-5] subscribe summary includes Gyro`         | MCP-5  | Implemented |
| `[MCP-6] refuses set when writes disabled`        | MCP-6  | Implemented |
| `[MCP-7] gated write round-trips PoseStruct echo` | MCP-7  | Implemented |

## Coverage

All MCP-1 through MCP-7 are covered by implemented tests.
