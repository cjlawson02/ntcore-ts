window.BENCHMARK_DATA = {
  "lastUpdate": 1793560113868,
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
      }
    ]
  }
}