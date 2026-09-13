import { LogLevel, NetworkTables } from '@ntcore-ts/client';
import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

import { mcpPackageVersion } from './package-info.js';
import { NtMcpService } from './service.js';

export interface CreateNtMcpServerOptions {
  /** Inject a service instance (tests / in-process e2e). */
  service?: NtMcpService;
}

/** Build an MCP server exposing NetworkTables tools. */
export function createNtMcpServer(options?: CreateNtMcpServerOptions): McpServer {
  // Keep client logging off when serving over stdio (stdout = JSON-RPC).
  NetworkTables.setLogLevel(LogLevel.SILENT);

  const service = options?.service ?? new NtMcpService();
  const server = new McpServer({ name: 'ntcore-ts', version: mcpPackageVersion });

  server.registerTool(
    'nt_guide',
    {
      title: 'NetworkTables MCP guide',
      description:
        'Call this first if unfamiliar. Explains workflow, tool choice (nt_get vs nt_get_decoded vs nt_subscribe), write-gate status, and safety rules. Read-only.',
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async () => service.guide()
  );

  server.registerTool(
    'nt_connect',
    {
      title: 'Connect to NetworkTables',
      description:
        'Connect to an NT4 server. Provide either team (mDNS/team IP) OR host (e.g. localhost for sim). Default port 5810. Starts topic inventory. Prefer this before list/get/subscribe.',
      inputSchema: z.object({
        team: z.number().int().positive().optional().describe('FRC team number (mutually exclusive with host)'),
        host: z
          .string()
          .optional()
          .describe('Hostname or IP (e.g. localhost, 127.0.0.1). Mutually exclusive with team'),
        port: z.number().int().positive().optional().describe('NT4 port (default 5810)'),
        platform: z
          .enum(['roborio', 'systemcore'])
          .optional()
          .describe('Address resolution when using team (default roborio)'),
        timeout_ms: z.number().int().positive().optional().describe('Connection wait timeout in ms (default 10000)'),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    },
    async (args) =>
      service.connect({
        team: args.team,
        host: args.host,
        port: args.port,
        platform: args.platform,
        timeoutMs: args.timeout_ms,
      })
  );

  server.registerTool(
    'nt_disconnect',
    {
      title: 'Disconnect from NetworkTables',
      description: 'Close the NT connection and clear the topic inventory cache.',
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    },
    async () => service.disconnect()
  );

  server.registerTool(
    'nt_connection_info',
    {
      title: 'Connection info',
      description: 'Return connected/connecting flags, endpoint, RTT, and write-gate status. Read-only.',
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async () => service.connectionInfo()
  );

  server.registerTool(
    'nt_list_topics',
    {
      title: 'List NetworkTables topics',
      description:
        'List announced topics from the inventory cache (name, type, properties). Filter with prefix (e.g. /MyTable/). Call nt_connect first. Prefer over guessing topic names. Read-only.',
      inputSchema: z.object({
        prefix: z.string().optional().describe('Only topics starting with this prefix'),
        limit: z.number().int().positive().max(500).optional().describe('Max topics to return (default 500)'),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async (args) => await service.listTopics(args.prefix, args.limit)
  );

  server.registerTool(
    'nt_get',
    {
      title: 'Get topic value',
      description:
        'Read one topic value. Best for scalars/arrays/json. For struct:/proto: topics prefer nt_get_decoded. Topic must be known via nt_list_topics. Read-only.',
      inputSchema: z.object({
        topic: z.string().describe('Full topic name, e.g. /MyTable/Gyro'),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async (args) => service.get(args.topic)
  );

  server.registerTool(
    'nt_get_multiple',
    {
      title: 'Get multiple topic values',
      description: 'Batch nt_get for up to 50 topics. Read-only.',
      inputSchema: z.object({
        topics: z.array(z.string()).min(1).max(50).describe('Topic names to read'),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async (args) => service.getMultiple(args.topics)
  );

  server.registerTool(
    'nt_get_decoded',
    {
      title: 'Get decoded struct/protobuf topic',
      description:
        'Decode a struct: or proto: topic into a JSON object using @ntcore-ts/client. Prefer this over nt_get for Pose2d and other structured types. Optional type_hint like struct:Pose2d. Read-only.',
      inputSchema: z.object({
        topic: z.string().describe('Full topic name'),
        type_hint: z.string().optional().describe('Override wire type, e.g. struct:Pose2d or proto:Pose2d'),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async (args) => service.getDecoded(args.topic, args.type_hint)
  );

  server.registerTool(
    'nt_list_struct_types',
    {
      title: 'List struct types',
      description:
        'List built-in WPILib geometry struct types and any discovered from /.schema/struct:* or live topics. Read-only.',
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
    },
    async () => service.listStructTypes()
  );

  server.registerTool(
    'nt_subscribe',
    {
      title: 'Timed subscribe / sample',
      description:
        'Sample topic updates under prefixes for duration_seconds. Use format=summary for min/max/mean/last/rate (preferred evidence). format=samples returns capped point lists. Prefer over repeated nt_get for dynamics. Read-only.',
      inputSchema: z.object({
        prefixes: z.array(z.string()).min(1).max(20).describe('Topic prefixes to sample (e.g. ["/MyTable/"])'),
        duration_seconds: z.number().positive().max(30).optional().describe('How long to sample (default 2, max 30)'),
        sample_interval_ms: z
          .number()
          .nonnegative()
          .optional()
          .describe('Min ms between stored samples per topic (0 = every change)'),
        change_only: z.boolean().optional().describe('Skip numeric changes at or below change_epsilon'),
        change_epsilon: z.number().optional().describe('Epsilon for change_only numerics (default 1e-9)'),
        format: z.enum(['summary', 'samples']).optional().describe('summary (default) or samples'),
      }),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false },
    },
    async (args) =>
      service.subscribe({
        prefixes: args.prefixes,
        durationSeconds: args.duration_seconds,
        sampleIntervalMs: args.sample_interval_ms,
        changeOnly: args.change_only,
        changeEpsilon: args.change_epsilon,
        format: args.format,
      })
  );

  server.registerTool(
    'nt_set_write_mode',
    {
      title: 'Enable or disable NT writes',
      description:
        'Session write gate. Enabling REQUIRES confirm=true. Also enabled when NT_ALLOW_WRITES=1 at process start. Does not bypass path allowlist. Destructive.',
      inputSchema: z.object({
        enabled: z.boolean().describe('true to allow nt_set / nt_set_multiple'),
        confirm: z.boolean().optional().describe('Must be true when enabling writes'),
      }),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true },
    },
    async (args) => service.setWriteMode(args.enabled, args.confirm ?? false)
  );

  server.registerTool(
    'nt_set',
    {
      title: 'Set / publish a topic value',
      description:
        'Publish a value to one topic. Fails if write gate is off, topic is outside NT_WRITE_ALLOWLIST, or types mismatch. Prefer expected_type when known. Destructive — can affect robot behavior if code is listening. Cannot enable/disable via FMS/DS.',
      inputSchema: z.object({
        topic: z.string().describe('Full topic name'),
        value: z.unknown().describe('Value to publish (JSON-compatible for scalars/structs)'),
        expected_type: z.string().optional().describe('NT type string, e.g. double or struct:Pose2d'),
      }),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
    },
    async (args) => await service.set(args.topic, args.value, args.expected_type)
  );

  server.registerTool(
    'nt_set_multiple',
    {
      title: 'Set / publish multiple topics',
      description: 'Batch nt_set. Same write-gate and allowlist rules. Destructive.',
      inputSchema: z.object({
        updates: z
          .array(
            z.object({
              topic: z.string(),
              value: z.unknown(),
              expected_type: z.string().optional(),
            })
          )
          .min(1)
          .max(50),
      }),
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
    },
    async (args) => await service.setMultiple(args.updates)
  );

  return server;
}

export { NtMcpService };
