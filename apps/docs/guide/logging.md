# Logging

The library uses [tslog](https://github.com/fullstack-build/tslog). You can set log levels globally or per module (`socket`, `messenger`, `pubsub`) at runtime.

## Log levels

- `LogLevel.TRACE` — Very detailed debugging information
- `LogLevel.DEBUG` — Detailed debugging information
- `LogLevel.INFO` — General informational messages (default)
- `LogLevel.WARN` — Warning messages
- `LogLevel.ERROR` — Error messages
- `LogLevel.FATAL` — Fatal error messages
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
- `WARN`: Connection issues, unhandled message types
- `ERROR`: WebSocket errors, connection failures
- `DEBUG`: Reconnection attempts, unknown topics (development only)

Example output:

```
2024.01.15 14:30:25:123	[INFO]	SOCKET	Connected on NT 4.1
2024.01.15 14:30:25:124	[INFO]	SOCKET	Robot Connected!
2024.01.15 14:30:30:456	[DEBUG]	PUBSUB	Received update for unknown topic { topicId: 42 }
```

## Direct logger utilities

```typescript
import { LogLevel, setLogLevel, setModuleLogLevel, LoggerModule } from '@ntcore-ts/client';

setLogLevel(LogLevel.INFO);
setModuleLogLevel('socket' as LoggerModule, LogLevel.DEBUG);
```
