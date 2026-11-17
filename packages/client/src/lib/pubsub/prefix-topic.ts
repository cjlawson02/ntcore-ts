import { pubsubLogger } from '../util/logger.js';

import { NetworkTablesBaseTopic } from './base-topic.js';

import type { CallbackFn } from './base-topic.js';
import type { PubSubClient } from './pubsub.js';
import type {
  AnnounceMessageParams,
  NetworkTablesTypes,
  PropertiesMessageParams,
  SubscribeMessageParams,
  SubscribeOptions,
  UnannounceMessageParams,
} from '../types/types.js';

export class NetworkTablesPrefixTopic extends NetworkTablesBaseTopic<NetworkTablesTypes> {
  readonly type = 'prefix';
  private readonly _lastSubtopicValues = new Map<
    string,
    { params: AnnounceMessageParams; value: NetworkTablesTypes; serverTime: number }
  >();
  private readonly _announceListeners = new Set<(params: AnnounceMessageParams) => void>();
  private readonly _unannounceListeners = new Set<(params: UnannounceMessageParams) => void>();
  private readonly _propertiesListeners = new Set<(params: PropertiesMessageParams) => void>();

  /**
   * Creates a new topic. This should only be done after the
   * base NTCore client has been initialized.
   * @param client - The client that owns the topic.
   * @param name - The name of the topic.
   */
  constructor(client: PubSubClient, name: string) {
    super(client, name);

    const existingTopic = this.client.getPrefixTopicFromName(name);
    if (existingTopic) {
      pubsubLogger.debug('Existing prefix topic reused', { prefix: name });
      return existingTopic;
    }

    pubsubLogger.debug('Prefix topic created', { prefix: name });
    this.client.registerTopic(this);
  }

  /** */
  /* SUBTOPIC LIFECYCLE */
  /** */

  /**
   * Adds a listener for subtopic announcements, including subtopics that haven't sent a value yet.
   * @param callback - Called with the subtopic's announce params.
   * @returns A function to remove the listener.
   */
  addAnnounceListener(callback: (params: AnnounceMessageParams) => void) {
    this._announceListeners.add(callback);
    return () => {
      this._announceListeners.delete(callback);
    };
  }

  /**
   * Adds a listener for subtopic unannouncements, e.g. when a subtopic's last publisher goes away.
   * @param callback - Called with the subtopic's unannounce params.
   * @returns A function to remove the listener.
   */
  addUnannounceListener(callback: (params: UnannounceMessageParams) => void) {
    this._unannounceListeners.add(callback);
    return () => {
      this._unannounceListeners.delete(callback);
    };
  }

  /**
   * Adds a listener for subtopic property changes.
   * @param callback - Called with the properties update. Properties set to `null` were deleted.
   * @returns A function to remove the listener.
   */
  addPropertiesListener(callback: (params: PropertiesMessageParams) => void) {
    this._propertiesListeners.add(callback);
    return () => {
      this._propertiesListeners.delete(callback);
    };
  }

  /**
   * Marks a subtopic as announced. This should only be called by the PubSubClient.
   * @param params - The parameters of the announcement.
   */
  override announce(params: AnnounceMessageParams) {
    super.announce(params);
    this.notifyListeners(this._announceListeners, params);
  }

  /**
   * Marks a subtopic as unannounced. This should only be called by the PubSubClient.
   * @param params - The unannounce message parameters.
   */
  unannounceSubtopic(params: UnannounceMessageParams) {
    this._lastSubtopicValues.delete(params.name);
    this.notifyListeners(this._unannounceListeners, params);
  }

  /**
   * Applies a properties update for a subtopic. This should only be called by the PubSubClient.
   * @param params - The properties message parameters.
   */
  updateSubtopicProperties(params: PropertiesMessageParams) {
    this.notifyListeners(this._propertiesListeners, params);
  }

  private notifyListeners<T extends { name: string }>(listeners: Set<(params: T) => void>, params: T) {
    listeners.forEach((listener) => {
      try {
        listener(params);
      } catch (error: unknown) {
        pubsubLogger.warn('Prefix topic listener threw', { prefix: this.name, subtopicName: params.name, error });
      }
    });
  }

  /** */
  /* SUBSCRIBING */
  /** */

