---
'@ntcore-ts/client': major
'@ntcore-ts/mcp': major
---

**Breaking:** Node.js 22 or newer is now required. The client uses the runtime's built-in `WebSocket` instead of the `isomorphic-ws` and `ws` packages, and Node.js only provides a global `WebSocket` from version 22. Browsers, Deno, and Bun are unaffected.

If you run the client on Node.js 20 or older, upgrade Node.js before updating this package.

`@ntcore-ts/mcp` runs on Node.js and now declares the same Node.js 22+ requirement.
