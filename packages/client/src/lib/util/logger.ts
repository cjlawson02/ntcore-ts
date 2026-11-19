/**
 * Log levels available for configuration.
 */
export enum LogLevel {
  /** Very detailed debugging information */
  TRACE = 1,
  /** Detailed debugging information */
  DEBUG = 2,
  /** General informational messages */
  INFO = 3,
  /** Warning messages */
  WARN = 4,
  /** Error messages */
  ERROR = 5,
  /** Fatal error messages */
  FATAL = 6,
  /** Disable all logging */
  SILENT = 99,
}

/**
 * Module names for granular logging control.
 */
export type LoggerModule = 'socket' | 'messenger' | 'pubsub' | 'default';

let globalLevel = LogLevel.INFO;
const moduleLevels = new Map<LoggerModule, LogLevel>();

/**
 * Sets the log level for all modules, clearing any module-specific levels.
 * @param level - The log level to set.
 */
export function setLogLevel(level: LogLevel): void {
  globalLevel = level;
  moduleLevels.clear();
}

/**
 * Sets the log level for a specific module.
 * @param module - The module name.
 * @param level - The log level to set.
 */
export function setModuleLogLevel(module: LoggerModule, level: LogLevel): void {
  moduleLevels.set(module, level);
}

/**
 * Gets the current log level for a specific module.
 * @param module - The module name.
 * @returns The current log level.
 */
export function getModuleLogLevel(module: LoggerModule = 'default'): LogLevel {
  return moduleLevels.get(module) ?? globalLevel;
}

/**
 * Creates a logger that writes to the console method matching each level, so browser DevTools can filter by level.
 * @param module - The module name.
 * @returns A logger for the module.
 */
function createLogger(module: LoggerModule) {
  const prefix = `[${module.toUpperCase()}]`;
  const method =
    (level: LogLevel, consoleMethod: 'debug' | 'info' | 'warn') =>
    (message: string, ...args: unknown[]): void => {
      if (level >= getModuleLogLevel(module)) {
        console[consoleMethod](`${prefix} ${message}`, ...args);
      }
    };

  return {
    trace: method(LogLevel.TRACE, 'debug'),
    debug: method(LogLevel.DEBUG, 'debug'),
    info: method(LogLevel.INFO, 'info'),
    warn: method(LogLevel.WARN, 'warn'),
  };
}

export const socketLogger = createLogger('socket');
export const messengerLogger = createLogger('messenger');
export const pubsubLogger = createLogger('pubsub');
export const defaultLogger = createLogger('default');
