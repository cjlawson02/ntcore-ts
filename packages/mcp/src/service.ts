import { BUILTIN_STRUCT_TYPE_NAMES, isStructOrProtobufType, resolveTopic } from './router.js';
import { decodeInventoryValue, snapshotTopic } from './decode.js';
import { TopicInventory } from './inventory.js';
import { logInfo } from './log.js';
import { MAX_GET_MULTIPLE, MAX_TOPICS, jsonResult, toJsonSafe } from './response.js';
import { collectSamples, type SubscribeOptions } from './sampler.js';
import { NtSession, type ConnectOptions } from './session.js';
import { WriteGate } from './write-gate.js';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class NtMcpService {
  readonly session = new NtSession();
  readonly inventory = new TopicInventory();
  readonly writeGate = new WriteGate();

  guide(): ReturnType<typeof jsonResult> {
    const conn = this.session.getConnectionInfo();
    const writes = this.writeGate.getStatus();
    return jsonResult({
      connected: conn.connected,
      writeGate: writes,
      connection: conn,
      callFirst: 'nt_guide',
      workflow: [
        '1. Call nt_guide (this tool) if unfamiliar.',
        '2. nt_connect with team or host/port (sim: host=127.0.0.1 or localhost, port=5810).',
        '3. nt_list_topics to discover names/types.',
        '4. Prefer nt_get_decoded for struct:/proto: topics; nt_get for scalars.',
        '5. Use nt_subscribe for timed evidence (summary) instead of a single get when debugging dynamics.',
        '6. Writes are off by default. Enable with nt_set_write_mode({ enabled: true, confirm: true }) or NT_ALLOW_WRITES=1.',
      ],
      tools: {
        nt_connect: 'Open NT4 connection (team XOR host).',
        nt_disconnect: 'Close connection and clear inventory.',
        nt_connection_info: 'connected / RTT / endpoint.',
        nt_list_topics: 'Cached topic inventory (prefix filter).',
        nt_get: 'Single topic value (scalars/arrays/json; raw preview for bytes).',
        nt_get_multiple: 'Batch get (max 50).',
        nt_get_decoded: 'Decode struct/protobuf topics to JSON objects.',
        nt_subscribe: 'Sample prefixes for N seconds; format=summary|samples.',
        nt_list_struct_types: 'Built-in + discovered struct type names.',
        nt_set_write_mode: 'Enable/disable session writes (confirm required to enable).',
        nt_set: 'Publish one topic (gated + allowlist).',
        nt_set_multiple: 'Publish several topics (gated + allowlist).',
      },
      safety: [
        'NT writes cannot enable/disable the robot (FMS/DS). Do not let an agent command a live robot.',
        'Default allowlist: /SmartDashboard/**, /Tuning/**, /MyTable/** (override with NT_WRITE_ALLOWLIST).',
        'Set NT_REQUIRE_LOCALHOST=1 to refuse writes to non-local hosts.',
        'One sample is not root cause — prefer nt_subscribe summaries for live evidence.',
      ],
      outOfScope: [
        'WPILOG / offline log analysis (use wpilog-mcp).',
        'roboRIO DS status / subsystems (use refinery-roborio-mcp).',
        'HTTP MCP transport, MCP Resources, persistent poll subscriptions.',
      ],
    });
  }

  async connect(options: ConnectOptions): Promise<ReturnType<typeof jsonResult>> {
    try {
      this.inventory.stop();
      const info = await this.session.connect(options);
      const nt = this.session.requireClient();
      await this.inventory.start(nt, '/');
      return jsonResult({ ...info, inventoryStarted: true });
    } catch (err) {
      return jsonResult({ connected: false, error: err instanceof Error ? err.message : String(err) }, true);
    }
  }

  disconnect(): ReturnType<typeof jsonResult> {
    this.inventory.stop();
    this.session.disconnect();
    return jsonResult({ connected: false, disconnected: true });
  }

  connectionInfo(): ReturnType<typeof jsonResult> {
    const info = this.session.getConnectionInfo();
    return jsonResult({ ...info, writeGate: this.writeGate.getStatus() });
  }

  async listTopics(prefix?: string, limit = MAX_TOPICS): Promise<ReturnType<typeof jsonResult>> {
    try {
      const nt = this.session.requireClient();
      if (!this.inventory.isStarted) await this.inventory.start(nt, '/');
      else await this.inventory.refresh(prefix ?? '/', 250);
      const topics = this.inventory.list(prefix, limit);
      return jsonResult({
        connected: nt.isRobotConnected(),
        prefix: prefix ?? '/',
        count: topics.length,
        topics: topics.map(({ name, type, id, properties }) => ({ name, type, id, properties })),
      });
    } catch (err) {
      return jsonResult({ connected: false, error: err instanceof Error ? err.message : String(err) }, true);
    }
  }

  async get(topic: string): Promise<ReturnType<typeof jsonResult>> {
    try {
      const nt = this.session.requireClient();
      await this.inventory.refresh(topic.includes('/') ? topic.slice(0, topic.lastIndexOf('/') + 1) || '/' : '/', 350);
      let record = this.inventory.get(topic);
      if (!record) {
        const snap = await snapshotTopic(nt, topic, 400);
        if (snap) {
          this.inventory.upsert({ name: topic, id: -1, type: snap.type, properties: {} }, snap.rawValue);
          record = this.inventory.get(topic);
        }
      }
      if (!record) {
        return jsonResult(
          {
            connected: nt.isRobotConnected(),
            topic,
            error: `Unknown topic "${topic}". Call nt_list_topics first so the inventory can learn its type.`,
          },
          true
        );
      }
      const value = decodeInventoryValue(record.type, record.rawValue) ?? record.lastValue;
      return jsonResult({
        connected: nt.isRobotConnected(),
        topic,
        type: record.type,
        timestamp: record.lastChangedTime,
        value,
      });
    } catch (err) {
      return jsonResult(
        {
          connected: this.session.getConnectionInfo().connected,
          topic,
          error: err instanceof Error ? err.message : String(err),
        },
        true
      );
    }
  }

  async getMultiple(topics: string[]): Promise<ReturnType<typeof jsonResult>> {
    const slice = topics.slice(0, MAX_GET_MULTIPLE);
    const results = [];
    for (const topic of slice) {
      results.push((await this.get(topic)).structuredContent);
    }
    return jsonResult({
      connected: this.session.getConnectionInfo().connected,
      count: results.length,
      truncated: topics.length > MAX_GET_MULTIPLE,
      results,
    });
  }

  async getDecoded(topic: string, typeHint?: string): Promise<ReturnType<typeof jsonResult>> {
    try {
      const nt = this.session.requireClient();
      await this.inventory.refresh(topic.includes('/') ? topic.slice(0, topic.lastIndexOf('/') + 1) || '/' : '/', 400);
      let record = this.inventory.get(topic);
      if (!record) {
        const snap = await snapshotTopic(nt, topic, 500);
        if (snap) {
          this.inventory.upsert({ name: topic, id: -1, type: snap.type, properties: {} }, snap.rawValue);
          record = this.inventory.get(topic);
        }
      }
      const type = typeHint ?? record?.type;
      if (!type) {
        return jsonResult(
          {
            connected: nt.isRobotConnected(),
            topic,
            error: `Unknown topic type for "${topic}". Pass typeHint or call nt_list_topics first.`,
          },
          true
        );
      }
      if (!isStructOrProtobufType(type) && !(typeHint && isStructOrProtobufType(typeHint))) {
        return jsonResult(
          {
            connected: nt.isRobotConnected(),
            topic,
            type,
            error: `Topic type "${type}" is not struct/protobuf. Use nt_get instead, or pass typeHint like "struct:Pose2d".`,
          },
          true
        );
      }
      const wireType = typeHint && isStructOrProtobufType(typeHint) ? typeHint : type;
      const raw = record?.rawValue;
      let value = decodeInventoryValue(wireType, raw);
      // Fallback: short prefix snapshot dedicated to this topic
      if (
        value == null ||
        (raw instanceof Uint8Array && value && typeof value === 'object' && '__type' in (value as object))
      ) {
        const snap = await snapshotTopic(nt, topic, 500);
        if (snap) value = decodeInventoryValue(snap.type.startsWith('struct:') ? snap.type : wireType, snap.rawValue);
      }
      if (value == null) {
        return jsonResult(
          {
            connected: nt.isRobotConnected(),
            topic,
            type: wireType,
            error:
              'Decoded value is null. For custom structs, ensure the schema is published; built-in geometry types decode from inventory snapshots.',
          },
          true
        );
      }
      return jsonResult({
        connected: nt.isRobotConnected(),
        topic,
        type: wireType,
        timestamp: record?.lastChangedTime ?? null,
        value,
      });
    } catch (err) {
      return jsonResult(
        {
          connected: this.session.getConnectionInfo().connected,
          topic,
          error: err instanceof Error ? err.message : String(err),
        },
        true
      );
    }
  }

  listStructTypes(): ReturnType<typeof jsonResult> {
    const discovered = this.inventory.discoveredStructTypes();
    return jsonResult({
      connected: this.session.getConnectionInfo().connected,
      builtin: BUILTIN_STRUCT_TYPE_NAMES,
      discovered,
    });
  }

  async subscribe(options: SubscribeOptions): Promise<ReturnType<typeof jsonResult>> {
    try {
      const nt = this.session.requireClient();
      const types: Record<string, string> = {};
      for (const t of this.inventory.list()) {
        types[t.name] = t.type;
      }
      const result = await collectSamples(nt, { ...options, types: { ...types, ...options.types } });
      return jsonResult({ connected: nt.isRobotConnected(), ...result });
    } catch (err) {
      return jsonResult(
        {
          connected: this.session.getConnectionInfo().connected,
          error: err instanceof Error ? err.message : String(err),
        },
        true
      );
    }
  }

  setWriteMode(enabled: boolean, confirm: boolean): ReturnType<typeof jsonResult> {
    try {
      const status = this.writeGate.setWriteMode(enabled, confirm);
      return jsonResult({ connected: this.session.getConnectionInfo().connected, writeGate: status });
    } catch (err) {
      return jsonResult(
        {
          connected: this.session.getConnectionInfo().connected,
          error: err instanceof Error ? err.message : String(err),
        },
        true
      );
    }
  }

  async set(topic: string, value: unknown, expectedType?: string): Promise<ReturnType<typeof jsonResult>> {
    try {
      const nt = this.session.requireClient();
      const host = nt.getURI();
      this.writeGate.assertCanWrite(topic, host);
      const record = this.inventory.get(topic);
      const type = expectedType ?? record?.type;
      if (!type) {
        throw new Error(
          `Cannot determine type for "${topic}". Pass expected_type or ensure the topic is announced (nt_list_topics).`
        );
      }
      if (expectedType && record?.type && expectedType !== record.type) {
        throw new Error(`Type mismatch: expected_type=${expectedType} but announced type=${record.type}`);
      }
      const handle = resolveTopic(nt, topic, type);
      await handle.publish({ retained: true });
      // Allow publish announce to settle (server rejects set before publish is registered)
      await sleep(50);
      handle.setValue(value);
      this.writeGate.auditWrite(topic, JSON.stringify(toJsonSafe(value)).slice(0, 200));
      this.inventory.updateValue(topic, value);
      logInfo('Published', { topic, type });
      return jsonResult({
        connected: nt.isRobotConnected(),
        topic,
        type,
        published: true,
        value: toJsonSafe(value),
      });
    } catch (err) {
      return jsonResult(
        {
          connected: this.session.getConnectionInfo().connected,
          topic,
          error: err instanceof Error ? err.message : String(err),
        },
        true
      );
    }
  }

  async setMultiple(
    updates: { topic: string; value: unknown; expected_type?: string }[]
  ): Promise<ReturnType<typeof jsonResult>> {
    const results = [];
    for (const u of updates) {
      results.push((await this.set(u.topic, u.value, u.expected_type)).structuredContent);
    }
    const anyError = results.some((r) => typeof r.error === 'string');
    return jsonResult(
      {
        connected: this.session.getConnectionInfo().connected,
        count: results.length,
        results,
      },
      anyError
    );
  }
}
