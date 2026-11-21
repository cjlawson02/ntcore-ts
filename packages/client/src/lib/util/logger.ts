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

/** A log line passed to a handler set with {@link setLogHandler}. */
export interface LogEntry {
  /** The level the line was logged at. */
  level: LogLevel;
  /** The module that logged the line. */
  module: LoggerModule;
  /** The log message, without the module prefix. */
  message: string;
  /** Extra arguments passed with the message, usually a context object. */
  args: unknown[];
  /** When the line was logged. */
  time: Date;
}

/** Receives every log line that passes the level filter. */
export type LogHandler = (entry: LogEntry) => void;

let globalLevel = LogLevel.INFO;
const moduleLevels = new Map<LoggerModule, LogLevel>();
let handler: LogHandler | null = null;
// Browser DevTools can already show timestamps, so only add them by default outside the browser
let timestamps = typeof document === 'undefined';

/**
 * Sends log lines to a custom handler instead of the console, e.g. to forward them to your own logger.
 * Level filtering still applies before the handler is called.
 * @param logHandler - The handler, or `null` to log to the console again.
 */
export function setLogHandler(logHandler: LogHandler | null): void {
  handler = logHandler;
}

/**
 * Sets whether console log lines start with an ISO timestamp. On by default outside the browser.
 * Has no effect on lines sent to a handler set with {@link setLogHandler}, which receive `time` instead.
 * @param enabled - Whether to add timestamps.
 */
export function setLogTimestamps(enabled: boolean): void {
  timestamps = enabled;
}

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
      if (level < getModuleLogLevel(module)) return;
      if (handler) {
        handler({ level, module, message, args, time: new Date() });
        return;
      }
      const line = timestamps ? `${new Date().toISOString()} ${prefix} ${message}` : `${prefix} ${message}`;
      console[consoleMethod](line, ...args);
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
