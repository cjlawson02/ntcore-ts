---
'@ntcore-ts/client': patch
---

Fix topics created after another subscription already covers them never receiving values. The server announces each topic and sends its value only once per client, so a topic created after, for example, a prefix subscription to `/` was never announced and ignored every update. On their first subscribe, topics and prefix topics now receive the announcements and latest values the client already has.
