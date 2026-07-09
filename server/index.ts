import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
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

// Health check — responds immediately, no DB or external calls
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

// Register API routes synchronously-compatible part first, then async setup
const port = parseInt(process.env.PORT || "5000", 10);

(async () => {
  await registerRoutes(httpServer, app);

  // Error middleware — must come after routes
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof URIError) {
      return res.status(400).json({ message: "Bad Request: Invalid URL encoding" });
    }

    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    try {
      serveStatic(app);
      log("static files registered");
    } catch (e) {
      console.error("serveStatic failed:", e);
      // Fallback: try serving from alternate dist path
      const altPath = path.resolve(process.cwd(), "dist", "public");
      if (fs.existsSync(altPath)) {
        app.use(express.static(altPath));
        app.use((_req, res) => {
          res.sendFile(path.resolve(altPath, "index.html"));
        });
        log("static files registered (fallback path)");
      }
    }
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // Listen AFTER all middleware/routes are registered so every route is
  // available from the first request — avoids transient 404/500 on healthcheck
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
