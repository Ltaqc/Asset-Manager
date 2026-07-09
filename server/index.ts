import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";
import path from "path";
import fs from "fs";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// ── Healthcheck — FIRST routes, sync, no deps, instant 200 ───────────────────
// Replit polls GET / immediately on startup. These must answer before anything
// else is initialized, so they are registered at module-level before listen().
app.get("/", (_req, res) => {
  res.status(200).send("OK");
});
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// ── Request logger ────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalJson = res.json;
  res.json = function (body, ...args) {
    capturedJsonResponse = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    const ms = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let line = `${req.method} ${reqPath} ${res.statusCode} in ${ms}ms`;
      if (capturedJsonResponse) line += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      log(line);
    }
  });

  next();
});

// ── Static files (production, sync, before listen) ───────────────────────────
// express.static serves assets and index.html for /. Registered synchronously
// so it is available from the very first request after listen().
// Avoid __dirname — not available in ESM (tsx dev). Use process.cwd() instead.
// In production: node runs from workspace root, dist/public is relative to cwd.
const distPublic = path.resolve(process.cwd(), "dist", "public");
if (process.env.NODE_ENV === "production") {
  if (fs.existsSync(distPublic)) {
    app.use(express.static(distPublic));
    log("static middleware registered");
  } else {
    console.error(`[startup] dist/public not found at ${distPublic}`);
  }
}

// ── Bind port synchronously ───────────────────────────────────────────────────
// Listen BEFORE the async IIFE. Healthcheck GET / hits the already-registered
// route above and returns 200 immediately, before any async work completes.
const port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
  log(`serving on port ${port}`);
});

// ── Async IIFE: API routes + SPA fallback ─────────────────────────────────────
(async () => {
  await registerRoutes(httpServer, app);

  // Error middleware — after all route handlers
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof URIError) {
      return res.status(400).json({ message: "Bad Request: Invalid URL encoding" });
    }
    const status = err.status || err.statusCode || 404;
    const message = err.message || "Not Found";
    if (status >= 500) console.error("Server error:", err);
    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    // SPA catch-all: AFTER API routes, so /api/* is not intercepted
    if (fs.existsSync(distPublic)) {
      app.use((_req, res) => {
        res.sendFile(path.resolve(distPublic, "index.html"));
      });
      log("SPA catch-all registered");
    }
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }
})().catch((err) => {
  console.error("[startup] async init failed:", err);
});
