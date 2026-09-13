/**
 * E2E: MCP live NetworkTables tools
 *
 * Spec: apps/example-client/specs/mcp-live.md
 */
/// <reference types="vitest/globals" />
import { NtMcpService } from '@ntcore-ts/mcp';

import { CONNECTION_WAIT_MS, NT_SERVER_HOST, NT_SERVER_PORT, VALUE_WAIT_MS } from './_support';

describe('Feature: MCP live NetworkTables tools', () => {
  const service = new NtMcpService();

  beforeAll(async () => {
    const r = await service.connect({
      host: NT_SERVER_HOST,
      port: NT_SERVER_PORT,
      timeoutMs: CONNECTION_WAIT_MS,
    });
    expect(r.isError).toBeUndefined();
    expect(r.structuredContent.connected).toBe(true);
    // Allow inventory to fill
    await new Promise((r) => setTimeout(r, 500));
  }, CONNECTION_WAIT_MS + 5_000);

  afterAll(() => {
    service.disconnect();
  });

  it('[MCP-1] connects to example-robot', () => {
    const info = service.connectionInfo();
    expect(info.structuredContent.connected).toBe(true);
    expect(info.structuredContent.uri).toBe(NT_SERVER_HOST);
  });

  it('[MCP-2] lists Gyro topic', async () => {
    const list = await service.listTopics('/MyTable/');
    expect(list.isError).toBeUndefined();
    const topics = list.structuredContent.topics as { name: string; type: string }[];
    const gyro = topics.find((t) => t.name === '/MyTable/Gyro');
    expect(gyro).toBeDefined();
    expect(gyro?.type).toBe('double');
  });

  it(
    '[MCP-3] gets Gyro value',
    async () => {
      const r = await service.get('/MyTable/Gyro');
      expect(r.isError).toBeUndefined();
      expect(typeof r.structuredContent.value).toBe('number');
      expect(Number.isFinite(r.structuredContent.value as number)).toBe(true);
    },
    VALUE_WAIT_MS + 5_000
  );

  it(
    '[MCP-4] decodes PoseStruct',
    async () => {
      const r = await service.getDecoded('/MyTable/PoseStruct', 'struct:Pose2d');
      expect(r.isError).toBeUndefined();
      const value = r.structuredContent.value as {
        translation?: { x: number; y: number };
        rotation?: { value: number };
      };
      expect(value?.translation).toBeDefined();
      expect(typeof value.translation?.x).toBe('number');
      expect(typeof value.translation?.y).toBe('number');
      expect(typeof value.rotation?.value).toBe('number');
    },
    VALUE_WAIT_MS + 5_000
  );

  it('[MCP-5] subscribe summary includes Gyro', async () => {
    const r = await service.subscribe({
      prefixes: ['/MyTable/'],
      durationSeconds: 1.5,
      format: 'summary',
    });
    expect(r.isError).toBeUndefined();
    const summaries = r.structuredContent.summaries as { topic: string; count: number }[];
    const gyro = summaries.find((s) => s.topic === '/MyTable/Gyro');
    expect(gyro).toBeDefined();
    expect(gyro!.count).toBeGreaterThanOrEqual(1);
  }, 15_000);

  it('[MCP-6] refuses set when writes disabled', async () => {
    service.setWriteMode(false, false);
    const r = await service.set('/MyTable/Gyro', 0, 'double');
    expect(r.isError).toBe(true);
    expect(String(r.structuredContent.error)).toMatch(/disabled/i);
  });

  it(
    '[MCP-7] gated write round-trips PoseStruct echo',
    async () => {
      service.setWriteMode(true, true);
      const pose = {
        translation: { x: 3.5, y: -1.25 },
        rotation: { value: 0.5 },
      };
      const published = await service.set('/MyTable/PoseStructFromClient', pose, 'struct:Pose2d');
      expect(published.isError).toBeUndefined();
      expect(published.structuredContent.published).toBe(true);

      // Wait for echo
      const deadline = Date.now() + VALUE_WAIT_MS;
      let echoValue: unknown = null;
      while (Date.now() < deadline) {
        // Ensure echo topic is in inventory
        await service.listTopics('/MyTable/');
        const echo = await service.getDecoded('/MyTable/PoseStructEcho', 'struct:Pose2d');
        if (!echo.isError && echo.structuredContent.value) {
          echoValue = echo.structuredContent.value;
          break;
        }
        await new Promise((r) => setTimeout(r, 200));
      }
      expect(echoValue).toMatchObject({
        translation: { x: 3.5, y: -1.25 },
        rotation: { value: 0.5 },
      });
    },
    VALUE_WAIT_MS + 10_000
  );
});
