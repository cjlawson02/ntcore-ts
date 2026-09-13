# Struct vs protobuf

Both struct and protobuf topics carry binary payloads over NetworkTables. Choose based on interoperability and schema needs.

## Struct

- Fixed-size binary layout used by WPILib Java/C++ struct topics
- Best for standard geometry types (`Pose2d`, `Translation2d`, …) that already exist on the robot
- Use `getStructTopic` / `useStructTopic` with a built-in descriptor or a custom `typeName` + `schema` string
- Interoperates directly with WPILib struct publishers/subscribers

## Protobuf

- Schema-driven messages via [Protocol Buffers](https://protobuf.dev/)
- Best for custom message types defined in `.proto` files
- Use `getProtobufTopic` / `useProtobufTopic` with Zod validators and, when publishing, `protoFilePath` (Node), `protoSource`, or `messageType`
- Schema is exchanged over NetworkTables; decoding can be validated at runtime with Zod

## Which to pick

- Matching WPILib geometry / existing struct topics → struct
- Custom app-defined messages with a `.proto` → protobuf

See the [struct](/guide/struct) and [protobuf](/guide/protobuf) guides for code examples.
