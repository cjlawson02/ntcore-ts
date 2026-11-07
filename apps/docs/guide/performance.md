# Performance

How fast `@ntcore-ts/client` and `@ntcore-ts/react` can process NetworkTables updates, and how CI catches regressions.

Typical FRC traffic is tens to low thousands of topic updates per second. The numbers below are far above that. The bottleneck in a match is the network and the NT server, not this library.

## Headline numbers

Measured with `npm run bench` on an Apple M1 Pro, Node 24. React benches run in jsdom (`flushSync` commit), not a full browser layout/paint.

| Workload                               |                          Rate |   Mean |
| -------------------------------------- | ----------------------------: | -----: |
| Client, 1 message / frame              |                       2.63M/s | 0.4 µs |
| Client, 10 messages / frame            |  1.01M frames/s (10.1M msg/s) | 1.1 µs |
| Client, 100 messages / frame           |   143k frames/s (14.3M msg/s) | 7.1 µs |
| Client, 100 frames through `onMessage` | 16.1k batches/s (1.61M msg/s) |  63 µs |
| React `useTopic` (one update)          |                         88k/s |  11 µs |
| React `usePrefixTopic` (one update)    |                         85k/s |  12 µs |
| React 50-hook dashboard (batched)      |                        4.5k/s | 240 µs |
| React 50-hook dashboard (unbatched)    |                         800/s | 1.3 ms |

Decode of a double is about 0.4 µs. Applying it through `useTopic` is about 11 µs. Batching 50 hook updates into one React commit stays under 250 µs mean.

## What is measured

**Client** (`packages/client/src/lib/socket/*.bench.ts`)

- Hot path: `handleBinaryFrame` — msgpack decode, lightweight binary shape check, `onTopicUpdate` callback.
- `onMessage`: 100 binary frames through the WebSocket message handler.

**React** (`packages/react/src/lib/hooks.bench.tsx`)

- Subscribe callback → `setState` → React commit in jsdom.
- Values change every iteration so React cannot skip the render.
- The client is mocked; this is hook + render cost only.

Not included: real TCP/WebSocket, NT server time, struct/protobuf decode, browser layout and paint.

## Running locally

```bash
npm run bench
```

Package-only:

```bash
npm run bench -w @ntcore-ts/client
npm run bench -w @ntcore-ts/react
```

## CI regression checks

Every push to `main` and every pull request runs [`.github/workflows/bench.yml`](https://github.com/cjlawson02/ntcore-ts/blob/main/.github/workflows/bench.yml) under [CodSpeed](https://codspeed.io/cjlawson02/ntcore-ts).

- Benchmarks run in CodSpeed's CPU simulation mode, which counts simulated CPU cycles instead of wall-clock time, so results are stable on shared GitHub runners.
- CodSpeed comments on each pull request with the change against `main` and reports a status check that flags regressions above the configured threshold.
- Pushes to `main` record the baseline and history shown on the CodSpeed dashboard.

Simulation runs V8 without its optimizing compilers and with a fixed GC schedule, so it tracks how much work each path does rather than optimized-JIT or GC behaviour. Absolute numbers will not match the M1 Pro table above. The plugin does nothing outside CodSpeed's CI, so `npm run bench` locally is unchanged.
