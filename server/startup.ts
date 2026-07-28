import * as http from "http";
import * as path from "path";
import * as fs from "fs";

// PM2 launches the compiled entrypoint directly, so load deployment settings
// before importing the full application and initializing the database.
// Node preserves variables that are already set, so secrets must load first.
for (const envFile of [".env.secrets", ".env", ".env.production"]) {
  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    process.loadEnvFile(envPath);
  }
}

// ── Prod entry point — ONLY http/path/fs imported here ────────────────────────
// This file compiles to dist/startup.cjs (~5 KB). Node.js loads it in < 5 ms
// and binds the port before Replit's healthcheck fires.
// The full Express app (dist/app.cjs, ~1.2 MB) is loaded via runtime require()
// AFTER the port is bound so healthcheck never sees "connection refused".

const PORT = parseInt(process.env.PORT || "5000", 10);
const distPublic = path.resolve(process.cwd(), "dist", "public");
const indexPath = path.join(distPublic, "index.html");

// Pre-read index.html synchronously so we can serve it immediately during
// the ~600 ms boot window before Express takes over.
let indexHtml: Buffer | null = null;
if (fs.existsSync(indexPath)) {
  indexHtml = fs.readFileSync(indexPath);
}

// Minimal fallback handler — runs while full app is loading.
// Swapped out once Express is ready (see initApp → server.on("request", app)).
function fallback(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = (req.url || "/").split("?")[0];

  if (url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end('{"status":"ok"}');
    return;
  }

  // Serve index.html (or plain OK) for all non-API routes
  if (!url.startsWith("/api/")) {
    if (indexHtml) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(indexHtml);
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("OK");
    }
    return;
  }

  // API routes not yet available
  res.writeHead(503, { "Content-Type": "application/json" });
  res.end('{"message":"Starting up, please retry"}');
}

const server = http.createServer(fallback);

function log(msg: string) {
  const t = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${t} [express] ${msg}`);
}

// ── Bind port — synchronous, before any async work ────────────────────────────
server.listen({ port: PORT, host: "0.0.0.0" }, () => {
  log("health routes registered");
  log(`serving on port ${PORT}`);

  // Load full Express app AFTER port is bound.
  // setImmediate yields to the event loop so the listen callback returns first.
  // require("./app.cjs") is marked external in the startup esbuild config —
  // esbuild leaves it as a runtime require, resolving to dist/app.cjs.
  setImmediate(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("./app.cjs") as {
      initApp: (s: http.Server) => Promise<void>;
    };
    mod.initApp(server).catch((err: Error) => {
      console.error("[startup] app init failed:", err);
    });
  });
});
