# Prefix topics

Subscribe to multiple topics with a wildcard by creating a prefix topic.

## Accelerometer example

Topics `/MyTable/Accelerometer/X` and `/MyTable/Accelerometer/Y`:

```typescript
import { NetworkTables } from '@ntcore-ts/client';

const ntcore = NetworkTables.getInstanceByTeam(973);

const accelerometerTopic = ntcore.getPrefixTopic('/MyTable/Accelerometer/');

let x, y;

accelerometerTopic.subscribe((value, params) => {
  console.log(`Got Accelerometer Value: ${value} from topic ${params.name}`);

  if (params.name.endsWith('X')) {
    x = value;
  } else if (params.name.endsWith('Y')) {
    y = value;
  }

  if (params.type === 'int') {
    console.warn('Hmm... the accelerometer seems low precision');
  } else if (params.type === 'double') {
    console.log('The accelerometer is high precision');
  }
});
```

## Subscribe to all topics

Use a prefix of `/`:

```typescript
import { NetworkTables } from '@ntcore-ts/client';

const ntcore = NetworkTables.getInstanceByTeam(973);

const allTopics = ntcore.getPrefixTopic('/');

allTopics.subscribe((value, params) => {
  console.log(`Got Value: ${value} from topic ${params.name}`);
});
```

## React

In React, use `usePrefixTopic` (latest update only) or `usePrefixTopicMap` (map of all topics under the prefix). See the [React guide](/guide/react).
