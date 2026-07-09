import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Catch-all: serve index.html for every non-API, non-asset route.
  // Using app.use() without a path pattern so it matches "/" as well.
  // Express 5 wildcard patterns like "/{*path}" do NOT match bare "/".
  app.use((_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
