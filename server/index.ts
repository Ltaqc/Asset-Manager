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

// ── Health check ─────────────────────────────────────────────────────────────
// Registered synchronously — responds 200 from the very first request.
// No DB, no email, no external deps.
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

// ── Production static files (synchronous, before async IIFE) ─────────────────
// Registering express.static here means GET / (and all asset requests) are
// served immediately, even before API routes are wired up.
// The SPA catch-all is added later (after API routes) inside the async IIFE.
const distPath = path.resolve(__dirname, "public");
if (process.env.NODE_ENV === "production") {
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    log("static middleware registered");
  } else {
    console.error(`[startup] dist/public not found at ${distPath} — frontend will not be served`);
  }
}

// ── Start listening synchronously ─────────────────────────────────────────────
// Server binds to the port BEFORE the async IIFE so healthcheck passes
// within the very first milliseconds of the process.
const port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
  log(`serving on port ${port}`);
});

// ── Async IIFE: API routes + SPA catch-all ────────────────────────────────────
(async () => {
  // registerRoutes is declared async but has no real awaits — resolves in < 1ms
  await registerRoutes(httpServer, app);

  // Error middleware — must be after all route handlers
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof URIError) {
      return res.status(400).json({ message: "Bad Request: Invalid URL encoding" });
    }

    // Express 5: unhandled routes call next(err) with no status → default to 404
    const status = err.status || err.statusCode || 404;
    const message = err.message || "Not Found";

    if (status >= 500) {
      console.error("Server error:", err);
    }

    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    // SPA catch-all: serve index.html for any non-asset, non-API path
    // Must be AFTER API routes so POST /api/bookings is not caught here
    if (fs.existsSync(distPath)) {
      app.use((_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
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
