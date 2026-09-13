import { beforeAll, test } from 'vitest';
import { encode } from '@msgpack/msgpack';
import WSMock from 'vitest-websocket-mock';

import { NetworkTablesTypeInfos } from '../types/types';
import { LogLevel, setModuleLogLevel } from '../util/logger';
import { Util } from '../util/util';

import { NetworkTablesSocket } from './socket';

import type { BinaryMessage } from '../types/types';

const serverUrl = 'ws://localhost:5812/nt/throughput-bench';

const MESSAGES_PER_BATCH = 100;

let updateCount = 0;

const onTopicUpdate = () => {
  updateCount++;
};

const noop = () => {
  /* empty */
};
let onMessage: (event: { data: Uint8Array }) => void;
let singleFrame: Uint8Array;

function buildBinaryMessage(topicId: number, value: number): BinaryMessage {
  return Util.createBinaryMessage(topicId, 0, value, NetworkTablesTypeInfos.kDouble);
}

beforeAll(async () => {
  setModuleLogLevel('socket', LogLevel.SILENT);

  NetworkTablesSocket['instances'].forEach((instance: NetworkTablesSocket) => {
    instance.stopAutoConnect();
    try {
      instance.close();
    } catch {
      // best-effort cleanup
    }
  });
  NetworkTablesSocket['instances'].clear();

  const server = new WSMock(serverUrl);
  const socket = NetworkTablesSocket.getInstance(serverUrl, noop, noop, onTopicUpdate, noop, noop, noop, false);
  await server.connected;

  singleFrame = encode(buildBinaryMessage(0, 1.0));
  onMessage = socket['onMessage'].bind(socket);

  updateCount = 0;
  onMessage({ data: singleFrame });
  if (updateCount !== 1) {
    throw new Error(`expected 1 topic update during setup, got ${updateCount}`);
  }
});

test(`onMessage: process ${MESSAGES_PER_BATCH} binary frames (end-to-end)`, async ({ bench }) => {
  const dispatch = onMessage;
  const frame = singleFrame;
  const event = { data: frame };

  await bench(`${MESSAGES_PER_BATCH} binary frames through onMessage`, () => {
    for (let i = 0; i < MESSAGES_PER_BATCH; i++) {
      dispatch(event);
    }
  }).run();
});
