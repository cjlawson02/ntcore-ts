import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@ntcore-ts/client', () => {
  class FakeTopic {
    value: unknown = null;
    lastChangedTime: number | null = null;
    private listeners: ((v: unknown) => void)[] = [];
    constructor(
      public name: string,
      public typeInfo: [number, string] = [2, 'double']
    ) {}
    getValue() {
      return this.value;
    }
    subscribe(cb: (v: unknown) => void) {
      this.listeners.push(cb);
      if (this.value != null) cb(this.value);
      return this.listeners.length;
    }
    unsubscribe() {
      return undefined;
    }
    publish() {
      return Promise.resolve(undefined);
    }
    setValue(v: unknown) {
      this.value = v;
      for (const l of this.listeners) l(v);
    }
  }

  class FakePrefix {
    constructor(public prefix: string) {}
    subscribe(cb: (value: unknown, params: { name: string; type: string; id: number; properties: null }) => void) {
      // announce a few topics immediately
      cb(1.5, { name: '/MyTable/Gyro', type: 'double', id: 1, properties: null });
      cb(
        { translation: { x: 1, y: 2 }, rotation: { value: 0 } },
        { name: '/MyTable/PoseStruct', type: 'struct:Pose2d', id: 2, properties: null }
      );
      return 1;
    }
    unsubscribe() {
      return undefined;
    }
  }

  const topics = new Map<string, FakeTopic>();

  const nt = {
    isRobotConnected: () => true,
    isRobotConnecting: () => false,
    getRttMs: () => 12,
    getURI: () => 'localhost',
    getPort: () => 5810,
    addRobotConnectionListener: (cb: (c: boolean) => void, immediate?: boolean) => {
      if (immediate) cb(true);
      return () => undefined;
    },
    close: () => undefined,
    getPrefixTopic: (prefix: string) => new FakePrefix(prefix),
    getDoubleTopic: (name: string) => {
      let t = topics.get(name);
      if (!t) {
        t = new FakeTopic(name, [2, 'double']);
        t.value = 1.5;
        topics.set(name, t);
      }
      return t;
    },
    getStructTopic: (name: string) => {
      let t = topics.get(name);
      if (!t) {
        t = new FakeTopic(name, [5, 'struct:Pose2d']);
        t.value = { translation: { x: 1, y: 2 }, rotation: { value: 0 } };
        topics.set(name, t);
      }
      return t;
    },
    getBooleanTopic: (name: string) => new FakeTopic(name, [0, 'boolean']),
    getIntegerTopic: (name: string) => new FakeTopic(name, [3, 'int']),
    getFloatTopic: (name: string) => new FakeTopic(name, [4, 'float']),
    getStringTopic: (name: string) => new FakeTopic(name, [1, 'string']),
    getBooleanArrayTopic: (name: string) => new FakeTopic(name, [16, 'boolean[]']),
    getDoubleArrayTopic: (name: string) => new FakeTopic(name, [18, 'double[]']),
    getIntegerArrayTopic: (name: string) => new FakeTopic(name, [19, 'int[]']),
    getFloatArrayTopic: (name: string) => new FakeTopic(name, [20, 'float[]']),
    getStringArrayTopic: (name: string) => new FakeTopic(name, [17, 'string[]']),
    getJsonTopic: (name: string) => new FakeTopic(name, [21, 'json']),
    getRawTopic: (name: string) => new FakeTopic(name, [5, 'raw']),
    getProtobufTopic: (name: string) => new FakeTopic(name, [5, 'protobuf']),
  };

  return {
    NetworkTables: {
      getInstanceByURI: () => nt,
      getInstanceByTeam: () => nt,
    },
    Pose2d: { typeName: 'Pose2d', schema: {} },
    Pose3d: { typeName: 'Pose3d', schema: {} },
    Quaternion: { typeName: 'Quaternion', schema: {} },
    Rotation2d: { typeName: 'Rotation2d', schema: {} },
    Rotation3d: { typeName: 'Rotation3d', schema: {} },
    Transform2d: { typeName: 'Transform2d', schema: {} },
    Transform3d: { typeName: 'Transform3d', schema: {} },
    Translation2d: { typeName: 'Translation2d', schema: {} },
    Translation3d: { typeName: 'Translation3d', schema: {} },
    Twist2d: { typeName: 'Twist2d', schema: {} },
    Twist3d: { typeName: 'Twist3d', schema: {} },
    getBuiltInDescriptor: () => null,
    unpack: () => ({}),
    pack: () => new Uint8Array(),
    BUILT_IN_STRUCT_TYPE_NAMES: ['Pose2d', 'Translation2d'],
  };
});

import { NtMcpService } from './service.js';

describe('NtMcpService', () => {
  let service: NtMcpService;

  beforeEach(() => {
    service = new NtMcpService();
  });

  it('nt_guide includes workflow and write gate', () => {
    const r = service.guide();
    expect(r.structuredContent.callFirst).toBe('nt_guide');
    expect(r.structuredContent.writeGate).toMatchObject({ enabled: false });
  });

  it('connects and lists topics', async () => {
    const conn = await service.connect({ host: 'localhost', port: 5810 });
    expect(conn.isError).toBeUndefined();
    expect(conn.structuredContent.connected).toBe(true);

    const list = await service.listTopics('/MyTable/');
    expect(list.structuredContent.count).toBeGreaterThanOrEqual(2);
    const names = (list.structuredContent.topics as { name: string }[]).map((t) => t.name);
    expect(names).toContain('/MyTable/Gyro');
  });

  it('gets scalar and decoded struct', async () => {
    await service.connect({ host: 'localhost' });
    await service.listTopics('/MyTable/');

    const gyro = await service.get('/MyTable/Gyro');
    expect(gyro.structuredContent.value).toBe(1.5);

    const pose = await service.getDecoded('/MyTable/PoseStruct');
    expect(pose.structuredContent.value).toMatchObject({
      translation: { x: 1, y: 2 },
    });
  });

  it('refuses set when write gate off', async () => {
    await service.connect({ host: 'localhost' });
    await service.listTopics('/MyTable/');
    const r = await service.set('/MyTable/Gyro', 9, 'double');
    expect(r.isError).toBe(true);
    expect(String(r.structuredContent.error)).toMatch(/disabled/i);
  });

  it('allows set when write gate enabled', async () => {
    await service.connect({ host: 'localhost' });
    await service.listTopics('/MyTable/');
    service.setWriteMode(true, true);
    const r = await service.set('/MyTable/Gyro', 9, 'double');
    expect(r.isError).toBeUndefined();
    expect(r.structuredContent.published).toBe(true);
  });

  it('lists builtin struct types', () => {
    const r = service.listStructTypes();
    expect(r.structuredContent.builtin).toContain('Pose2d');
  });
});
