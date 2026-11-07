/**
 * Client package release config. Use with semantic-release-monorepo from packages/client:
 *   cd packages/client && npx semantic-release -e semantic-release-monorepo
 * Paths below are relative to packages/client (cwd when run from that directory).
 */
import type { GlobalConfig } from 'semantic-release';

const config: GlobalConfig = {
  branches: ['main', { name: 'beta', prerelease: true }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: '.',
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'npx turbo run build --filter=@ntcore-ts/client',
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: '.',
        npmPublish: true,
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): @ntcore-ts/client ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};

export default config;
