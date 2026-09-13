# Struct topics

For WPILib struct types over NetworkTables, use `getStructTopic(name, Pose2d)`. Structs use fixed-size binary serialization and interoperate with WPILib Java and C++ clients. Geometry types (`Pose2d`, `Translation2d`, …) and matching Zod schemas are exported from `@ntcore-ts/client`.

See also [Struct vs protobuf](/explanation/struct-vs-protobuf).

## Built-in struct types

Translation2d, Rotation2d, Pose2d, Transform2d, Twist2d, Translation3d, Quaternion, Rotation3d, Pose3d, Transform3d, Twist3d.

## Subscribing

```typescript
import { NetworkTables, Pose2d } from '@ntcore-ts/client';

const ntcore = NetworkTables.getInstanceByTeam(973);

const poseTopic = ntcore.getStructTopic('/MyTable/PoseStruct', Pose2d);
poseTopic.subscribe((value) => {
  console.log(`Pose: x=${value?.translation.x}, y=${value?.translation.y}`);
});
```

## Publishing with a custom schema

For types that are not built-in:

```typescript
const customTopic = ntcore.getStructTopic<{ x: number; y: number }>('/MyTable/Custom2d', {
  typeName: 'Custom2d',
  schema: 'double x;double y',
});

await customTopic.publish();
customTopic.setValue({ x: 1.5, y: -2.0 });
```

## Arrays of structs

Use `typeName: 'Translation2d[]'` (or `Pose2d[]`, etc.) for topics that publish arrays of structs.

## React

Use `useStructTopic` from `@ntcore-ts/react`. See the [React guide](/guide/react).

## Precision note

Struct fields using `int64` or `uint64` are returned as JavaScript `number`, which has a precision limit of ±2^53. Values beyond `Number.MAX_SAFE_INTEGER` will lose precision. No built-in WPILib struct types are affected (they all use `double`).
