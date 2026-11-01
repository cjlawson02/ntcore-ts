/* oxlint-disable react/refs -- store mirror updated during render; value hot path stays one useState */
import { useEffect, useReducer, useRef, useState } from 'react';
import {
  NetworkTablesTypeInfos,
  type NetworkTables,
  type NetworkTablesTypeInfo,
  type NetworkTablesTypes,
  type SubscribeOptions,
  type TopicProperties,
} from '@ntcore-ts/client';
import { toError, useNtcore } from './context';
import { trackPublish, unpublishWhenDone, claimPublishOwner, type TrackedPublish } from './unpublish-when-done';

/**
 * Options for useTopic. Use `publish: true` to become the publisher with default
 * properties (not retained). Use `publish: { retained: true }` (or other TopicProperties)
 * to become the publisher with specific properties.
 */
export type UseTopicOptions<T = NetworkTablesTypes> = {
  /** Shown before the first update. */
  defaultValue?: T;
  /** Subscribe options (e.g. { periodic: 0.02 }). */
  subscribeOptions?: SubscribeOptions;
  /**
   * Make this client the publisher of the topic so you can write with setValue.
   * - `true` → publish with default properties (not retained).
   * - `{ retained: true }` (or other TopicProperties) → publish with those properties.
   * When provided, only call setValue after isReadyToWrite is true.
   */
  publish?: true | TopicProperties;
  /**
   * When `publish` is set, call `topic.unpublish()` on unmount (default `true`).
   * Set to `false` to keep publishing after the component unmounts.
   */
  unpublishOnUnmount?: boolean;
};

/**
 * Result of useTopic. When you pass `publish`, setValue is defined and you must
 * wait for isReadyToWrite before calling it.
 */
export type UseTopicResult<T = NetworkTablesTypes> = {
  value: T | null;
  setValue: ((value: T) => void) | undefined;
  /** True once the server has acknowledged our publish request. Only check this when you passed `publish`. */
  isReadyToWrite: boolean;
  /** Last publish or setValue error, if any. */
  error: Error | null;
};

type TopicMeta = { isReadyToWrite: boolean; error: Error | null };

type TopicStore<T> = {
  nt: NetworkTables;
  name: string;
  typeNum: number;
  typeStr: string;
  typeInfo: NetworkTablesTypeInfo;
  options: UseTopicOptions<T> | undefined;
  meta: TopicMeta;
  bumpMeta: () => void;
  setValue: (value: T) => void;
};

/**
 * Subscribes to a NetworkTables topic and returns the latest value. Unsubscribes on unmount.
 *
 * **Reading only:** Omit `publish` in options. You get `{ value, setValue: undefined, isReadyToWrite: false }`.
 *
 * **Reading and writing:** Pass `publish: true` or `publish: { retained: true }` (etc.) in options.
 * You get `{ value, setValue, isReadyToWrite }`. Only call setValue when isReadyToWrite is true.
 *
 * Subscription is re-created only when `nt`, `name`, or `typeInfo` change. Optional
 * options are read at subscribe time.
 *
 * Value updates only touch one `useState`. Publish ready/error live on a per-hook store and
 * bump a rarely-used reducer, so read-only dashboards stay close to a single-state hot path.
 *
 * @param name - Topic name (e.g. "/MyTable/Gyro").
 * @param typeInfo - Type info from NetworkTablesTypeInfos (e.g. NetworkTablesTypeInfos.kDouble).
 * @param options - Optional defaultValue, subscribeOptions, and publish (make me the publisher).
 * @returns { value, setValue, isReadyToWrite, error }.
 */
