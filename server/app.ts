import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import * as http from "http";
import path from "path";
import fs from "fs";

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

  // ── Health + probe — registered before static so they are never intercepted ─
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

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

  // ── Static assets + frontend ───────────────────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    const indexPath = path.resolve(distPublic, "index.html");
    if (fs.existsSync(distPublic)) {
      // Log when GET / is served as index.html (before static intercepts it)
      app.get("/", (_req, res, next) => {
        console.log("[frontend] GET / -> index.html 200");
        next(); // hand off to express.static below
      });

      app.use(
        express.static(distPublic, {
          acceptRanges: false,
          etag: false,
          lastModified: false,
          setHeaders: (res, filePath) => {
            res.setHeader(
              "Cache-Control",
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            );
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
          },
        }),
      );
      log("static middleware registered");
    } else {
      console.error(`[startup] dist/public not found at ${distPublic}`);
    }

    // ── Hand off HTTP listener to Express NOW — before async registerRoutes ──
    // This is the critical fix: startup.cjs fallback served index.html for ALL
    // paths (including /assets/*.js → wrong content → blank page). By swapping
    // here, express.static takes over and serves assets correctly while
    // registerRoutes (DB connections etc.) is still initialising.
    httpServer.removeAllListeners("request");
    httpServer.on("request", app);
    log("express handler active");
  }

  // ── API routes — async; DB/storage/email init happens here ────────────────
  await registerRoutes(httpServer, app);

  // Error handler — must be after all route handlers
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
    // SPA catch-all: any non-API route not matched above → index.html
    // Registered after registerRoutes so /api/* is never intercepted
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
    // In dev the HTTP handler is set up by setupVite
    httpServer.removeAllListeners("request");
    httpServer.on("request", app);
  }
}
