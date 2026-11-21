---
'@ntcore-ts/client': patch
---

Fix topics created after another subscription already covers them never receiving values. The server announces each topic and sends its value only once per client, so a topic created after, for example, a prefix subscription to `/` was never announced and ignored every update. When a topic or prefix topic gets its first subscriber, it now receives the announcements the client already has, plus the latest values that are still current: values another subscription is keeping up to date, or values this client published. The new subscriber gets each replayed value once (`immediateNotify` included), values the client set itself are never overwritten, and `topicsonly` subscribers get no values.
