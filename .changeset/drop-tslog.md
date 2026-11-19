---
'@ntcore-ts/client': patch
---

Remove the `tslog` dependency (about 23 KB gzipped) and log through the built-in `console` instead. Each level now writes to the matching console method (`console.debug`, `console.info`, `console.warn`) with a `[MODULE]` prefix, so browser DevTools can filter library logs by level. Log lines no longer include a timestamp prefix.
