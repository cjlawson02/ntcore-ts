/** Shared response helpers and payload caps for MCP tool results. */

export const MAX_TOPICS = 500;
export const MAX_SAMPLES_PER_TOPIC = 200;
export const MAX_SUBSCRIBE_TOPICS = 100;
export const MAX_GET_MULTIPLE = 50;
export const DEFAULT_SUBSCRIBE_DURATION_S = 2;
export const MAX_SUBSCRIBE_DURATION_S = 30;

export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export function jsonResult(
  payload: unknown,
  isError = false
): {
  content: [{ type: 'text'; text: string }];
  structuredContent: Record<string, unknown>;
  isError?: boolean;
} {
  const structuredContent =
    payload !== null && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : { value: payload };
  const content: [{ type: 'text'; text: string }] = [{ type: 'text', text: JSON.stringify(payload, jsonReplacer, 2) }];
  if (isError) {
    return { content, structuredContent, isError: true };
  }
  return { content, structuredContent };
}

export function jsonReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Uint8Array) {
    return {
      __type: 'Uint8Array',
      length: value.length,
      hexPreview: Buffer.from(value.subarray(0, Math.min(32, value.length))).toString('hex'),
    };
  }
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

/** Convert a value into JSON-safe form for tool responses. */
export function toJsonSafe(value: unknown): JsonValue {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') return value;
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof Uint8Array) {
    return {
      __type: 'Uint8Array',
      length: value.length,
      hexPreview: Buffer.from(value.subarray(0, Math.min(32, value.length))).toString('hex'),
    };
  }
  if (Array.isArray(value)) return value.map(toJsonSafe);
  if (typeof value === 'object') {
    const out: { [key: string]: JsonValue } = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = toJsonSafe(v);
    }
    return out;
  }
  return String(value);
}

/** Match topic paths against simple glob patterns (`*` = one segment, `**` = any depth). */
export function matchGlob(path: string, pattern: string): boolean {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const normalizedPattern = pattern.startsWith('/') ? pattern : `/${pattern}`;
  const regex = globToRegExp(normalizedPattern);
  return regex.test(normalizedPath);
}

function globToRegExp(pattern: string): RegExp {
  let i = 0;
  let out = '^';
  while (i < pattern.length) {
    const c = pattern[i];
    if (c === '*') {
      if (pattern[i + 1] === '*') {
        out += '.*';
        i += 2;
        if (pattern[i] === '/') i += 1;
      } else {
        out += '[^/]*';
        i += 1;
      }
    } else if (c === '?') {
      out += '[^/]';
      i += 1;
    } else if ('\\.[]{}()+-^$|'.includes(c)) {
      out += `\\${c}`;
      i += 1;
    } else {
      out += c;
      i += 1;
    }
  }
  out += '$';
  return new RegExp(out);
}
