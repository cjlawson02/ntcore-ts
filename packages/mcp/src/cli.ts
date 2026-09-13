import { LogLevel, NetworkTables } from '@ntcore-ts/client';
import { serveStdio } from '@modelcontextprotocol/server/stdio';

import { createNtMcpServer } from './server.js';
import { logInfo } from './log.js';

// stdout is the MCP JSON-RPC channel — never let the NT client logger write there.
NetworkTables.setLogLevel(LogLevel.SILENT);

logInfo('Starting stdio MCP server');
serveStdio(() => createNtMcpServer());
