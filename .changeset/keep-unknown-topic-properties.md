---
'@ntcore-ts/client': patch
---

Keep topic properties that aren't part of the NT4 spec, like `unit`, instead of dropping them when parsing announce and properties messages

Unknown keys are also kept in `properties` update messages. The `TopicProperties` type accepted by `publish()` and `setProperties()` still lists only `persistent`, `retained`, and `cached`, so misspelled keys remain a compile error.
