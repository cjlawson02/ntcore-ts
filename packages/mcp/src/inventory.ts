import type { AnnounceMessageParams, NetworkTables } from '@ntcore-ts/client';

import { MAX_TOPICS, toJsonSafe, type JsonValue } from './response.js';

export interface TopicRecord {
  name: string;
  type: string;
  id: number;
  properties: Record<string, unknown> | null;
  lastValue: JsonValue;
  /** Original wire/decoded value before JSON conversion (for struct decode). */
  rawValue: unknown;
  lastChangedTime: number | null;
}

/**
 * Topic discovery cache.
 *
 * Uses short-lived prefix subscriptions for snapshots. A long-lived prefix `/`
 * subscription prevents later typed topic subscriptions from receiving values
 * (ntcore-ts / NT4 interaction), so we never leave a prefix sub open.
 */
export class TopicInventory {
  private readonly topics = new Map<string, TopicRecord>();
  private nt: NetworkTables | null = null;
  private started = false;

  async start(nt: NetworkTables, prefix = '/'): Promise<void> {
    this.nt = nt;
    this.started = true;
    await this.refresh(prefix, 400);
  }

  stop(): void {
    this.nt = null;
    this.topics.clear();
    this.started = false;
  }

  get isStarted(): boolean {
    return this.started;
  }

  async refresh(prefix = '/', settleMs = 300): Promise<void> {
    if (!this.nt) return;
    const prefixTopic = this.nt.getPrefixTopic(prefix);
    const subuid = prefixTopic.subscribe(
      (value, params) => {
        this.upsert(params, value);
      },
      { immediateNotify: true, all: true }
    );
    await new Promise((r) => setTimeout(r, settleMs));
    try {
      prefixTopic.unsubscribe(subuid);
    } catch {
      // ignore
    }
  }

  upsert(params: AnnounceMessageParams, value: unknown): void {
    const existing = this.topics.get(params.name);
    this.topics.set(params.name, {
      name: params.name,
      type: params.type,
      id: params.id,
      properties: (params.properties as Record<string, unknown> | null) ?? null,
      lastValue: toJsonSafe(value),
      rawValue: value,
      lastChangedTime: existing?.lastChangedTime ?? null,
    });
  }

  updateValue(name: string, value: unknown, lastChangedTime?: number): void {
    const existing = this.topics.get(name);
    if (!existing) return;
    existing.lastValue = toJsonSafe(value);
    existing.rawValue = value;
    if (lastChangedTime != null) existing.lastChangedTime = lastChangedTime;
  }

  get(name: string): TopicRecord | undefined {
    return this.topics.get(name);
  }

  list(prefix?: string, limit = MAX_TOPICS): TopicRecord[] {
    const all = [...this.topics.values()].sort((a, b) => a.name.localeCompare(b.name));
    const filtered = prefix ? all.filter((t) => t.name.startsWith(prefix)) : all;
    return filtered.slice(0, limit);
  }

  discoveredStructTypes(): string[] {
    const names = new Set<string>();
    for (const topic of this.topics.values()) {
      if (topic.type.startsWith('struct:')) {
        const raw = topic.type.slice('struct:'.length);
        names.add(raw.endsWith('[]') ? raw.slice(0, -2) : raw);
      }
      if (topic.name.startsWith('/.schema/struct:')) {
        names.add(topic.name.slice('/.schema/struct:'.length));
      }
    }
    return [...names].sort();
  }
}
