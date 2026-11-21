---
'@ntcore-ts/client': patch
---

Remove the `tslog` dependency (about 23 KB gzipped) and log through the built-in `console` instead. Each level now writes to the matching console method (`console.debug`, `console.info`, `console.warn`) with a `[MODULE]` prefix, so browser DevTools can filter library logs by level. Outside the browser, lines start with an ISO timestamp; turn it on or off with `setLogTimestamps()`. Use `setLogHandler()` to send log lines to your own logger instead of the console.
