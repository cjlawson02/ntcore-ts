---
'@ntcore-ts/client': minor
---

Add `addAnnounceListener`, `addUnannounceListener`, and `addPropertiesListener` to prefix topics to track subtopics that haven't sent a value yet, go away, or change properties. Pass `{ immediateNotify: true }` to `addAnnounceListener` to also hear about subtopics already announced on the connection. Unannounce listeners also run for every subtopic when the connection drops, and properties updates are applied to the subtopic's announce params, with `null` deleting a property. `immediateNotify` on `subscribe` no longer replays values from unannounced subtopics.
