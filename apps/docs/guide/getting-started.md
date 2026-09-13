# Getting started

Install the client and connect to a NetworkTables server.

## Installation

```bash
npm install --save @ntcore-ts/client
```

[Zod](https://github.com/colinhacks/zod) v4 is a dependency of the client. Install it in your app only if you write custom validators (`npm install zod@^4`).

For React apps, also install [`@ntcore-ts/react`](/guide/react).

## Connecting to the NetworkTables server

The `NetworkTables` class is instance-based and supports connections to multiple teams or URIs.

```typescript
import { NetworkTables } from '@ntcore-ts/client';
```

### By team number

```typescript
NetworkTables.getInstanceByTeam(team: number, port = 5810, platform?: 'roborio' | 'systemcore')
```

- **RoboRIO** (default): `roborio-<team>-frc.local`
- **SystemCore**: `10.TE.AM.2` (team 973 → `10.9.73.2`)

Use `getInstanceByURI('robot.local')` for SystemCore mDNS, or USB/WiFi IPs (`172.26.0.1` / `172.27.0.1` / `172.30.0.1`) as a URI.

### By URI

```typescript
NetworkTables.getInstanceByURI(uri: string, port?)
```

Creates the instance using a custom URI (e.g. `127.0.0.1`, `localhost`).

### Closing the client

Call `ntcore.close()` to disconnect, unsubscribe/unpublish, and drop the singleton so it does not leak. In the browser the client also registers a `beforeunload` listener (it does not overwrite `window.onbeforeunload`).

## Next steps

- [Topics](/guide/topics) — publish and subscribe
- [React](/guide/react) — hooks and `NtcoreProvider`
- [MCP server](/guide/mcp) — agent tooling over live NT
- [Performance](/guide/performance) — client and React benches, CI regression checks
- [API reference](/api/) — full generated docs

## Try the examples

In this repo, start the robot then the dashboard:

```bash
npm run serve -w @ntcore-ts/example-robot
npm run serve -w @ntcore-ts/example-react
```
