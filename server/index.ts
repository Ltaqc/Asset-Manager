import * as http from "http";
import { initApp, log } from "./app";

// ── Dev entry point — used by `tsx server/index.ts` ──────────────────────────
// In prod, dist/startup.cjs is the entry (binds port instantly, then loads
// dist/app.cjs). This file keeps dev working exactly as before.

const port = parseInt(process.env.PORT || "5000", 10);
const httpServer = http.createServer();

httpServer.listen({ port, host: "0.0.0.0" }, () => {
  log(`serving on port ${port}`);
});

initApp(httpServer).catch((err) => {
  console.error("[startup] init failed:", err);
});
