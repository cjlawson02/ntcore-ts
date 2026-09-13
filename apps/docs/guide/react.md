# React

React bindings for `@ntcore-ts/client`. Provides a context provider and hooks so components can subscribe to topics and connection status without managing lifecycle by hand.

Requires React 18+ and `@ntcore-ts/client`.

## Installation

```bash
npm install @ntcore-ts/react @ntcore-ts/client react react-dom
```

## Usage

Wrap your app with `NtcoreProvider` (by team number or URI), then use hooks in descendants. All hooks throw if used outside `NtcoreProvider`.

Changing `NtcoreProvider` props `team`, `uri`, `port`, or `platform` switches the underlying NetworkTables singleton so descendants reconnect automatically.

```tsx
import {
  NtcoreProvider,
  useTopic,
  useConnectionStatus,
  NetworkTables,
  NetworkTablesTypeInfos,
  LogLevel,
} from '@ntcore-ts/react';

// By team number (e.g. 973 → roborio-973-frc.local, or platform="systemcore" → 10.9.73.2)
function App() {
  return (
    <NtcoreProvider team={973} port={5810} platform="systemcore">
      <Dashboard />
    </NtcoreProvider>
  );
}

// Or by URI (e.g. localhost for simulation)
function AppLocal() {
  return (
    <NtcoreProvider uri="localhost" port={5810}>
      <Dashboard />
    </NtcoreProvider>
  );
}

function Dashboard() {
  const { connected, connecting, rtt } = useConnectionStatus();
  const { value: gyro, error } = useTopic<number>('/MyTable/Gyro', NetworkTablesTypeInfos.kDouble);

  return (
    <div>
      <p>Robot: {connected ? 'Connected' : connecting ? 'Connecting…' : 'Disconnected'}</p>
      {connected && rtt >= 0 && <p>RTT: {rtt} ms</p>}
      {error && <p>Error: {error.message}</p>}
      <p>Gyro: {gyro ?? '—'}</p>
    </div>
  );
}
```

## Reading vs writing

- **Reading a topic** — Omit `publish` in options. You get `{ value, setValue: undefined, isReadyToWrite: false, error }`. Use `value` to display robot data.
- **Writing a topic** — Pass `publish: true` or `publish: { retained: true }` (etc.) in options to make this client the publisher. You get `{ value, setValue, isReadyToWrite, error }`. Only call `setValue` when `isReadyToWrite` is true (after the server has acknowledged); otherwise the client can throw. Check `error` for publish or write failures.

## Publishing to a topic

- **`publish: true`** — Become the publisher with default properties (not retained).
- **`publish: { retained: true }`** — Become the publisher with `retained` (topic is not deleted when the last publisher stops).
- **`unpublishOnUnmount`** — When `publish` is set, defaults to `true`: the hook calls `topic.unpublish()` on unmount. Set to `false` to remain publisher after the component unmounts.

Always wait for `isReadyToWrite` before calling `setValue`.

```tsx
const { value, setValue, isReadyToWrite, error } = useTopic<string>(
  '/MyTable/AutoMode',
  NetworkTablesTypeInfos.kString,
  {
    defaultValue: 'Default',
    publish: true,
  }
);

const handleChange = (newValue: string) => {
  if (isReadyToWrite && setValue) setValue(newValue);
};
```

With a retained topic:

```tsx
const { value, setValue, isReadyToWrite } = useTopic<string>('/MyTable/AutoMode', NetworkTablesTypeInfos.kString, {
  defaultValue: 'Default',
  publish: { retained: true },
  unpublishOnUnmount: false,
});
```

## Prefix, struct, and protobuf topics

Subscribe to all topics under a path (prefix) with one of two hooks:

- **`usePrefixTopic(prefix, subscribeOptions?)`** — Returns only the latest single update `{ name, value, type } | null`. Use when you need to react to "something under this prefix changed" without keeping a full list.
- **`usePrefixTopicMap(prefix, subscribeOptions?)`** — Returns a map of every topic name → `{ value, type }` under the prefix, batched so rapid announcements all appear. Prefer this when listing or iterating over topics.

Prefix topics are subscribe-only (no publish).

```tsx
import { Pose2d, Pose2dSchema } from '@ntcore-ts/client';
import { useStructTopic, useProtobufTopic } from '@ntcore-ts/react';

const { value: pose } = useStructTopic('/MyTable/PoseStruct', Pose2d);
const { value: protoPose } = useProtobufTopic<Pose2d>('/MyTable/Pose', { validator: Pose2dSchema });
```

- **`useStructTopic(name, Pose2d)`** or **`useStructTopic<T>(name, options?)`** — Struct topic. Prefer a geometry descriptor as the second argument. Returns `{ value, setValue, isReadyToWrite, error }` like `useTopic`.
- **`useProtobufTopic<T>(name, options?)`** — Protobuf topic. Same return shape; when using `publish`, only call `setValue` when `isReadyToWrite` is true.

## Recommended connection UX

For dashboards used at the field:

- **Connection overlay** — When disconnected, show a full-screen "Connect to the robot" overlay instead of a broken or empty UI.
- **Manual connect** — Let the user enter server address and port (e.g. from `nt.getURI()` and `nt.getPort()`), then call `nt.changeURI(uri, port)` on submit.
- **Escape to dismiss** — Call `nt.stopAutoConnect()` when the user presses Escape so the overlay closes and the client stops auto-reconnecting. Use `useConnectionStatus()` so the overlay only re-opens when connected again unless the user explicitly dismissed it.
- **Help** — Provide a short connection guide (robot network, server address, default port 5810).

See `apps/example-react` in the repo for a full `ConnectionBackdrop` + `HelpDialog` implementation.

## Advanced: raw client access

```tsx
const nt = useNtcore();

nt.changeURI('roborio-973-frc.local', 5810);
nt.changeTeam(973, 5810, 'systemcore');

nt.stopAutoConnect();
nt.startAutoConnect();

NetworkTables.setLogLevel(LogLevel.DEBUG);
```

## Hook and provider summary

| API                                     | Role                                                                                             |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `NtcoreProvider`                        | Props: `team?` \| `uri`, optional `port` (default `5810`), optional `platform` when using `team` |
| `useNtcore()`                           | Returns the `NetworkTables` instance; throws outside a provider                                  |
| `useTopic<T>(name, typeInfo, options?)` | Subscribe (and optionally publish) a typed topic                                                 |
| `usePrefixTopic` / `usePrefixTopicMap`  | Prefix subscriptions                                                                             |
| `useStructTopic` / `useProtobufTopic`   | Struct / protobuf topics                                                                         |
| `useConnectionStatus()`                 | `{ connected, connecting, rtt }`                                                                 |

Re-exports from `@ntcore-ts/client`: `NetworkTables`, `NetworkTablesTypeInfos`, `LogLevel`, `getRobotAddress`, `getTeamIpAddress`, `parseRobotAddress`, `SYSTEMCORE_MDNS_HOST`, and related types. Geometry types are imported from `@ntcore-ts/client`.

Full generated docs: [API reference](/api/). Hook update rates and CI regression checks: [Performance](/guide/performance).
