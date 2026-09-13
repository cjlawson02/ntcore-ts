import type { NetworkTables } from '@ntcore-ts/client';

import { decodeInventoryValue } from './decode.js';
import {
  DEFAULT_SUBSCRIBE_DURATION_S,
  MAX_SAMPLES_PER_TOPIC,
  MAX_SUBSCRIBE_DURATION_S,
  MAX_SUBSCRIBE_TOPICS,
  toJsonSafe,
  type JsonValue,
} from './response.js';

export interface SamplePoint {
  t: number;
  value: JsonValue;
}

export interface TopicSummary {
  topic: string;
  type: string;
  count: number;
  first: JsonValue;
  last: JsonValue;
  min?: number;
  max?: number;
  mean?: number;
  rateHz?: number;
}

export interface SubscribeOptions {
  prefixes: string[];
  durationSeconds?: number;
  sampleIntervalMs?: number;
  changeOnly?: boolean;
  changeEpsilon?: number;
  format?: 'summary' | 'samples';
  types?: Record<string, string>;
}

export interface SubscribeResult {
  durationSeconds: number;
  topicCount: number;
  format: 'summary' | 'samples';
  summaries?: TopicSummary[];
  samples?: Record<string, SamplePoint[]>;
  truncated: boolean;
}

function isNumeric(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function valuesEqual(a: unknown, b: unknown, epsilon: number): boolean {
  if (isNumeric(a) && isNumeric(b)) return Math.abs(a - b) <= epsilon;
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Collect samples via short-lived prefix subscriptions only.
 * (Typed topic subscriptions do not receive values after a prefix sub has been used
 * on the same NetworkTables instance — see inventory snapshot design.)
 */
export async function collectSamples(nt: NetworkTables, options: SubscribeOptions): Promise<SubscribeResult> {
  const durationSeconds = Math.min(
    Math.max(options.durationSeconds ?? DEFAULT_SUBSCRIBE_DURATION_S, 0.1),
    MAX_SUBSCRIBE_DURATION_S
  );
  const format = options.format ?? 'summary';
  const changeOnly = options.changeOnly ?? false;
  const epsilon = options.changeEpsilon ?? 1e-9;
  const sampleIntervalMs = options.sampleIntervalMs ?? 0;
  const typeMap = { ...(options.types ?? {}) };

  const buckets = new Map<string, { type: string; points: SamplePoint[]; lastRaw: unknown }>();
  let truncated = false;

  const ensureBucket = (name: string, type: string) => {
    let bucket = buckets.get(name);
    if (!bucket) {
      if (buckets.size >= MAX_SUBSCRIBE_TOPICS) {
        truncated = true;
        return null;
      }
      bucket = { type, points: [], lastRaw: undefined };
      buckets.set(name, bucket);
    }
    return bucket;
  };

  const record = (name: string, type: string, value: unknown) => {
    if (value == null) return;
    let decoded: unknown = value;
    if (value instanceof Uint8Array) {
      decoded = decodeInventoryValue(type, value);
      if (decoded == null) return;
    }
    const bucket = ensureBucket(name, type);
    if (!bucket) return;
    if (changeOnly && bucket.lastRaw !== undefined && valuesEqual(bucket.lastRaw, decoded, epsilon)) {
      return;
    }
    const now = Date.now();
    if (sampleIntervalMs > 0 && bucket.points.length > 0) {
      const lastT = bucket.points[bucket.points.length - 1]!.t;
      if (now - lastT < sampleIntervalMs) return;
    }
    if (bucket.points.length >= MAX_SAMPLES_PER_TOPIC) {
      truncated = true;
      return;
    }
    bucket.lastRaw = decoded;
    bucket.points.push({ t: now, value: toJsonSafe(decoded) });
  };

  const prefixTopics = options.prefixes.map((prefix) => {
    const pt = nt.getPrefixTopic(prefix);
    const subuid = pt.subscribe(
      (value, params) => {
        const type = typeMap[params.name] ?? params.type;
        typeMap[params.name] = type;
        record(params.name, type, value);
      },
      { all: true, immediateNotify: true }
    );
    return { pt, subuid };
  });

  await new Promise((r) => setTimeout(r, durationSeconds * 1000));

  for (const { pt, subuid } of prefixTopics) {
    try {
      pt.unsubscribe(subuid);
    } catch {
      // ignore
    }
  }

  const summaries: TopicSummary[] = [];
  const samples: Record<string, SamplePoint[]> = {};

  for (const [topic, bucket] of buckets) {
    if (format === 'samples') {
      samples[topic] = bucket.points;
    }
    const nums = bucket.points.map((p) => p.value).filter(isNumeric);
    const first = bucket.points[0]?.value ?? null;
    const last = bucket.points[bucket.points.length - 1]?.value ?? null;
    const elapsedSec =
      bucket.points.length >= 2
        ? (bucket.points[bucket.points.length - 1]!.t - bucket.points[0]!.t) / 1000
        : durationSeconds;
    const summary: TopicSummary = {
      topic,
      type: bucket.type,
      count: bucket.points.length,
      first,
      last,
      rateHz: elapsedSec > 0 ? bucket.points.length / elapsedSec : undefined,
    };
    if (nums.length > 0) {
      summary.min = Math.min(...nums);
      summary.max = Math.max(...nums);
      summary.mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    }
    summaries.push(summary);
  }

  summaries.sort((a, b) => a.topic.localeCompare(b.topic));

  return {
    durationSeconds,
    topicCount: buckets.size,
    format,
    ...(format === 'summary' ? { summaries } : { samples, summaries }),
    truncated,
  };
}
