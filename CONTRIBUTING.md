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
| `npm run lint`         | Oxlint                            |
| `npm run typecheck`    | Typecheck workspaces              |
| `npm run format:check` | Oxfmt check                       |
| `npm run e2e:local`    | E2E against example-robot         |
| `npm run bench`        | Client + React processing benches |
| `npm run docs`         | Build the docs site               |
| `npm run docs:dev`     | Docs site with live reload        |

## Pull requests

- Open an issue for bugs with enough detail to reproduce.
- Keep PRs focused; match existing code style and patterns.
- Add or update tests when behavior changes.
- Processing-speed benches (`npm run bench`) run on every PR under [CodSpeed](https://codspeed.io/cjlawson02/ntcore-ts), which comments with the change against `main` and flags regressions; see [the performance guide](https://ntcore.chrislawson.dev/guide/performance).
- For e2e features, keep specs and tests in sync (`apps/example-client/specs/` ↔ `apps/example-client/src/e2e/`). See [AGENTS.md](AGENTS.md) and [apps/example-client/specs/README.md](apps/example-client/specs/README.md).

## Releases

Releases are automated with [Changesets](https://changesets.dev).

- **Add a changeset to any PR that should release a package:** run `npm run changeset`, pick the packages and bump type, and commit the generated `.changeset/*.md` file. Docs, tests, and tooling changes don't need one.
- **Every merge to `main` with pending changesets** publishes `<next version>-beta.<datetime>` to the `beta` dist-tag (`npm i @ntcore-ts/client@beta`) and opens or updates a `chore: version packages` PR with the version bumps and changelogs.
- **Merging that PR cuts the stable release:** the new versions are published to `latest`, with git tags and GitHub releases.

Publishing uses npm trusted publishing (OIDC) from `.github/workflows/ci.yml`. `npm run check:packages` (publint, attw, and an install smoke test) runs on every PR.

## Docs

Public guides live in [`apps/docs/`](apps/docs/). The API reference is generated from TypeDoc (`typedoc.json`) into `apps/docs/api/` when you run `npm run docs`. Change guide pages or JSDoc on public APIs; keep package READMEs short.

## Agent / maintainer notes

[AGENTS.md](AGENTS.md) covers Turbo conventions and the spec-driven e2e workflow used by maintainers and coding agents. It is not the public product documentation.
