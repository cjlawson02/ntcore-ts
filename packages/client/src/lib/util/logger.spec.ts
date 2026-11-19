import {
  LogLevel,
  getModuleLogLevel,
  setLogLevel,
  setModuleLogLevel,
  socketLogger,
  messengerLogger,
} from './logger.js';

describe('logger utilities', () => {
  beforeEach(() => {
    setLogLevel(LogLevel.INFO);
  });

  afterEach(() => {
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
});
