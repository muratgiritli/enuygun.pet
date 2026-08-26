import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { getPageMeta, injectMeta } from "./prerender";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // index: false prevents express.static from auto-serving index.html
  // so our catch-all can inject meta tags for every page including "/"
  app.use(express.static(distPath, { index: false }));

  const indexHtmlPath = path.resolve(distPath, "index.html");
  let indexHtml = "";
  try {
    indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");
  } catch {
    indexHtml = "";
  }

  app.use("/{*path}", (req, res) => {
    if (!indexHtml) {
      return res.sendFile(indexHtmlPath);
    }
    const urlPath = req.originalUrl.split("?")[0];
    const meta = getPageMeta(urlPath);
    const html = injectMeta(indexHtml, meta, urlPath);
    if (meta.notFound) {
      res.status(404);
      res.setHeader("Cache-Control", "no-store");
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });
}
