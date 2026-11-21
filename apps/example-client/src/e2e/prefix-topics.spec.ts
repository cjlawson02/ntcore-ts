/**
 * E2E: Prefix Topics
 *
 * Spec: apps/example-client/specs/prefix-topics.md
 *
 * Every test title below starts with the acceptance criteria IDs it covers
 * (e.g. `[PFX-1, PFX-2] ...`). Keep this file and the spec in sync —
 * see apps/example-client/specs/README.md for the rules.
 */
/// <reference types="vitest/globals" />
import { NetworkTables } from '@ntcore-ts/client';
import type { PropertiesMessageParams } from '@ntcore-ts/client';

import {
  CONNECTION_WAIT_MS,
  NT_SERVER_HOST,
  NT_SERVER_PORT,
  VALUE_WAIT_MS,
  waitForConnection,
  waitForValue,
} from './_support';

describe('Feature: Prefix Topics', () => {
  const nt = NetworkTables.getInstanceByURI(NT_SERVER_HOST, NT_SERVER_PORT);

  // Populated by the prefix subscription started in beforeAll.
  const prefixAccelValues: Record<'X' | 'Y', number | undefined> = {
    X: undefined,
    Y: undefined,
  };

  beforeAll(async () => {
    await waitForConnection(nt);

    const accelerometerPrefix = nt.getPrefixTopic('/MyTable/Accelerometer/');
    accelerometerPrefix.subscribe((value, params) => {
      if (value === undefined || value === null || !params.name) return;
      if (params.name.endsWith('X')) prefixAccelValues.X = Number(value);
      else if (params.name.endsWith('Y')) prefixAccelValues.Y = Number(value);
    });
  }, CONNECTION_WAIT_MS + 2_000);

  it(
    '[PFX-1, PFX-2] receives /MyTable/Accelerometer/{X,Y} via a single prefix subscription',
    async () => {
      await new Promise<void>((resolve, reject) => {
        const t = setTimeout(() => reject(new Error('Accelerometer prefix value timeout')), VALUE_WAIT_MS);
        const id = setInterval(() => {
          if (prefixAccelValues.X != null && prefixAccelValues.Y != null) {
            clearInterval(id);
            clearTimeout(t);
            resolve();
          }
        }, 50);
      });

      expect(Number.isFinite(prefixAccelValues.X)).toBe(true);
      expect(Number.isFinite(prefixAccelValues.Y)).toBe(true);
    },
    VALUE_WAIT_MS + 2_000
  );

  it(
    '[PFX-3] publishes /MyTable/AutoMode and reads it back via a separate subscription',
    async () => {
      const autoModeValue = 'E2E Test Auto';
      const autoModeTopic = nt.getStringTopic('/MyTable/AutoMode', 'Default');
      await autoModeTopic.publish({ retained: true });
      autoModeTopic.setValue(autoModeValue);

      const autoModeRead = await new Promise<string>((resolve, reject) => {
        const t = setTimeout(() => reject(new Error('AutoMode readback timeout')), VALUE_WAIT_MS);
        const readTopic = nt.getStringTopic('/MyTable/AutoMode', 'Default');
        readTopic.subscribe((v) => {
          if (v != null && v === autoModeValue) {
            clearTimeout(t);
            resolve(v);
          }
        });
      });

      expect(autoModeRead).toBe(autoModeValue);
    },
    VALUE_WAIT_MS + 5_000
  );

  it(
    '[PFX-4, PFX-6] notifies prefix listeners when a subtopic is announced and unannounced',
    async () => {
      const listenerPrefix = nt.getPrefixTopic('/MyTable/PrefixListeners/');
      listenerPrefix.subscribe(() => {});
      const name = '/MyTable/PrefixListeners/Target';
      const waitFor = <T extends { name: string }>(add: (callback: (params: T) => void) => () => void, label: string) =>
        new Promise<T>((resolve, reject) => {
          const t = setTimeout(() => reject(new Error(`${label} listener timeout`)), VALUE_WAIT_MS);
          const remove = add((params) => {
            if (params.name === name) {
              clearTimeout(t);
              remove();
              resolve(params);
            }
          });
        });

      const topic = nt.getStringTopic(name, 'initial');

      const announced = waitFor((callback) => listenerPrefix.addAnnounceListener(callback), 'Announce');
      // No value is set, the topic only exists
      await topic.publish();
      await expect(announced).resolves.toMatchObject({ name, type: 'string' });

      const unannounced = waitFor((callback) => listenerPrefix.addUnannounceListener(callback), 'Unannounce');
      topic.unpublish();
      await expect(unannounced).resolves.toMatchObject({ name });
    },
    VALUE_WAIT_MS * 2 + 2_000
  );

  it(
    "[PFX-5] notifies prefix listeners when a subtopic's properties change",
    async () => {
      const listenerPrefix = nt.getPrefixTopic('/MyTable/PrefixProperties/');
      listenerPrefix.subscribe(() => {}, { topicsonly: true });
      const name = '/MyTable/PrefixProperties/Target';
      const topic = nt.getStringTopic(name, 'initial');
      await topic.publish();

      const changed = new Promise<PropertiesMessageParams>((resolve, reject) => {
        const t = setTimeout(() => reject(new Error('Properties listener timeout')), VALUE_WAIT_MS);
        const remove = listenerPrefix.addPropertiesListener((params) => {
          if (params.name === name) {
            clearTimeout(t);
            remove();
            resolve(params);
          }
        });
      });
      // Only the listener is under test, so don't fail on the setProperties response
      topic.setProperties({ retained: true }).catch(() => {});

      await expect(changed).resolves.toMatchObject({ name, update: { retained: true } });
      topic.unpublish();
    },
    VALUE_WAIT_MS + 2_000
  );

  it(
    '[PFX-7] replays already-announced subtopics to a new announce listener',
    async () => {
      // beforeAll's /MyTable/Accelerometer/ subscription has the X and Y announcements, and the server
      // announces each topic to a client only once, so this new prefix topic can only learn of them by replay
      expect(prefixAccelValues.X).toBeDefined();
      const accelPrefix = nt.getPrefixTopic('/MyTable/Accel');
      const announced: string[] = [];

      const remove = accelPrefix.addAnnounceListener((params) => announced.push(params.name), {
        immediateNotify: true,
      });
      remove();

      expect(announced).toEqual(expect.arrayContaining(['/MyTable/Accelerometer/X', '/MyTable/Accelerometer/Y']));
    },
    VALUE_WAIT_MS
  );

  it(
    '[PFX-8] notifies prefix unannounce listeners when the client disconnects from the server',
    async () => {
      // A second instance so disconnecting it doesn't disturb the shared one
      const other = NetworkTables.getInstanceByURI('127.0.0.1', NT_SERVER_PORT);
      try {
        await waitForConnection(other);
        const accelPrefix = other.getPrefixTopic('/MyTable/Accelerometer/');
        const announced = new Promise<void>((resolve, reject) => {
          const t = setTimeout(() => reject(new Error('Announce listener timeout')), VALUE_WAIT_MS);
          const remove = accelPrefix.addAnnounceListener((params) => {
            if (params.name === '/MyTable/Accelerometer/X') {
              clearTimeout(t);
              remove();
              resolve();
            }
          });
        });
        accelPrefix.subscribe(() => {}, { topicsonly: true });
        await announced;

        const unannounced: string[] = [];
        accelPrefix.addUnannounceListener((params) => unannounced.push(params.name));
        // Point the instance at a port nothing listens on, which drops the current connection
        other.changeURI('127.0.0.1', 1);

        expect(unannounced).toEqual(expect.arrayContaining(['/MyTable/Accelerometer/X', '/MyTable/Accelerometer/Y']));
      } finally {
        other.close();
      }
    },
    CONNECTION_WAIT_MS + VALUE_WAIT_MS + 2_000
  );

  it(
    '[PFX-9] receives values on a topic created after the prefix subscription covered it',
    async () => {
      // PFX-1 already waited for the prefix subscription to receive X, so the server won't announce it again
      expect(prefixAccelValues.X).toBeDefined();

      const xTopic = nt.getDoubleTopic('/MyTable/Accelerometer/X');
      const value = await waitForValue(xTopic, Number.isFinite, 'Accelerometer X value timeout');

      expect(Number.isFinite(value)).toBe(true);
    },
    VALUE_WAIT_MS + 2_000
  );
});
