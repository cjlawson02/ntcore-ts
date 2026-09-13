/** Stderr-only logging for stdio MCP servers (stdout is the protocol channel). */

function writeStderr(prefix: string, message: string, details?: Record<string, unknown>): void {
  // Single-line messages only — multi-line / multi-arg console.error can confuse MCP hosts.
  if (details && Object.keys(details).length > 0) {
    console.error(`${prefix} ${message} ${JSON.stringify(details)}`);
  } else {
    console.error(`${prefix} ${message}`);
  }
}

export function logInfo(message: string, details?: Record<string, unknown>): void {
  writeStderr('[ntcore-ts-mcp]', message, details);
}

export function logWarn(message: string, details?: Record<string, unknown>): void {
  writeStderr('[ntcore-ts-mcp:warn]', message, details);
}

export function logError(message: string, details?: Record<string, unknown>): void {
  writeStderr('[ntcore-ts-mcp:error]', message, details);
}
