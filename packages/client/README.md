# @ntcore-ts/client

TypeScript client for [WPILib's NetworkTables 4.1 protocol](https://github.com/wpilibsuite/allwpilib/blob/main/ntcore/doc/networktables4.adoc).

## Documentation

Full guides and API reference: [https://ntcore.chrislawson.dev](https://ntcore.chrislawson.dev)

## Install

```bash
npm install --save @ntcore-ts/client
```

```typescript
import { NetworkTables } from '@ntcore-ts/client';

const ntcore = NetworkTables.getInstanceByTeam(973);
const gyro = ntcore.getDoubleTopic('/MyTable/Gyro');
gyro.subscribe((value) => console.log(value));
```

The hot path (msgpack decode + shape check) is about **2.6 million frames/s** on an Apple M1 Pro (~0.4 µs per single-message frame). Typical FRC NT rates are tens to low thousands of updates per second.

```mermaid
xychart-beta
    title "Messages per second by frame size (Apple M1 Pro)"
    x-axis ["1 msg/frame", "10 msg/frame", "100 msg/frame"]
    y-axis "thousands of messages/s" 0 --> 16000
    bar [2628, 10097, 14297]
```

## Building

Run `npm run build -w @ntcore-ts/client` (or `npx turbo run build --filter=@ntcore-ts/client`) to build the library.

## Running unit tests

Run `npm run test -w @ntcore-ts/client` (or `npm test` from the repo root) to execute the unit tests via [Vitest](https://vitest.dev).

## Benchmarks

Benchmarks measure how fast the client processes WebSocket messages. They are **not** run in the default test suite.

**How to run**

- From the repo root: `npm run bench` (client and React)
- From this package: `npm run bench -w @ntcore-ts/client`

**What is measured**

- **Tier 1 (hot path)**: Binary frame processing in isolation—decode (msgpack), shape check, and callback. Benchmarks: one frame with 1, 10, or 100 messages.
- **Tier 2 (`onMessage`)**: 100 binary frames through `onMessage` → `handleBinaryFrame` → `onTopicUpdate`.

Both tiers use a mock server for the socket connection (no real NT server or robot). Results are reported as Hz (ops/sec), with min/max/mean and percentiles (e.g. p99).

**Findings** (Apple M1 Pro, Node 24)

| Workload                       | Frames or batches/s |   Mean | Messages/s |
| ------------------------------ | ------------------: | -----: | ---------: |
| 1 message / frame              |               2.63M | 0.4 µs |      2.63M |
| 10 messages / frame            |               1.01M | 1.1 µs |      10.1M |
| 100 messages / frame           |                143k | 7.1 µs |      14.3M |
| 100 frames through `onMessage` |               16.1k |  63 µs |      1.61M |

CI re-runs these benches on every PR and fails if throughput drops to half of `main`. See the [performance guide](https://ntcore.chrislawson.dev/guide/performance).

**Conclusion**: For normal FRC/NetworkTables use (tens to low thousands of topic updates per second over the network), the client can process far more than real traffic. The bottleneck in practice is the **network** (latency, bandwidth) and the NT server, not this client’s message processing.
