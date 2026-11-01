# Performance

How fast `@ntcore-ts/client` and `@ntcore-ts/react` can process NetworkTables updates, and how CI catches regressions.

Typical FRC traffic is tens to low thousands of topic updates per second. The numbers below are far above that. The bottleneck in a match is the network and the NT server, not this library.

## Headline numbers

Measured with `npm run bench` on an Apple M1 Pro, Node 24. React benches run in jsdom (`flushSync` commit), not a full browser layout/paint.

| Workload                               |                          Rate |    Mean |
| -------------------------------------- | ----------------------------: | ------: |
| Client, 1 message / frame              |                       2.63M/s |  0.4 µs |
| Client, 10 messages / frame            |  1.01M frames/s (10.1M msg/s) |  1.1 µs |
| Client, 100 messages / frame           |   143k frames/s (14.3M msg/s) |  7.1 µs |
| Client, 100 frames through `onMessage` | 16.1k batches/s (1.61M msg/s) |   63 µs |
| React `useTopic` (one update)          |                         87k/s |   12 µs |
| React `usePrefixTopic` (one update)    |                         88k/s |   12 µs |
| React 50-hook dashboard (batched)      |                        3.8k/s |  278 µs |
| React 50-hook dashboard (unbatched)    |                         746/s | 1.37 ms |

Decode of a double is about 0.4 µs. Applying it through `useTopic` is about 12 µs. Batching 50 hook updates into one React commit stays under 300 µs mean.

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

CI JSON (used by GitHub Actions):

```bash
npm run bench:ci
```

Writes `tmp/github-bench.json` in the [customBiggerIsBetter](https://github.com/benchmark-action/github-action-benchmark) format.

## CI regression checks

Every push to `main` / `beta` and every pull request runs [`.github/workflows/bench.yml`](https://github.com/cjlawson02/ntcore-ts/blob/main/.github/workflows/bench.yml).

- Throughput is compared to the last stored `beta` or `main` result (higher ops/s is better).
- Each same-repo pull request gets a comment with the measured ops/s. Later runs update that comment.
- A drop to about 2/3 of that baseline comments an alert on the PR (`alert-threshold: 150%`).
- A drop to half of that baseline fails the job (`fail-threshold: 200%`).
- History is stored on the `gh-bench` branch (separate from the docs site).

GitHub-hosted runners are noisier than a laptop, so the fail bar is deliberately wide. Treat CI as a “did we tank it?” check, not a micro-benchmark of 5% changes. Absolute ops/s on `ubuntu-latest` will not match the M1 Pro table above.

Successful pushes to `beta` or `main` write the history used as the baseline. Later PRs compare against that.
