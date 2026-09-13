# ntcore-ts

TypeScript and React libraries for [WPILib's NetworkTables 4.1 protocol](https://github.com/wpilibsuite/allwpilib/blob/main/ntcore/doc/networktables4.adoc).

https://github.com/user-attachments/assets/eddf89b3-25c1-441b-aea5-357e49edd20e

> Live subscribe/publish dashboard (`apps/example-react`) talking to `apps/example-robot` over NT 4.1. Try it locally: start the robot (`npm run serve -w @ntcore-ts/example-robot`), then the dashboard (`npm run serve -w @ntcore-ts/example-react`).

https://github.com/user-attachments/assets/eddf89b3-25c1-441b-aea5-357e49edd20e

> Live subscribe/publish dashboard (`apps/example-react`) talking to `apps/example-robot` over NT 4.1. Try it locally: start the robot (`npm run serve -w @ntcore-ts/example-robot`), then the dashboard (`npm run serve -w @ntcore-ts/example-react`).

## Features

- NodeJS and DOM support
- Togglable auto-reconnect
- Callbacks for new data on subscriptions
- Callbacks for connection listeners
- Wildcard prefix listeners for multiple topics
- Protobuf support with optional type generation and Zod validation
- Struct support for WPILib types (`getStructTopic(name, Pose2d)`, `useStructTopic(name, Pose2d)`)
- Retrying for messages queued during a connection loss
- On-the-fly server switching with resubscribing and republishing
- Generic types for Topics
- Client-side data validation using [Zod](https://github.com/colinhacks/zod)
- Server-matching timestamping using RTT calculation
- Granular logging with configurable log levels per module

## Documentation

Guides and API reference: [https://ntcore.chrislawson.dev](https://ntcore.chrislawson.dev)

## Install

```bash
npm install --save @ntcore-ts/client
```

React dashboards:

```bash
npm install @ntcore-ts/react @ntcore-ts/client react react-dom
```

```typescript
import { NetworkTables } from '@ntcore-ts/client';

const ntcore = NetworkTables.getInstanceByTeam(973);
const gyro = ntcore.getDoubleTopic('/MyTable/Gyro');
gyro.subscribe((value) => console.log(value));
```

More detail: [Getting started](https://ntcore.chrislawson.dev/guide/getting-started) and the [React guide](https://ntcore.chrislawson.dev/guide/react).

## Packages

| Package                                | Description                   |
| -------------------------------------- | ----------------------------- |
| [`@ntcore-ts/client`](packages/client) | Core NetworkTables 4.1 client |
| [`@ntcore-ts/react`](packages/react)   | React provider and hooks      |

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and PR guidelines.
