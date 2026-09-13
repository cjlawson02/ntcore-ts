# Protobuf topics

For custom message types using [Protocol Buffers](https://protobuf.dev/), use `getProtobufTopic`. The library fetches the schema from NetworkTables and can decode values in subscriber callbacks. Pass a [Zod](https://github.com/colinhacks/zod) schema as a runtime validator when you want type checks at decode time.

See also [Struct vs protobuf](/explanation/struct-vs-protobuf).

## Subscribing

```typescript
import { NetworkTables, Pose2d, Pose2dSchema } from '@ntcore-ts/client';

const ntcore = NetworkTables.getInstanceByTeam(973);

const poseTopic = ntcore.getProtobufTopic<Pose2d>('/MyTable/Pose', {
  validator: Pose2dSchema,
});
poseTopic.subscribe((value) => {
  console.log(`Pose: x=${value?.translation.x}, y=${value?.translation.y}`);
});
```

## Publishing

So the client can encode and register the schema, provide one of:

- `protoFilePath` — path to a `.proto` file. Node.js only (uses the filesystem).
- `protoSource` — contents of a `.proto` file, parsed in memory. Safe in the browser.
- `messageType` — a prebuilt protobufjs `Type`. Safe in the browser.

```typescript
import * as path from 'path';
import { NetworkTables } from '@ntcore-ts/client';

const ntcore = NetworkTables.getInstanceByURI('localhost');

const sensorTopic = ntcore.getProtobufTopic<{ timestamp: number; value: number }>('/MyTable/Sensor', {
  protoFilePath: path.join(__dirname, 'sensor.proto'),
  // Browser: protoSource: protoText, or messageType: myType,
});

await sensorTopic.publish();
sensorTopic.setValue({ timestamp: Date.now(), value: 42.5 });
```

## React

Use `useProtobufTopic` from `@ntcore-ts/react`. See the [React guide](/guide/react).
