import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  // ── Bundle 1: startup.cjs — tiny entry (~5 KB) ─────────────────────────────
  // Only http/path/fs. Binds port in < 5 ms so healthcheck never times out.
  // require("./app.cjs") is marked external so it stays as a runtime require
  // and is NOT bundled in — it resolves to dist/app.cjs at runtime.
  await esbuild({
    entryPoints: ["server/startup.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/startup.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: [...externals, "./app.cjs"],
    logLevel: "info",
  });

  // ── Bundle 2: app.cjs — full Express app (~1.2 MB) ─────────────────────────
  // Loaded by startup.cjs at runtime after port is already bound.
  await esbuild({
    entryPoints: ["server/app.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/app.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
