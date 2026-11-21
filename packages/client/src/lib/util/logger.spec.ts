import {
  LogLevel,
  getModuleLogLevel,
  setLogLevel,
  setModuleLogLevel,
  setLogHandler,
  setLogTimestamps,
  socketLogger,
  messengerLogger,
} from './logger.js';

describe('logger utilities', () => {
  beforeEach(() => {
    setLogLevel(LogLevel.INFO);
    setLogTimestamps(false);
  });

  afterEach(() => {
    setLogHandler(null);
    vi.restoreAllMocks();
  });

  it('setLogLevel should clear module-specific levels', () => {
    setModuleLogLevel('socket', LogLevel.DEBUG);

    setLogLevel(LogLevel.ERROR);

    expect(getModuleLogLevel('socket')).toBe(LogLevel.ERROR);
    expect(getModuleLogLevel('messenger')).toBe(LogLevel.ERROR);
  });

  it('setModuleLogLevel should only affect the specified module', () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});

    setModuleLogLevel('socket', LogLevel.DEBUG);
    socketLogger.debug('socket message', { id: 1 });
    messengerLogger.debug('messenger message');

    expect(getModuleLogLevel('messenger')).toBe(LogLevel.INFO);
    expect(debug).toHaveBeenCalledExactlyOnceWith('[SOCKET] socket message', { id: 1 });
  });

  it('should write each level to the matching console method and skip levels below the minimum', () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    socketLogger.trace('trace');
    socketLogger.debug('debug');
    socketLogger.info('info');
    socketLogger.warn('warn');

    expect(debug).not.toHaveBeenCalled();
    expect(info).toHaveBeenCalledExactlyOnceWith('[SOCKET] info');
    expect(warn).toHaveBeenCalledExactlyOnceWith('[SOCKET] warn');
  });

  it('SILENT should suppress warnings', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    setLogLevel(LogLevel.SILENT);
    socketLogger.warn('warn');

    expect(warn).not.toHaveBeenCalled();
  });

  it('prefixes console lines with an ISO timestamp when enabled', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});

    setLogTimestamps(true);
    socketLogger.info('info', { id: 1 });

    expect(info).toHaveBeenCalledExactlyOnceWith(
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \[SOCKET\] info$/),
      { id: 1 }
    );
  });

  it('sends lines that pass the level filter to a custom handler instead of the console', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const logHandler = vi.fn();

    setLogHandler(logHandler);
    socketLogger.debug('hidden');
    socketLogger.info('shown', { id: 1 });

    expect(info).not.toHaveBeenCalled();
    expect(logHandler).toHaveBeenCalledExactlyOnceWith({
      level: LogLevel.INFO,
      module: 'socket',
      message: 'shown',
      args: [{ id: 1 }],
      time: expect.any(Date),
    });
  });

  it('logs to the console again after the handler is cleared', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});

    setLogHandler(vi.fn());
    setLogHandler(null);
    socketLogger.info('info');

    expect(info).toHaveBeenCalledExactlyOnceWith('[SOCKET] info');
  });
});
