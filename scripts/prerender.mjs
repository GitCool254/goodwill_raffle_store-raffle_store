// scripts/prerender.mjs
//
// Prerenders every public route of the SPA into a fully-rendered
// static HTML file so Googlebot (and other crawlers) receive real
// content on the first request instead of an empty <div id="root"></div>.
//
// Runs automatically on Vercel after `vite build` via the `postbuild` script.
// It does NOT run on Termux (Playwright is unsupported on Android).

import { preview } from "vite";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sampleProducts, catalogItems } from "../src/data/products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---- Routes to prerender (keep in sync with App.jsx) ----
const staticRoutes = [
  "/",
  "/catalog",
  "/about",
  "/contact",
  "/address",
  "/donations",
  "/terms",
  "/privacy",
  "/tickets",
];

const allProducts = [...sampleProducts, ...catalogItems];
const productRoutes = allProducts.map((p) => `/${generateSlug(p.title)}`);

const uniqueRoutes = Array.from(
  new Set([...staticRoutes, ...productRoutes])
);

async function main() {
  console.log(`▶ Prerendering ${uniqueRoutes.length} routes…`);

  // Start a local Vite preview server against the freshly built `dist/`.
  const server = await preview({
    root: ROOT,
    preview: {
      port: 4173,
      strictPort: true,
      host: "127.0.0.1",
    },
  });

  const baseUrl = "http://127.0.0.1:4173";

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let succeeded = 0;
  let failed = 0;

  for (const route of uniqueRoutes) {
    const url = `${baseUrl}${route}`;
    try {
      // Try networkidle first — best signal that React has fully settled.
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
      } catch {
        // Fallback if the page never goes fully idle (e.g. long-polling).
        await page.goto(url, { waitUntil: "load", timeout: 20000 });
      }

      // Small extra beat so React commits final state before we snapshot.
      await page.waitForTimeout(400);

      const html = await page.content();

      const outDir =
        route === "/"
          ? DIST
          : path.join(DIST, route.replace(/^\//, ""));
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);

      console.log(`  ✅ ${route}`);
      succeeded++;
    } catch (err) {
      console.error(`  ❌ ${route} — ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  await server.close();

  console.log(
    `✅ Prerender complete — ${succeeded} succeeded, ${failed} failed`
  );

  // Non-zero exit if EVERY route failed (prevents silently deploying an
  // unprerendered build). Partial failures are tolerated so a single
  // misbehaving route cannot block a deployment.
  if (succeeded === 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Prerender fatal error:", err);
  process.exit(1);
});
