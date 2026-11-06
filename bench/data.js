window.BENCHMARK_DATA = {
  "lastUpdate": 1794008320900,
  "repoUrl": "https://github.com/cjlawson02/ntcore-ts",
  "entries": {
    "ntcore-ts": [
      {
        "commit": {
          "author": {
            "email": "git@chrislawson.dev",
            "name": "Chris Lawson",
            "username": "cjlawson02"
          },
          "committer": {
            "email": "git@chrislawson.dev",
            "name": "Chris Lawson",
            "username": "cjlawson02"
          },
          "distinct": true,
          "id": "25de6c48c96c7ae1003e6314e43a20dad2900a28",
          "message": "ci: publish bench baselines from beta and comment results on pull requests\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
          "timestamp": "2026-11-01T10:15:43-08:00",
          "tree_id": "16f7c32a3392c6c5e14a8a055414d3c76ab32ae8",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/25de6c48c96c7ae1003e6314e43a20dad2900a28"
        },
        "date": 1793556983426,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 6706.244956075668,
            "unit": "ops/s",
            "extra": "rme ±0.18%\nmean 0.1507 ms\np99 0.3261 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 1025596.0946864068,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0010 ms\np99 0.0016 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 228972.77422905108,
            "unit": "ops/s",
            "extra": "rme ±0.04%\nmean 0.0045 ms\np99 0.0069 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 27746.534601454423,
            "unit": "ops/s",
            "extra": "rme ±0.10%\nmean 0.0368 ms\np99 0.0535 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 108627.59767077412,
            "unit": "ops/s",
            "extra": "rme ±0.05%\nmean 0.0094 ms\np99 0.0156 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 105922.22322840693,
            "unit": "ops/s",
            "extra": "rme ±0.08%\nmean 0.0099 ms\np99 0.0187 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 10617.619611558921,
            "unit": "ops/s",
            "extra": "rme ±0.26%\nmean 0.0978 ms\np99 0.1524 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 4579.47954549494,
            "unit": "ops/s",
            "extra": "rme ±0.30%\nmean 0.2222 ms\np99 0.3230 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 1045.0608915222278,
            "unit": "ops/s",
            "extra": "rme ±0.40%\nmean 0.9629 ms\np99 1.4627 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "jonah@jonahsnider.com",
            "name": "Jonah Snider",
            "username": "jonahsnider"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3fbe8336cef00289a1fa8e552264a0347e7b5343",
          "message": "feat: use wpilib-struct for parsing struct schemas (#658)\n\nSigned-off-by: Jonah Snider <jonah@jonahsnider.com>",
          "timestamp": "2026-11-01T10:18:29-08:00",
          "tree_id": "f97e6d3724b4266b982c3fbf21dac0630f5d17ad",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/3fbe8336cef00289a1fa8e552264a0347e7b5343"
        },
        "date": 1793557192190,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 3696.995461069789,
            "unit": "ops/s",
            "extra": "rme ±0.27%\nmean 0.2741 ms\np99 0.5730 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 623848.4922195203,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0017 ms\np99 0.0028 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 122980.57642556846,
            "unit": "ops/s",
            "extra": "rme ±0.05%\nmean 0.0085 ms\np99 0.0180 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 13519.741428771842,
            "unit": "ops/s",
            "extra": "rme ±0.16%\nmean 0.0761 ms\np99 0.1127 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 39860.79457867071,
            "unit": "ops/s",
            "extra": "rme ±0.17%\nmean 0.0263 ms\np99 0.0551 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 39442.9469278076,
            "unit": "ops/s",
            "extra": "rme ±0.17%\nmean 0.0268 ms\np99 0.0564 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 4249.490177249731,
            "unit": "ops/s",
            "extra": "rme ±0.42%\nmean 0.2418 ms\np99 0.3433 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 2173.4002767438956,
            "unit": "ops/s",
            "extra": "rme ±0.50%\nmean 0.4696 ms\np99 0.8790 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 412.2126838984619,
            "unit": "ops/s",
            "extra": "rme ±0.91%\nmean 2.4499 ms\np99 3.4259 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "7269141+cjlawson02@users.noreply.github.com",
            "name": "Chris Lawson",
            "username": "cjlawson02"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "488e178cc330fa65175790a44f53e6538c6e0535",
          "message": "chore: replace ESLint and Prettier with oxlint and oxfmt (#660)\n\nTypecheck with TypeScript 7 while Rollup and TypeDoc keep the TypeScript 6 compiler API.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
          "timestamp": "2026-11-01T10:39:18-08:00",
          "tree_id": "2c97c456ab8e0b6da5f40c527871931725ffb960",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/488e178cc330fa65175790a44f53e6538c6e0535"
        },
        "date": 1793558392670,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 6080.6771254277655,
            "unit": "ops/s",
            "extra": "rme ±0.28%\nmean 0.1681 ms\np99 0.3953 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 976849.3230705846,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0011 ms\np99 0.0016 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 216900.70360233422,
            "unit": "ops/s",
            "extra": "rme ±0.04%\nmean 0.0048 ms\np99 0.0079 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 25492.33532037001,
            "unit": "ops/s",
            "extra": "rme ±0.15%\nmean 0.0409 ms\np99 0.0724 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 99836.65951470965,
            "unit": "ops/s",
            "extra": "rme ±0.07%\nmean 0.0104 ms\np99 0.0196 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 98814.47008134454,
            "unit": "ops/s",
            "extra": "rme ±0.08%\nmean 0.0106 ms\np99 0.0178 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 10317.68271728493,
            "unit": "ops/s",
            "extra": "rme ±0.17%\nmean 0.0993 ms\np99 0.1392 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 4131.834913261307,
            "unit": "ops/s",
            "extra": "rme ±0.56%\nmean 0.2596 ms\np99 0.7626 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 961.1783993648194,
            "unit": "ops/s",
            "extra": "rme ±0.45%\nmean 1.0471 ms\np99 1.5865 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "7269141+cjlawson02@users.noreply.github.com",
            "name": "Chris Lawson",
            "username": "cjlawson02"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e09955fa3a70f4b98b344bf892281ef6fb5087af",
          "message": "perf(client): speed up binary frame handling on the socket hot path (#661)\n\nSkip Zod validation for inbound msgpack tuples in favor of a cheap shape check, drop per-frame debug logging, and refresh the idle watchdog via a timestamp instead of clear+setTimeout on every message.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
          "timestamp": "2026-11-01T10:44:59-08:00",
          "tree_id": "be5fe5fa59aa0aa40aa7a84dd21c13032fd4ce3f",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/e09955fa3a70f4b98b344bf892281ef6fb5087af"
        },
        "date": 1793558738034,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 13808.298107808236,
            "unit": "ops/s",
            "extra": "rme ±0.11%\nmean 0.0733 ms\np99 0.1003 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 1950851.2363168667,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0005 ms\np99 0.0013 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 954986.8652416882,
            "unit": "ops/s",
            "extra": "rme ±0.03%\nmean 0.0012 ms\np99 0.0022 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 166425.55850797653,
            "unit": "ops/s",
            "extra": "rme ±0.04%\nmean 0.0064 ms\np99 0.0101 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 73745.26801692181,
            "unit": "ops/s",
            "extra": "rme ±0.07%\nmean 0.0139 ms\np99 0.0226 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 73124.37838342553,
            "unit": "ops/s",
            "extra": "rme ±0.07%\nmean 0.0140 ms\np99 0.0230 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 7514.381499384128,
            "unit": "ops/s",
            "extra": "rme ±0.24%\nmean 0.1373 ms\np99 0.2636 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 3048.303661799727,
            "unit": "ops/s",
            "extra": "rme ±0.33%\nmean 0.3322 ms\np99 0.4701 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 698.5321342663052,
            "unit": "ops/s",
            "extra": "rme ±0.59%\nmean 1.4430 ms\np99 2.1971 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "git@chrislawson.dev",
            "name": "Chris Lawson",
            "username": "cjlawson02"
          },
          "committer": {
            "email": "git@chrislawson.dev",
            "name": "Chris Lawson",
            "username": "cjlawson02"
          },
          "distinct": true,
          "id": "915277ac49a7c764ea8ca13c43c75c63f16e6808",
          "message": "docs: refresh client performance charts after socket hot-path speedup\n\nUpdate root, client, and performance-guide numbers from post-#661 benches (~2.6M frames/s).\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
          "timestamp": "2026-11-01T10:46:51-08:00",
          "tree_id": "22dc5f62bf90d0e01caff36d27fc929776e85efd",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/915277ac49a7c764ea8ca13c43c75c63f16e6808"
        },
        "date": 1793558852124,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 13315.329617835077,
            "unit": "ops/s",
            "extra": "rme ±0.11%\nmean 0.0759 ms\np99 0.0998 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 1941222.381408041,
            "unit": "ops/s",
            "extra": "rme ±0.01%\nmean 0.0005 ms\np99 0.0012 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 979568.2506218752,
            "unit": "ops/s",
            "extra": "rme ±0.01%\nmean 0.0011 ms\np99 0.0016 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 167412.5556873146,
            "unit": "ops/s",
            "extra": "rme ±0.04%\nmean 0.0061 ms\np99 0.0104 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 71423.74585343944,
            "unit": "ops/s",
            "extra": "rme ±0.09%\nmean 0.0144 ms\np99 0.0259 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 71319.39578987981,
            "unit": "ops/s",
            "extra": "rme ±0.09%\nmean 0.0145 ms\np99 0.0255 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 7221.012033165362,
            "unit": "ops/s",
            "extra": "rme ±0.29%\nmean 0.1438 ms\np99 0.2728 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 3046.5738397689565,
            "unit": "ops/s",
            "extra": "rme ±0.34%\nmean 0.3327 ms\np99 0.5298 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 684.939639495606,
            "unit": "ops/s",
            "extra": "rme ±0.50%\nmean 1.4677 ms\np99 2.0478 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "git@chrislawson.dev",
            "name": "Chris Lawson",
            "username": "cjlawson02"
          },
          "committer": {
            "email": "git@chrislawson.dev",
            "name": "Chris Lawson",
            "username": "cjlawson02"
          },
          "distinct": true,
          "id": "1ef937f99e300b8c29f7fbd573de7aef97263900",
          "message": "ci: stop posting a second benchmark review on pull requests\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
          "timestamp": "2026-11-01T11:07:52-08:00",
          "tree_id": "ff5185eaaaa458ca4af35fff9a30af2746efe4a3",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/1ef937f99e300b8c29f7fbd573de7aef97263900"
        },
        "date": 1793560113563,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 9773.172038498424,
            "unit": "ops/s",
            "extra": "rme ±0.16%\nmean 0.1035 ms\np99 0.1794 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 1523009.683308131,
            "unit": "ops/s",
            "extra": "rme ±0.01%\nmean 0.0007 ms\np99 0.0016 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 765976.8449036687,
            "unit": "ops/s",
            "extra": "rme ±0.01%\nmean 0.0013 ms\np99 0.0017 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 135078.59505256554,
            "unit": "ops/s",
            "extra": "rme ±0.05%\nmean 0.0076 ms\np99 0.0145 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 40984.84640973994,
            "unit": "ops/s",
            "extra": "rme ±0.15%\nmean 0.0254 ms\np99 0.0511 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 40705.59828150126,
            "unit": "ops/s",
            "extra": "rme ±0.16%\nmean 0.0256 ms\np99 0.0525 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 4435.219321933218,
            "unit": "ops/s",
            "extra": "rme ±0.39%\nmean 0.2307 ms\np99 0.3155 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 2275.692276554829,
            "unit": "ops/s",
            "extra": "rme ±0.43%\nmean 0.4460 ms\np99 0.6352 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 434.64319250391725,
            "unit": "ops/s",
            "extra": "rme ±0.94%\nmean 2.3269 ms\np99 3.1607 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "7269141+cjlawson02@users.noreply.github.com",
            "name": "Chris Lawson",
            "username": "cjlawson02"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6bea1df1279aef1955d09042a783774b44bd8986",
          "message": "perf(react): slim useTopic update path for multi-hook dashboards (#662)\n\nMove publish ready/error off the hot-path useState, collapse per-render\nrefs into one store, and update useLatestRef during render so many-hook\nbatched updates avoid extra effect work. Refresh performance charts and\nallow intentional render-time ref sync under oxlint react/refs.\n\nCo-authored-by: Cursor <cursoragent@cursor.com>",
          "timestamp": "2026-11-01T11:20:18-08:00",
          "tree_id": "e47d369239d36ade0733b00cbd04b361a91d33e3",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/6bea1df1279aef1955d09042a783774b44bd8986"
        },
        "date": 1793560852085,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 17602.24322815694,
            "unit": "ops/s",
            "extra": "rme ±0.09%\nmean 0.0573 ms\np99 0.0764 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 2384810.864159296,
            "unit": "ops/s",
            "extra": "rme ±0.01%\nmean 0.0004 ms\np99 0.0009 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 1279101.4438937258,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0009 ms\np99 0.0018 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 246782.500754337,
            "unit": "ops/s",
            "extra": "rme ±0.03%\nmean 0.0041 ms\np99 0.0052 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 111410.88745583335,
            "unit": "ops/s",
            "extra": "rme ±0.05%\nmean 0.0092 ms\np99 0.0153 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 105850.50224553834,
            "unit": "ops/s",
            "extra": "rme ±0.07%\nmean 0.0099 ms\np99 0.0186 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 10866.705961750597,
            "unit": "ops/s",
            "extra": "rme ±0.26%\nmean 0.0967 ms\np99 0.2432 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 4918.6496998207285,
            "unit": "ops/s",
            "extra": "rme ±0.33%\nmean 0.2080 ms\np99 0.3660 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 1020.5902019644045,
            "unit": "ops/s",
            "extra": "rme ±0.70%\nmean 1.0014 ms\np99 1.9544 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9fdee82dcc0149457937389510f462c6ca5a35da",
          "message": "chore(deps): update dependency @vitejs/plugin-react to v6.2.1 (#664)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-11-02T20:32:40Z",
          "tree_id": "27b560fdac5c02cbf90bf37bad3f641a44a838eb",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/9fdee82dcc0149457937389510f462c6ca5a35da"
        },
        "date": 1793651597644,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 15305.485957696665,
            "unit": "ops/s",
            "extra": "rme ±0.11%\nmean 0.0661 ms\np99 0.0935 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 2375782.1259166426,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0004 ms\np99 0.0010 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 881374.4287662826,
            "unit": "ops/s",
            "extra": "rme ±0.03%\nmean 0.0012 ms\np99 0.0018 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 178905.78776157415,
            "unit": "ops/s",
            "extra": "rme ±0.04%\nmean 0.0057 ms\np99 0.0082 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 81988.23170828112,
            "unit": "ops/s",
            "extra": "rme ±0.08%\nmean 0.0126 ms\np99 0.0212 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 78987.01460406938,
            "unit": "ops/s",
            "extra": "rme ±0.09%\nmean 0.0132 ms\np99 0.0263 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 8407.929748751974,
            "unit": "ops/s",
            "extra": "rme ±0.24%\nmean 0.1220 ms\np99 0.1856 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 3826.4231698008552,
            "unit": "ops/s",
            "extra": "rme ±0.36%\nmean 0.2666 ms\np99 0.4769 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 774.871604635428,
            "unit": "ops/s",
            "extra": "rme ±0.53%\nmean 1.2996 ms\np99 1.9633 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1256b82b6c32eaae70cad840802e2eac97ebf933",
          "message": "chore(deps): update vitest monorepo to v5.1.0 (#665)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-11-03T02:26:57Z",
          "tree_id": "c45aeda88705ac075c520c127eecd021fb0893ae",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/1256b82b6c32eaae70cad840802e2eac97ebf933"
        },
        "date": 1793672856209,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 15078.515211214304,
            "unit": "ops/s",
            "extra": "rme ±0.32%\nmean 0.0697 ms\np99 0.1033 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 2585564.217614385,
            "unit": "ops/s",
            "extra": "rme ±0.03%\nmean 0.0004 ms\np99 0.0011 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 1141726.0712295375,
            "unit": "ops/s",
            "extra": "rme ±0.03%\nmean 0.0010 ms\np99 0.0020 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 194993.0822183363,
            "unit": "ops/s",
            "extra": "rme ±0.05%\nmean 0.0055 ms\np99 0.0091 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 92434.22268660887,
            "unit": "ops/s",
            "extra": "rme ±0.07%\nmean 0.0112 ms\np99 0.0217 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 88519.35941062601,
            "unit": "ops/s",
            "extra": "rme ±0.09%\nmean 0.0119 ms\np99 0.0246 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 9759.640860823692,
            "unit": "ops/s",
            "extra": "rme ±0.21%\nmean 0.1053 ms\np99 0.1589 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 4712.878725389309,
            "unit": "ops/s",
            "extra": "rme ±0.42%\nmean 0.2201 ms\np99 0.4289 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 816.099802027901,
            "unit": "ops/s",
            "extra": "rme ±0.59%\nmean 1.2370 ms\np99 1.9851 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fc8429c06b50d4b5aad448ba4a729e033749fd70",
          "message": "chore(deps): update dependency rollup to v4.67.5 (#668)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-11-04T19:46:31Z",
          "tree_id": "426f43bcd2573ac213bfadd9d35c87b6a85a8fb6",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/fc8429c06b50d4b5aad448ba4a729e033749fd70"
        },
        "date": 1793821633208,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 9773.994247924122,
            "unit": "ops/s",
            "extra": "rme ±0.11%\nmean 0.1029 ms\np99 0.1281 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 1461325.9999182618,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0007 ms\np99 0.0016 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 759036.5198670364,
            "unit": "ops/s",
            "extra": "rme ±0.01%\nmean 0.0014 ms\np99 0.0018 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 135595.80811987683,
            "unit": "ops/s",
            "extra": "rme ±0.04%\nmean 0.0076 ms\np99 0.0133 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 44859.84500344489,
            "unit": "ops/s",
            "extra": "rme ±0.15%\nmean 0.0233 ms\np99 0.0482 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 43681.92914977618,
            "unit": "ops/s",
            "extra": "rme ±0.15%\nmean 0.0239 ms\np99 0.0510 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 4769.210685244605,
            "unit": "ops/s",
            "extra": "rme ±0.37%\nmean 0.2145 ms\np99 0.3045 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 2687.566734534147,
            "unit": "ops/s",
            "extra": "rme ±0.40%\nmean 0.3780 ms\np99 0.5697 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 452.4508115271723,
            "unit": "ops/s",
            "extra": "rme ±0.98%\nmean 2.2373 ms\np99 3.1254 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e657c6a80f3c1fa475b3229bd9a92b93c560f17e",
          "message": "chore(deps): update dependency ts-proto to v2.18.4 (#667)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-11-04T23:55:06Z",
          "tree_id": "92aa05fa9c4f912d79e024b4abe2eaabcd1512e8",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/e657c6a80f3c1fa475b3229bd9a92b93c560f17e"
        },
        "date": 1793836541545,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 17918.42072524071,
            "unit": "ops/s",
            "extra": "rme ±0.17%\nmean 0.0579 ms\np99 0.1714 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 2404876.1396285137,
            "unit": "ops/s",
            "extra": "rme ±0.01%\nmean 0.0004 ms\np99 0.0009 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 1302427.5324011773,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0008 ms\np99 0.0016 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 249814.22278926254,
            "unit": "ops/s",
            "extra": "rme ±0.04%\nmean 0.0042 ms\np99 0.0072 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 115389.0106499631,
            "unit": "ops/s",
            "extra": "rme ±0.05%\nmean 0.0088 ms\np99 0.0147 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 110502.7572174798,
            "unit": "ops/s",
            "extra": "rme ±0.06%\nmean 0.0093 ms\np99 0.0177 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 11718.075128746119,
            "unit": "ops/s",
            "extra": "rme ±0.17%\nmean 0.0871 ms\np99 0.1373 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 5136.992537727415,
            "unit": "ops/s",
            "extra": "rme ±0.41%\nmean 0.2003 ms\np99 0.3078 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 1071.4944139228564,
            "unit": "ops/s",
            "extra": "rme ±0.56%\nmean 0.9472 ms\np99 1.8866 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2c0d790adf10268c1caa9408aa345d5c103b3696",
          "message": "chore(deps): update npm to v12.2.2 (#669)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-11-05T03:45:48Z",
          "tree_id": "bdf080c475883b5c098549ce157b55eabeb86a70",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/2c0d790adf10268c1caa9408aa345d5c103b3696"
        },
        "date": 1793850385164,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 17642.790347073184,
            "unit": "ops/s",
            "extra": "rme ±0.08%\nmean 0.0570 ms\np99 0.0710 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 2252013.723339129,
            "unit": "ops/s",
            "extra": "rme ±0.01%\nmean 0.0005 ms\np99 0.0009 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 1261975.223954879,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0008 ms\np99 0.0019 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 241949.4315160819,
            "unit": "ops/s",
            "extra": "rme ±0.03%\nmean 0.0043 ms\np99 0.0062 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 113293.78439620615,
            "unit": "ops/s",
            "extra": "rme ±0.05%\nmean 0.0090 ms\np99 0.0140 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 107718.82679978061,
            "unit": "ops/s",
            "extra": "rme ±0.06%\nmean 0.0096 ms\np99 0.0178 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 11168.890899335738,
            "unit": "ops/s",
            "extra": "rme ±0.21%\nmean 0.0918 ms\np99 0.1516 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 4985.199685012613,
            "unit": "ops/s",
            "extra": "rme ±0.35%\nmean 0.2054 ms\np99 0.3309 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 996.0880522332615,
            "unit": "ops/s",
            "extra": "rme ±0.84%\nmean 1.0361 ms\np99 2.4173 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e09be5898893ee3761b8af4015b405dda29abbc9",
          "message": "chore(deps): update dependency vite to v8.3.6 (#670)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-11-05T10:38:38Z",
          "tree_id": "d520948ce544648fcc517ef19f73dff76b0184e5",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/e09be5898893ee3761b8af4015b405dda29abbc9"
        },
        "date": 1793875153001,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 16633.792173118643,
            "unit": "ops/s",
            "extra": "rme ±0.17%\nmean 0.0620 ms\np99 0.1077 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 2315903.507696508,
            "unit": "ops/s",
            "extra": "rme ±0.01%\nmean 0.0004 ms\np99 0.0006 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 1273462.6235699411,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0008 ms\np99 0.0014 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 233985.36132782212,
            "unit": "ops/s",
            "extra": "rme ±0.06%\nmean 0.0046 ms\np99 0.0081 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 110358.3072386881,
            "unit": "ops/s",
            "extra": "rme ±0.05%\nmean 0.0093 ms\np99 0.0159 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 103580.69456878828,
            "unit": "ops/s",
            "extra": "rme ±0.08%\nmean 0.0106 ms\np99 0.0225 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 11128.872691006107,
            "unit": "ops/s",
            "extra": "rme ±0.15%\nmean 0.0919 ms\np99 0.1156 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 5179.779666799062,
            "unit": "ops/s",
            "extra": "rme ±0.29%\nmean 0.1968 ms\np99 0.3308 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 991.7007408110339,
            "unit": "ops/s",
            "extra": "rme ±0.96%\nmean 1.0547 ms\np99 2.5380 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cfdc23ed4d48b1841a64eb4e30693da226008078",
          "message": "chore(deps): update dependency oxlint-tsgolint to v7.0.2006 (#671)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-11-06T04:27:36Z",
          "tree_id": "d58f81fc88db70ce3d54a67da5023e6ede247333",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/cfdc23ed4d48b1841a64eb4e30693da226008078"
        },
        "date": 1793939295432,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 9922.464183295162,
            "unit": "ops/s",
            "extra": "rme ±0.12%\nmean 0.1017 ms\np99 0.1301 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 1433235.9116797769,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0007 ms\np99 0.0017 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 737605.8710778763,
            "unit": "ops/s",
            "extra": "rme ±0.01%\nmean 0.0014 ms\np99 0.0020 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 129734.27223052338,
            "unit": "ops/s",
            "extra": "rme ±0.04%\nmean 0.0079 ms\np99 0.0154 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 45888.04964258033,
            "unit": "ops/s",
            "extra": "rme ±0.14%\nmean 0.0227 ms\np99 0.0440 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 44447.28058232439,
            "unit": "ops/s",
            "extra": "rme ±0.15%\nmean 0.0234 ms\np99 0.0450 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 4886.217195962397,
            "unit": "ops/s",
            "extra": "rme ±0.44%\nmean 0.2120 ms\np99 0.4099 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 2735.5341273833164,
            "unit": "ops/s",
            "extra": "rme ±0.43%\nmean 0.3726 ms\np99 0.6543 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 462.220254661851,
            "unit": "ops/s",
            "extra": "rme ±0.75%\nmean 2.1789 ms\np99 2.7873 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "990e2aa022389a78bd12c4c735de185b2faf4f0e",
          "message": "chore(deps): update dependency sass to v1.108.0 (#673)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-11-06T13:48:50Z",
          "tree_id": "0edc65396eff7e6796250c120b87f6e5b1985af0",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/990e2aa022389a78bd12c4c735de185b2faf4f0e"
        },
        "date": 1793972969569,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 10766.4353019475,
            "unit": "ops/s",
            "extra": "rme ±0.20%\nmean 0.0949 ms\np99 0.1719 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 1557336.5564876962,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0007 ms\np99 0.0015 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 674159.3673195214,
            "unit": "ops/s",
            "extra": "rme ±0.03%\nmean 0.0016 ms\np99 0.0023 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 131594.9298208568,
            "unit": "ops/s",
            "extra": "rme ±0.05%\nmean 0.0078 ms\np99 0.0139 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 54149.969144762355,
            "unit": "ops/s",
            "extra": "rme ±0.09%\nmean 0.0189 ms\np99 0.0304 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 51429.07855959603,
            "unit": "ops/s",
            "extra": "rme ±0.12%\nmean 0.0203 ms\np99 0.0397 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 5599.444899948217,
            "unit": "ops/s",
            "extra": "rme ±0.25%\nmean 0.1819 ms\np99 0.2389 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 2818.9959841716977,
            "unit": "ops/s",
            "extra": "rme ±0.38%\nmean 0.3604 ms\np99 0.5378 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 570.5792325750041,
            "unit": "ops/s",
            "extra": "rme ±0.72%\nmean 1.7704 ms\np99 2.7744 ms"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b26f9547091442113f4cc9fdac97e02d50605003",
          "message": "chore(deps): update dependency rollup to v4.68.0 (#674)\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]@users.noreply.github.com>",
          "timestamp": "2026-11-06T23:38:05Z",
          "tree_id": "02deb546fd85ff657e9eae725721fd1cb16eefe7",
          "url": "https://github.com/cjlawson02/ntcore-ts/commit/b26f9547091442113f4cc9fdac97e02d50605003"
        },
        "date": 1794008320526,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "client · 100 binary frames through onMessage",
            "value": 12847.403475991063,
            "unit": "ops/s",
            "extra": "rme ±0.18%\nmean 0.0794 ms\np99 0.1346 ms"
          },
          {
            "name": "client · 1 message per frame",
            "value": 1887297.7747068622,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0006 ms\np99 0.0012 ms"
          },
          {
            "name": "client · 10 messages per frame",
            "value": 944382.3162434489,
            "unit": "ops/s",
            "extra": "rme ±0.02%\nmean 0.0011 ms\np99 0.0019 ms"
          },
          {
            "name": "client · 100 messages per frame",
            "value": 164877.10217238122,
            "unit": "ops/s",
            "extra": "rme ±0.05%\nmean 0.0063 ms\np99 0.0109 ms"
          },
          {
            "name": "react · useTopic: 1 value update",
            "value": 82171.90796988315,
            "unit": "ops/s",
            "extra": "rme ±0.07%\nmean 0.0125 ms\np99 0.0210 ms"
          },
          {
            "name": "react · usePrefixTopic: 1 value update",
            "value": 78278.86659553912,
            "unit": "ops/s",
            "extra": "rme ±0.09%\nmean 0.0133 ms\np99 0.0256 ms"
          },
          {
            "name": "react · useTopic: 10 unbatched value updates",
            "value": 8392.351310555952,
            "unit": "ops/s",
            "extra": "rme ±0.21%\nmean 0.1219 ms\np99 0.1972 ms"
          },
          {
            "name": "react · 50 hooks, 1 batched update each",
            "value": 3679.525701621235,
            "unit": "ops/s",
            "extra": "rme ±0.40%\nmean 0.2798 ms\np99 0.6335 ms"
          },
          {
            "name": "react · 50 hooks, 1 unbatched update each",
            "value": 754.4382831355214,
            "unit": "ops/s",
            "extra": "rme ±0.53%\nmean 1.3341 ms\np99 1.8370 ms"
          }
        ]
      }
    ]
  }
}