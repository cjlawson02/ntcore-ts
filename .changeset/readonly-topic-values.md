---
'@ntcore-ts/client': major
'@ntcore-ts/react': major
---

**Breaking (types only):** Values passed to subscriber callbacks, returned by `getValue()`, and returned by the React hooks are now typed as `ReadonlyValue<T>`. Every subscriber of a topic receives the same object, so arrays and decoded struct, protobuf, and JSON values are read-only all the way down; `Uint8Array` values are unchanged. Code that mutated a received value, for example `value.sort()`, no longer compiles. Copy it first (`[...value].sort()`). `setValue()` accepts read-only values, so passing a received value back in still works. Runtime behavior is unchanged.
