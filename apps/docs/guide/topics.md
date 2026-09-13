# Topics

Prefer the typed factories (`getDoubleTopic`, `getStringTopic`, …). `createTopic(name, typeInfo, defaultValue?)` remains for cases where the type is not known until runtime.

## Topic factories

```typescript
getDoubleTopic(name: string, defaultValue?: number)
getStringTopic(name: string, defaultValue?: string)
getBooleanTopic(name: string, defaultValue?: boolean)
getIntegerTopic(name: string, defaultValue?: number)
getFloatTopic(name: string, defaultValue?: number)
getBooleanArrayTopic(name: string, defaultValue?: boolean[])
getDoubleArrayTopic(name: string, defaultValue?: number[])
getIntegerArrayTopic(name: string, defaultValue?: number[])
getFloatArrayTopic(name: string, defaultValue?: number[])
getStringArrayTopic(name: string, defaultValue?: string[])
getRawTopic(name: string, defaultValue?: Uint8Array)
getJsonTopic<T extends object>(name: string, defaultValue?: T, options?: { validator?: ZodSchema<T> })
```

Once a topic has been created, subscribe with:

```typescript
subscribe(
  callback: (value: T | null, params: AnnounceMessageParams) => void,
  options?: SubscribeOptions
)
```

and/or publish with:

```typescript
await publish(properties: TopicProperties = {})
```

## Subscribe example

```typescript
import { NetworkTables } from '@ntcore-ts/client';

const ntcore = NetworkTables.getInstanceByTeam(973);

const gyroTopic = ntcore.getDoubleTopic('/MyTable/Gyro');

gyroTopic.subscribe((value) => {
  console.log(`Got Gyro Value: ${value}`);
});

gyroTopic.subscribe((value, params) => {
  console.log(`Got Gyro Value: ${value} at from topic id ${params.id}`);
});
```

## Publish example

```typescript
import { NetworkTables } from '@ntcore-ts/client';

const ntcore = NetworkTables.getInstanceByTeam(973);

const autoModeTopic = ntcore.getStringTopic('/MyTable/AutoMode', 'No Auto');

await autoModeTopic.publish();

autoModeTopic.setValue('25 Ball Auto and Climb');
```

## Related

- [Prefix topics](/guide/prefix-topics) for wildcard subscriptions
- [Protobuf](/guide/protobuf) and [struct](/guide/struct) for binary types
- [API reference](/api/) for the full topic API

## Known limitations

- "Raw" and other binary types (RPC, msgpack, protobuf) use `Uint8Array`; the library does not use `ArrayBuffer` directly for topic values.
