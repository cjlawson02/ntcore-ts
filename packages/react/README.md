# @ntcore-ts/react

React bindings for [@ntcore-ts/client](https://github.com/cjlawson02/ntcore-ts) (NetworkTables for FRC). Provides a context provider and hooks so components can subscribe to topics and connection status without managing lifecycle by hand.

Requires **React 18+** and **@ntcore-ts/client**.

## Documentation

Full React guide and API reference: [https://ntcore.chrislawson.dev/guide/react](https://ntcore.chrislawson.dev/guide/react)

## Installation

```bash
npm install @ntcore-ts/react @ntcore-ts/client react react-dom
```

```tsx
import { NtcoreProvider, useTopic, useConnectionStatus, NetworkTablesTypeInfos } from '@ntcore-ts/react';

function App() {
  return (
    <NtcoreProvider team={973}>
      <Dashboard />
    </NtcoreProvider>
  );
}

function Dashboard() {
  const { connected } = useConnectionStatus();
  const { value: gyro } = useTopic<number>('/MyTable/Gyro', NetworkTablesTypeInfos.kDouble);
  return (
    <p>
      {connected ? 'Connected' : 'Disconnected'} — Gyro: {gyro ?? '—'}
    </p>
  );
}
```

## Running unit tests

Run `npm run test -w @ntcore-ts/react` to execute the unit tests via [Vitest](https://vitest.dev/).
