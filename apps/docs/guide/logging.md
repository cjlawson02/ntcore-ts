# Logging

The library logs through the built-in `console`, prefixed with the module name. `TRACE` and `DEBUG` use `console.debug`, `INFO` uses `console.info`, and `WARN` uses `console.warn`, so browser DevTools can filter them by level (Chrome hides `console.debug` unless "Verbose" is enabled). You can set log levels globally or per module (`socket`, `messenger`, `pubsub`) at runtime.

## Log levels

- `LogLevel.TRACE` — Very detailed debugging information
- `LogLevel.DEBUG` — Detailed debugging information
- `LogLevel.INFO` — General informational messages (default)
- `LogLevel.WARN` — Warning messages
- `LogLevel.ERROR` — Error messages (the library currently logs nothing at this level, so it behaves like `SILENT`)
- `LogLevel.FATAL` — Fatal error messages (likewise unused)
- `LogLevel.SILENT` — Disable all logging

## Global log level

```typescript
import { NetworkTables, LogLevel } from '@ntcore-ts/client';

NetworkTables.setLogLevel(LogLevel.DEBUG);
NetworkTables.setLogLevel(LogLevel.SILENT);
```

## Module-specific log levels

```typescript
import { NetworkTables, LogLevel } from '@ntcore-ts/client';

NetworkTables.setModuleLogLevel('socket', LogLevel.DEBUG);
NetworkTables.setModuleLogLevel('messenger', LogLevel.WARN);
NetworkTables.setModuleLogLevel('pubsub', LogLevel.SILENT);
```

Available modules:

- `'socket'` — WebSocket connection management
- `'messenger'` — Message publishing and subscription handling
- `'pubsub'` — Topic management and value updates
- `'default'` — General library logging

## Getting the current log level

```typescript
import { NetworkTables, LogLevel } from '@ntcore-ts/client';

const currentLevel = NetworkTables.getModuleLogLevel('socket');
console.log(`Socket log level: ${LogLevel[currentLevel]}`);
```

## Default behavior

By default, the library logs:

- `INFO`: Connection status, protocol version
- `WARN`: Connection loss, malformed or unhandled messages

`DEBUG` and `TRACE` messages (reconnection attempts, topic creation, unknown topics) are hidden unless you lower the log level.

Example output at the default level:

```
[SOCKET] Connected on NT 4.1
[SOCKET] Robot Connected!
```

## Direct logger utilities

```typescript
import { LogLevel, setLogLevel, setModuleLogLevel, LoggerModule } from '@ntcore-ts/client';

setLogLevel(LogLevel.INFO);
setModuleLogLevel('socket' as LoggerModule, LogLevel.DEBUG);
```
