---
'@ntcore-ts/client': patch
---

Fix two NT4 protocol handling bugs:

- Subscribing to a topic before publishing it no longer marks the topic as a publisher. Announces sent for a subscription omit `pubuid`, and the client treated that as a match for a topic with no pubuid, so `publish()` was skipped and `setValue()` threw "is not a publisher".
- A `properties` update that deletes a property (for example `{ persistent: null }`, sent when robot code calls `setPersistent(false)`) is now accepted. Previously it failed validation and every message in the same text frame was dropped.
