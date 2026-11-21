# Feature: Prefix Topics

The client can subscribe to a name prefix and receive values from every topic whose name starts with that prefix, along with per-topic metadata (name, type, id). This enables "wildcard" dashboards without having to pre-declare each topic.

## User stories

- As a dashboard developer, I want to subscribe to `/MyTable/Accelerometer/` once and receive values for `X` and `Y` sub-topics as they appear.
- As a dashboard developer, I want to know which topic a value came from inside the prefix callback so I can route it correctly.
- As a dashboard developer, I want to keep publishing scalars (e.g. `AutoMode`) while a prefix subscription is active.
- As a dashboard developer, I want to know when topics under a prefix appear, change properties, or go away, even if they never send a value.
- As a dashboard developer, I want to create a regular topic for a value my prefix subscription already covers and still receive its value.

## Acceptance criteria

| ID    | Description                                                                                                                                                                   |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PFX-1 | `getPrefixTopic(prefix)` + `subscribe(cb)` shall deliver values for every topic whose name starts with `prefix`.                                                              |
| PFX-2 | The prefix subscription callback shall receive the matched topic name in its `params.name` argument so callers can distinguish sub-topics.                                    |
| PFX-3 | A scalar topic (e.g. `/MyTable/AutoMode`) published by the client shall be readable via a fresh `getStringTopic(...).subscribe(...)` while the prefix subscription is active. |
| PFX-4 | An `addAnnounceListener` callback shall be called when a topic matching the prefix is announced, even before it has a value.                                                  |
| PFX-5 | An `addPropertiesListener` callback shall be called when the properties of a topic matching the prefix change.                                                                |
| PFX-6 | An `addUnannounceListener` callback shall be called when a topic matching the prefix is unannounced.                                                                          |
| PFX-7 | An `addAnnounceListener` callback added with `immediateNotify: true` shall be called right away for every matching topic already announced on the connection.                 |
| PFX-8 | An `addUnannounceListener` callback shall be called for every matching topic when the connection drops.                                                                       |
| PFX-9 | A regular topic created after a prefix subscription already received its announcement shall receive the topic's current value and later updates.                              |

## Tests

| Test                                                                                    | Covers       | Status              |
| --------------------------------------------------------------------------------------- | ------------ | ------------------- |
| `[PFX-1, PFX-2] receives /MyTable/Accelerometer/{X,Y} via a single prefix subscription` | PFX-1, PFX-2 | Implemented         |
| `[PFX-3] publishes /MyTable/AutoMode and reads it back via a separate subscription`     | PFX-3        | Implemented         |
| `[PFX-4, PFX-6] notifies prefix listeners when a subtopic is announced and unannounced` | PFX-4, PFX-6 | Implemented         |
| `[PFX-5] notifies prefix listeners when a subtopic's properties change`                 | PFX-5        | Not yet implemented |
| `[PFX-7] replays already-announced subtopics to a new announce listener`                | PFX-7        | Not yet implemented |
| `[PFX-8] notifies prefix unannounce listeners when the connection drops`                | PFX-8        | Not yet implemented |
| `[PFX-9] receives values on a topic created after the prefix subscription covered it`   | PFX-9        | Implemented         |

## Coverage

PFX-1…PFX-4, PFX-6 and PFX-9 have at least one implemented e2e test. PFX-5, PFX-7 and PFX-8 are covered by unit tests in `packages/client/src/lib/pubsub/prefix-topic.spec.ts` but have no e2e test yet. PFX-8 needs the example robot to drop the connection mid-test.
