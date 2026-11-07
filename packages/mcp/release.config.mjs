/**
 * MCP package release config. Use with semantic-release-monorepo from packages/mcp:
 *   cd packages/mcp && npx semantic-release -e semantic-release-monorepo
 * Paths below are relative to packages/mcp (cwd when run from that directory).
 */
/** @type {import('semantic-release').GlobalConfig} */
const config = {
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
        prepareCmd: 'npm run build',
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
        message: 'chore(release): @ntcore-ts/mcp ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};

export default config;
