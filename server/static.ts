import express, { type Express } from "express";
import fs from "fs";
import path from "path";

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 Sayfa Bulunamadı | ENUYGUN.PET</title>
  <meta name="robots" content="noindex, follow">
  <link rel="icon" type="image/png" href="/favicon.png">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      text-align: center;
    }
    .card {
      max-width: 520px;
      width: 100%;
      background: #ffffff;
      padding: 48px 32px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
    }
    .badge {
      display: inline-block;
      background: #fee2e2;
      color: #dc2626;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 {
      font-size: 64px;
      color: #7c3aed;
      font-weight: 900;
      line-height: 1;
      margin-bottom: 12px;
    }
    h2 {
      font-size: 22px;
      color: #0f172a;
      font-weight: 700;
      margin-bottom: 12px;
    }
    p {
      font-size: 15px;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #7c3aed;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      transition: background 0.2s, transform 0.1s;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
    }
    .btn:hover { background: #6d28d9; }
    .btn:active { transform: scale(0.98); }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">404 Not Found</span>
    <h1>404</h1>
    <h2>Aradığınız Sayfa Bulunamadı</h2>
    <p>Ulaşmaya çalıştığınız adres silinmiş, adı değiştirilmiş veya geçici olarak kullanım dışı kalmış olabilir.</p>
    <a href="/" class="btn">Ana Sayfaya Git</a>
  </div>
</body>
</html>`;

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static assets (images, icons, favicon, etc.)
  app.use(express.static(distPath, { index: false }));

  const homeHtmlPath = path.resolve(distPath, "home.html");
  let homeHtml = "";
  try {
    homeHtml = fs.readFileSync(homeHtmlPath, "utf-8");
  } catch {
    homeHtml = "";
  }

  const indexHtmlPath = path.resolve(distPath, "index.html");
  let indexHtml = "";
  try {
    indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");
  } catch {
    indexHtml = "";
  }

  // Universal catch-all middleware for all unhandled requests
  app.use((req, res) => {
    const urlPath = req.originalUrl.split("?")[0];
    const cleanSlug = urlPath.replace(/^\/+|\/+$/g, "");
    if (cleanSlug) {
      const pageFile = path.resolve(distPath, `${cleanSlug}.html`);
      if (fs.existsSync(pageFile)) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
        return res.sendFile(pageFile);
      }
    }

    if (urlPath === "/" || urlPath === "") {
      const content = homeHtml || indexHtml;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
      return res.status(200).send(content);
    }

    // ALL OTHER NON-EXISTENT PAGES: HTTP 404 Not Found
    res.status(404);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("X-Robots-Tag", "noindex, follow");
    return res.send(NOT_FOUND_HTML);
  });
}

export { NOT_FOUND_HTML, NOT_FOUND_HTML as GONE_HTML };
