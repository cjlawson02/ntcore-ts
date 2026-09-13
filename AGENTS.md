# Spec-driven E2E tests and workspace conventions

## Task runner

This is an npm workspaces + Turborepo monorepo.

- Prefer `turbo run <task>` (or root `npm run` scripts) for build, lint, test, e2e, docs, and typecheck.
- Prefix with the package manager: `npx turbo run test`, `npm run build`.
- Filter packages with `--filter=@ntcore-ts/client` (or other workspace names).
- Package scripts live in each package's `package.json`; Turbo orchestrates them via `turbo.json`.

## Common commands

- E2E (against example-robot): `npm run e2e:local` (builds deps, starts the robot, runs the e2e suite)
- Unit tests: `npx turbo run test --filter=@ntcore-ts/client` (or `@ntcore-ts/react`). For a single file: `npx vitest run --config packages/client/vitest.config.mts <name>`
- Benchmarks: `npm run bench` (client + react). CI JSON: `npm run bench:ci`.
- Multiple package tests: `npm test` (client + react)
- Format check: `npm run format:check`
- Docs site: `npm run docs` (build) or `npm run docs:dev` (VitePress + TypeDoc). Guides live in `apps/docs/`; API is generated into `apps/docs/api/`.

## Spec-driven E2E tests

E2E tests are **spec-driven**: every major feature has a markdown spec under `apps/example-client/specs/` that defines the feature, its acceptance criteria (AC), and the tests that cover those ACs. Tests live in `apps/example-client/src/e2e/` with one `*.spec.ts` file per spec.

**Specs and tests MUST stay in sync.** When you change one, change the other in the same PR.

### Spec template

Every spec file in `apps/example-client/specs/` MUST follow this shape:

```markdown
# Feature: <name>

<One-paragraph description.>

## User stories

- <bullet list of who-wants-what-so-that>

## Acceptance criteria

| ID   | Description          |
| ---- | -------------------- |
| XX-1 | <testable behaviour> |

## Tests

| Test                  | Covers | Status      |
| --------------------- | ------ | ----------- |
| `[XX-1] <test title>` | XX-1   | Implemented |

## Coverage

<Summary of which ACs are covered and which (if any) are not.>
```

### Rules (MUST follow)

1. **AC ID format**: 2–3 letter feature prefix + integer (no leading zeros), e.g. `SUB-1`, `PUB-12`. Prefixes are chosen per feature (`SUB`, `PUB`, `PFX`, `STR`, `RET`, …).
2. **AC IDs are stable.** Once published, an AC's ID never changes or gets reused. Retired ACs stay in the spec marked `Retired`.
3. **Every test name starts with its AC IDs in square brackets.** Example: `[SUB-1] receives kDouble Gyro value from server`. Multiple ACs are comma-separated: `[PUB-1, PUB-2] ...`.
4. **Every test file maps 1:1 to a spec file.** One spec = one `*.spec.ts` under `apps/example-client/src/e2e/`. When adding a new major feature, create both a new `specs/<feature>.md` and a new `src/e2e/<feature>.spec.ts`.
5. **Every AC has a row in its spec's Tests table.** Either covered by at least one `Implemented` test, or explicitly listed as `Not yet implemented` / `Retired`.
6. **When changing tests or ACs**, update:
   - The spec's **Acceptance criteria** table (if ACs changed).
   - The spec's **Tests** table row (if a test title, coverage, or status changed).
   - The spec's **Coverage** summary (if any AC became covered/uncovered).
   - The test title's bracketed AC IDs (if coverage changed).
7. Shared helpers/schemas for e2e tests live in `apps/example-client/src/e2e/_support.ts` (underscore prefix keeps it out of the `*.spec.ts` include glob).
8. The e2e vitest config runs spec files **sequentially** (`fileParallelism: false`) because they share a live NT server. Don't introduce parallelism-dependent tests.

See `apps/example-client/specs/README.md` for the canonical rulebook.
