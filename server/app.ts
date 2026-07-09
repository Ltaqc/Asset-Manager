import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import * as http from "http";
import path from "path";
import fs from "fs";

// ── Full Express app — compiled to dist/app.cjs (~1.2 MB) ────────────────────
// Loaded by dist/startup.cjs AFTER the port is bound.
// Also imported by server/index.ts for dev (tsx).

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const distPublic = path.resolve(process.cwd(), "dist", "public");

export async function initApp(httpServer: http.Server): Promise<void> {
  const app = express();

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(express.urlencoded({ extended: false }));

  // Request logger (API routes only)
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
        if (capturedJsonResponse)
          line += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        log(line);
      }
    });

    next();
  });

  if (process.env.NODE_ENV === "production") {
    if (fs.existsSync(distPublic)) {
      app.use(express.static(distPublic));
      log("static middleware registered");
    } else {
      console.error(`[startup] dist/public not found at ${distPublic}`);
    }
  }

  // Diagnostic probe — confirms request reaches backend (not caught by SPA fallback)
  app.get("/probe", (req, res) => {
    console.log("[probe] request reached backend", {
      time: new Date().toISOString(),
      ip: req.ip,
      host: req.headers.host,
      userAgent: req.headers["user-agent"],
    });
    res.status(200).json({
      ok: true,
      route: "/probe",
      time: new Date().toISOString(),
      host: req.headers.host,
    });
  });

  // API routes (DB, storage, email, Telegram — all heavy deps)
  await registerRoutes(httpServer, app);

  // Error handler — AFTER all route handlers
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof URIError) {
      return res
        .status(400)
        .json({ message: "Bad Request: Invalid URL encoding" });
    }
    const status = err.status || err.statusCode || 404;
    const message = err.message || "Not Found";
    if (status >= 500) console.error("Server error:", err);
    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    if (fs.existsSync(distPublic)) {
      app.use((_req, res) => {
        res.sendFile(path.resolve(distPublic, "index.html"));
      });
      log("SPA catch-all registered");
    }
  } else {
    // Dev: Vite middleware handles HMR and SPA routing
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // Hand off the HTTP server's request handling to Express.
  // Until this point, startup.ts served the minimal fallback handler.
  httpServer.removeAllListeners("request");
  httpServer.on("request", app);
}
