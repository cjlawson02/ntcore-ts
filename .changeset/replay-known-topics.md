---
'@ntcore-ts/client': patch
---

Fix topics created after another subscription already covers them never receiving values. The server announces each topic and sends its value only once per client, so a topic created after, for example, a prefix subscription to `/` was never announced and ignored every update. When a topic or prefix topic gets its first subscriber, it now picks up the announcements the client already has and any current value another topic already holds. The new subscriber receives each replayed value once (with or without `immediateNotify`), values the client set itself are never overwritten, and `topicsonly` subscribers get no values.
