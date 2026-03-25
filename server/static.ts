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

  app.use(express.static(distPath));

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
    const meta = getPageMeta(req.path);
    const html = injectMeta(indexHtml, meta);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });
}
