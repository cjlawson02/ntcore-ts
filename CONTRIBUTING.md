# Contributing

Thanks for contributing to ntcore-ts.

## Setup

```bash
npm ci
```

This is an npm workspaces + Turborepo monorepo. Prefer `npx turbo run <task>` or root `npm run` scripts, and filter packages with `--filter=@ntcore-ts/client` (etc.).

## Common commands

| Command                | Purpose                           |
| ---------------------- | --------------------------------- |
| `npm run build`        | Build packages                    |
| `npm test`             | Unit tests (client + react + mcp) |
| `npm run lint`         | ESLint                            |
| `npm run typecheck`    | Typecheck workspaces              |
| `npm run format:check` | Prettier check                    |
| `npm run e2e:local`    | E2E against example-robot         |
| `npm run bench`        | Client + React processing benches |
| `npm run docs`         | Build the docs site               |
| `npm run docs:dev`     | Docs site with live reload        |

## Pull requests

- Open an issue for bugs with enough detail to reproduce.
- Keep PRs focused; match existing code style and patterns.
- Add or update tests when behavior changes.
- Processing-speed benches (`npm run bench`) run in CI on every PR. A large drop vs `main` fails the Bench check; see [the performance guide](https://ntcore.chrislawson.dev/guide/performance).
- For e2e features, keep specs and tests in sync (`apps/example-client/specs/` ↔ `apps/example-client/src/e2e/`). See [AGENTS.md](AGENTS.md) and [apps/example-client/specs/README.md](apps/example-client/specs/README.md).

## Docs

Public guides live in [`apps/docs/`](apps/docs/). The API reference is generated from TypeDoc (`typedoc.json`) into `apps/docs/api/` when you run `npm run docs`. Change guide pages or JSDoc on public APIs; keep package READMEs short.

## Agent / maintainer notes

[AGENTS.md](AGENTS.md) covers Turbo conventions and the spec-driven e2e workflow used by maintainers and coding agents. It is not the public product documentation.