export function useTopic<T extends object>(
  name: string,
  typeInfo: typeof NetworkTablesTypeInfos.kJson,
  options?: UseTopicOptions<T>
): UseTopicResult<T>;
export function useTopic<T extends NetworkTablesTypes>(
  name: string,
  typeInfo: NetworkTablesTypeInfo,
  options?: UseTopicOptions<T>
): UseTopicResult<T>;
export function useTopic<T>(
  name: string,
  typeInfo: NetworkTablesTypeInfo,
  options?: UseTopicOptions<T>
): UseTopicResult<T> {
  const nt = useNtcore();
  const publishOpt = options?.publish;
  const typeNum = typeInfo[0];
  const typeStr = typeInfo[1];

  const [state, setState] = useState<T | null>(options?.defaultValue ?? null);
  const [, bumpMeta] = useReducer((n: number) => n + 1, 0);

  const storeRef = useRef<TopicStore<T> | null>(null);
  if (storeRef.current === null) {
    const store: TopicStore<T> = {
      nt,
      name,
      typeNum,
      typeStr,
      typeInfo,
      options,
      meta: { isReadyToWrite: false, error: null },
      bumpMeta,
      setValue: (value: T) => {
        const s = storeRef.current!;
        if (s.options?.publish === undefined || !s.meta.isReadyToWrite) return;
        try {
          const topic =
            s.typeInfo[1] === 'json'
              ? s.nt.getJsonTopic(s.name, s.options?.defaultValue as object | undefined)
              : s.nt.createTopic(s.name, s.typeInfo, s.options?.defaultValue as NetworkTablesTypes | undefined);
          topic.setValue(value as never);
        } catch (e) {
          s.meta = { ...s.meta, error: toError(e) };
          s.bumpMeta();
        }
      },
    };
    storeRef.current = store;
  }

  const store = storeRef.current;
  store.bumpMeta = bumpMeta;
  store.options = options;
  store.typeInfo = typeInfo;

  if (nt !== store.nt || name !== store.name || typeNum !== store.typeNum || typeStr !== store.typeStr) {
    store.nt = nt;
    store.name = name;
    store.typeNum = typeNum;
    store.typeStr = typeStr;
    store.meta = { isReadyToWrite: false, error: null };
    setState(options?.defaultValue ?? null);
  }

  useEffect(() => {
    let cancelled = false;
    const topic =
      typeInfo[1] === 'json'
        ? nt.getJsonTopic(name, store.options?.defaultValue as object | undefined)
        : nt.createTopic(name, typeInfo, store.options?.defaultValue as NetworkTablesTypes | undefined);
    const subuid = topic.subscribe((v) => {
      if (!cancelled) setState(v as T);
    }, store.options?.subscribeOptions ?? undefined);
    const publish = store.options?.publish;
    const unpublishOnUnmount = store.options?.unpublishOnUnmount ?? publish !== undefined;
    const shouldPublish = publish !== undefined;
    let trackedPublish: TrackedPublish | undefined;
    let ownerToken: number | undefined;
    if (shouldPublish) {
      ownerToken = claimPublishOwner(topic);
      const properties = publish === true ? {} : publish;
      trackedPublish = trackPublish(
        topic
          .publish(properties)
          .then(() => {
            if (cancelled) return;
            store.meta = { isReadyToWrite: true, error: null };
            store.bumpMeta();
          })
          .catch((e) => {
            if (cancelled) return;
            store.meta = { isReadyToWrite: false, error: toError(e) };
            store.bumpMeta();
          })
      );
    }
    return () => {
      cancelled = true;
      topic.unsubscribe(subuid);
      if (shouldPublish && unpublishOnUnmount && ownerToken !== undefined) {
        unpublishWhenDone(
          topic,
          trackedPublish,
          (err) => {
            store.meta = { ...store.meta, error: err };
            store.bumpMeta();
          },
          ownerToken
        );
      }
    };
  }, [nt, name, typeNum, typeStr, typeInfo, store]);

  return {
    value: state,
    setValue: publishOpt !== undefined ? store.setValue : undefined,
    isReadyToWrite: store.meta.isReadyToWrite,
    error: store.meta.error,
  };
}
