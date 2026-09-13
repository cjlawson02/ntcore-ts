import type { ReactNode } from 'react';
import { act } from 'react';
import { beforeAll, test, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/react/dont-cleanup-after-each';
import { flushSync } from 'react-dom';
import { NetworkTablesTypeInfos, type NetworkTables } from '@ntcore-ts/client';
import { NtcoreContext } from './context';
import { useTopic } from './use-topic';
import { usePrefixTopic } from './use-prefix-topic';

type TopicCallback = (value: unknown, params?: { name: string; type: string }) => void;

const DASHBOARD_HOOK_COUNT = 50;
const kDouble = NetworkTablesTypeInfos.kDouble;

function makeNt(onSubscribe: (name: string, cb: TopicCallback) => void): NetworkTables {
  const makeTopic = (name: string) => ({
    subscribe(cb: TopicCallback) {
      onSubscribe(name, cb);
      return 1;
    },
    unsubscribe() {
      /* empty */
    },
    unpublish() {
      /* empty */
    },
    setValue() {
      /* empty */
    },
    publish: async () => undefined,
    pubuid: 1,
  });

  return {
    createTopic: (name: string) => makeTopic(name),
    getJsonTopic: (name: string) => makeTopic(name),
    getPrefixTopic: (name: string) => makeTopic(name),
  } as unknown as NetworkTables;
}

function wrap(nt: NetworkTables) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <NtcoreContext.Provider value={nt}>{children}</NtcoreContext.Provider>;
  };
}

function commit(fn: () => void) {
  act(() => {
    flushSync(fn);
  });
}

function mount(ui: ReactNode, wrapper: (props: { children: ReactNode }) => ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  render(ui, { wrapper, container });
  return container;
}

let gyroRenders = 0;
let prefixRenders = 0;
let dashboardCellRenders = 0;

function GyroReadout() {
  const { value } = useTopic<number>('/Gyro', kDouble);
  gyroRenders++;
  return <span>{value}</span>;
}

function PrefixReadout() {
  const update = usePrefixTopic('/SmartDashboard');
  prefixRenders++;
  return <span>{update?.value as number | undefined}</span>;
}

function TopicCell({ name }: { name: string }) {
  const { value } = useTopic<number>(name, kDouble);
  dashboardCellRenders++;
  return <span>{value}</span>;
}

function Dashboard() {
  return (
    <>
      {Array.from({ length: DASHBOARD_HOOK_COUNT }, (_, i) => (
        <TopicCell key={i} name={`/t/${i}`} />
      ))}
    </>
  );
}

let singleCb: TopicCallback;
let prefixCb: TopicCallback;
const dashboardCbs: TopicCallback[] = [];
let gyroContainer: HTMLDivElement;
let prefixContainer: HTMLDivElement;
let dashboardContainer: HTMLDivElement;

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {
    /* react act() warnings would dominate bench output */
  });

  const singleNt = makeNt((_name, cb) => {
    singleCb = cb;
  });
  gyroContainer = mount(<GyroReadout />, wrap(singleNt));

  const prefixNt = makeNt((_name, cb) => {
    prefixCb = cb;
  });
  prefixContainer = mount(<PrefixReadout />, wrap(prefixNt));

  const dashNt = makeNt((_name, cb) => {
    dashboardCbs.push(cb);
  });
  dashboardContainer = mount(<Dashboard />, wrap(dashNt));

  if (!singleCb || !prefixCb || dashboardCbs.length !== DASHBOARD_HOOK_COUNT) {
    throw new Error(
      `bench setup failed: single=${String(!!singleCb)} prefix=${String(!!prefixCb)} dashboard=${dashboardCbs.length}`
    );
  }

  const gyroBefore = gyroRenders;
  commit(() => {
    singleCb(1);
  });
  if (gyroRenders < gyroBefore + 1) {
    throw new Error(`useTopic did not re-render (renders=${gyroRenders})`);
  }

  const prefixBefore = prefixRenders;
  commit(() => {
    prefixCb(1, { name: '/SmartDashboard/x', type: 'double' });
  });
  if (prefixRenders < prefixBefore + 1) {
    throw new Error(`usePrefixTopic did not re-render (renders=${prefixRenders})`);
  }

  const dashBefore = dashboardCellRenders;
  commit(() => {
    for (const cb of dashboardCbs) {
      cb(1);
    }
  });
  if (dashboardCellRenders < dashBefore + DASHBOARD_HOOK_COUNT) {
    throw new Error(
      `dashboard did not re-render all cells (delta=${dashboardCellRenders - dashBefore}, expected ${DASHBOARD_HOOK_COUNT})`
    );
  }
  if (dashboardContainer.querySelectorAll('span').length !== DASHBOARD_HOOK_COUNT) {
    throw new Error(
      `expected ${DASHBOARD_HOOK_COUNT} dashboard spans, got ${dashboardContainer.querySelectorAll('span').length}`
    );
  }
});

test('react hook processing', async ({ bench }) => {
  const topicCb = singleCb;
  const prefix = prefixCb;
  const gyroRoot = gyroContainer;
  const prefixRoot = prefixContainer;
  const cbs = dashboardCbs;
  const dashRoot = dashboardContainer;
  let seq = 0;

  await bench.compare(
    bench('useTopic: 1 value update', () => {
      const value = ++seq;
      commit(() => {
        topicCb(value);
      });
      if (gyroRoot.textContent !== String(value)) {
        throw new Error(`useTopic DOM mismatch: ${gyroRoot.textContent}`);
      }
    }),
    bench('usePrefixTopic: 1 value update', () => {
      const value = ++seq;
      commit(() => {
        prefix(value, { name: '/SmartDashboard/x', type: 'double' });
      });
      if (prefixRoot.textContent !== String(value)) {
        throw new Error(`usePrefixTopic DOM mismatch: ${prefixRoot.textContent}`);
      }
    }),
    bench('useTopic: 10 unbatched value updates', () => {
      let value = 0;
      for (let i = 0; i < 10; i++) {
        value = ++seq;
        commit(() => {
          topicCb(value);
        });
      }
      if (gyroRoot.textContent !== String(value)) {
        throw new Error(`useTopic x10 DOM mismatch: ${gyroRoot.textContent}`);
      }
    })
  );

  seq = 0;
  await bench.compare(
    bench(`${DASHBOARD_HOOK_COUNT} hooks, 1 batched update each`, () => {
      const value = ++seq;
      commit(() => {
        for (const cb of cbs) {
          cb(value);
        }
      });
      const spans = dashRoot.querySelectorAll('span');
      if (spans[0]?.textContent !== String(value) || spans[spans.length - 1]?.textContent !== String(value)) {
        throw new Error(`dashboard batched DOM mismatch: ${spans[0]?.textContent}`);
      }
    }),
    bench(`${DASHBOARD_HOOK_COUNT} hooks, 1 unbatched update each`, () => {
      let value = 0;
      for (const cb of cbs) {
        value = ++seq;
        commit(() => {
          cb(value);
        });
      }
      const spans = dashRoot.querySelectorAll('span');
      if (spans[spans.length - 1]?.textContent !== String(value)) {
        throw new Error(`dashboard unbatched DOM mismatch: ${spans[spans.length - 1]?.textContent}`);
      }
    })
  );
});
