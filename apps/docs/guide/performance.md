# Performance

How fast `@ntcore-ts/client` and `@ntcore-ts/react` can process NetworkTables updates, and how CI catches regressions.

Typical FRC traffic is tens to low thousands of topic updates per second. The numbers below are far above that. The bottleneck in a match is the network and the NT server, not this library.

## Headline numbers

Measured with `npm run bench` on an Apple M1 Pro, Node 24. React benches run in jsdom (`flushSync` commit), not a full browser layout/paint.

| Workload                               |                        Rate |    Mean |
| -------------------------------------- | --------------------------: | ------: |
| Client, 1 message / frame              |                     1.01M/s |  1.2 µs |
| Client, 10 messages / frame            | 164k frames/s (1.64M msg/s) |  7.8 µs |
| Client, 100 messages / frame           |  17k frames/s (1.74M msg/s) |   73 µs |
| Client, 100 frames through `onMessage` | 6.3k batches/s (632k msg/s) |  159 µs |
| React `useTopic` (one update)          |                       87k/s |   12 µs |
| React `usePrefixTopic` (one update)    |                       88k/s |   12 µs |
| React 50-hook dashboard (batched)      |                      3.8k/s |  278 µs |
| React 50-hook dashboard (unbatched)    |                       746/s | 1.37 ms |

Decode of a double is about 1 µs. Applying it through `useTopic` is about 12 µs. Batching 50 hook updates into one React commit stays under 300 µs mean.

## What is measured

**Client** (`packages/client/src/lib/socket/*.bench.ts`)

- Hot path: `handleBinaryFrame` — msgpack decode, Zod schema parse, `onTopicUpdate` callback.
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

CI JSON (used by GitHub Actions):

```bash
npm run bench:ci
```

Writes `tmp/github-bench.json` in the [customBiggerIsBetter](https://github.com/benchmark-action/github-action-benchmark) format.

## CI regression checks

Every push to `main` / `beta` and every pull request runs [`.github/workflows/bench.yml`](https://github.com/cjlawson02/ntcore-ts/blob/main/.github/workflows/bench.yml).

- Throughput is compared to the last stored `main` result (higher ops/s is better).
- A drop to about 2/3 of `main` comments an alert on the PR (`alert-threshold: 150%`).
- A drop to half of `main` fails the job (`fail-threshold: 200%`).
- History is stored on the `gh-bench` branch (separate from the docs site).

GitHub-hosted runners are noisier than a laptop, so the fail bar is deliberately wide. Treat CI as a “did we tank it?” check, not a micro-benchmark of 5% changes. Absolute ops/s on `ubuntu-latest` will not match the M1 Pro table above.

The first successful push to `main` after this workflow lands creates the history branch. Later PRs compare against that.