  /**
   * Creates a new subscriber.
   * @param callback - The callback to call when the topic value changes.
   * @param options - The options for the subscriber. `immediateNotify` is client-side only
   *   and replays cached matching subtopic values (not sent to the NT server).
   * @returns The UID of the subscriber.
   */
  subscribe(callback: CallbackFn<NetworkTablesTypes>, options: Omit<SubscribeOptions, 'prefix'> = {}) {
    // Replay before adding the subscriber so it receives each replayed value exactly once, below
    const replayed = this.subscribers.size === 0 ? this.client.replayKnownState(this) : [];
    const subuid = this.subscribeWithId(callback, options, undefined, true);
    let toDeliver: { params: AnnounceMessageParams; value: NetworkTablesTypes }[] = [];
    if (options.immediateNotify) {
      toDeliver = [...this._lastSubtopicValues.values()];
    } else if (!options.topicsonly) {
      toDeliver = replayed.flatMap((params) => this._lastSubtopicValues.get(params.name) ?? []);
    }
    toDeliver.forEach(({ params, value }) => {
      if (params.name === this.name) return;
      try {
        callback(value, params);
      } catch (error: unknown) {
        pubsubLogger.warn('Prefix immediateNotify callback threw', {
          prefix: this.name,
          subtopicName: params.name,
          error,
        });
      }
    });
    return subuid;
  }

  /**
   * Creates a new subscriber, optionally reusing a subscription UID.
   * @internal Used by resubscribeAll. Does not honor `immediateNotify`.
   * @param callback - The callback to call when the topic value changes.
   * @param options - The options for the subscriber.
   * @param id - The UID of the subscriber.
   * @param save - Whether to save the subscriber.
   * @returns The UID of the subscriber.
   */
  protected subscribeWithId(
    callback: CallbackFn<NetworkTablesTypes>,
    options: Omit<SubscribeOptions, 'prefix'> = {},
    id?: number,
    save = true
  ) {
    const subuid = id || this.client.messenger.getNextSubUID();
    const serverOptions = this.toProtocolSubscribeOptions(options);

    const subscribeParams: SubscribeMessageParams = {
      topics: [this.name],
      subuid,
      options: {
        ...serverOptions,
        prefix: true,
      },
    };
    this.client.messenger.subscribe(subscribeParams);

    if (save) this.subscribers.set(subuid, { callback, options: serverOptions });
    pubsubLogger.debug('Subscriber added to prefix topic', {
      prefix: this.name,
      subuid,
      options: serverOptions,
      totalSubscribers: this.subscribers.size,
    });

    return subuid;
  }

  resubscribeAll(client: PubSubClient) {
    const subscriberCount = this.subscribers.size;
    pubsubLogger.debug('Resubscribe all prefix topic', { prefix: this.name, subscriberCount });
    this.client = client;
    this.subscribers.forEach((info, subuid) => {
      this.subscribeWithId(info.callback, info.options, subuid, false);
    });
  }

  /**
   * Updates the value of a subtopic. Notifies all subscribers of the change.
   * @param params - The params of the subtopic
   * @param value - The value of the subtopic
   * @param serverTime - The time the value was updated
   */
  updateValue(params: AnnounceMessageParams, value: NetworkTablesTypes | null, serverTime: number) {
    pubsubLogger.debug('Value update applied to prefix topic', {
      prefix: this.name,
      subtopicName: params.name,
      subtopicId: params.id,
      serverTime,
    });
    if (value == null) {
      this._lastSubtopicValues.delete(params.name);
    } else {
      this._lastSubtopicValues.set(params.name, { params, value, serverTime });
    }
    this._lastChangedTime = serverTime;
    this.notifySubscribers(params, value);
  }

  /**
   * Gets the latest value received for a subtopic.
   * @param name - The subtopic's name.
   * @returns The value and its server time, or undefined if none is cached.
   */
  getSubtopicValue(name: string) {
    return this._lastSubtopicValues.get(name);
  }

  private notifySubscribers(params: AnnounceMessageParams, value: NetworkTablesTypes | null) {
    const subscriberCount = this.subscribers.size;
    pubsubLogger.debug('Subscribers notified for prefix topic', {
      prefix: this.name,
      subtopicName: params.name,
      count: subscriberCount,
    });
    this.subscribers.forEach((info, subuid) => {
      pubsubLogger.trace('Callback invoked for prefix topic', {
        prefix: this.name,
        subuid,
        subtopicName: params.name,
        value,
        params,
      });
      try {
        info.callback(value, params);
      } catch (error: unknown) {
        pubsubLogger.warn('Prefix subscriber callback threw', {
          prefix: this.name,
          subuid,
          subtopicName: params.name,
          error,
        });
      }
    });
  }
}
