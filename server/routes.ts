import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/image-proxy", async (req, res) => {
    const imageUrl = req.query.url as string;
    const width = parseInt(req.query.w as string) || 0;
    const quality = parseInt(req.query.q as string) || 80;

    if (!imageUrl) {
      return res.status(400).json({ message: "Missing url parameter" });
    }

    const allowedDomains = ["static.wixstatic.com"];
    try {
      const parsedUrl = new URL(imageUrl);
      if (!allowedDomains.some(d => parsedUrl.hostname.includes(d))) {
        return res.status(403).json({ message: "Domain not allowed" });
      }
    } catch {
      return res.status(400).json({ message: "Invalid URL" });
    }

    try {
      let fetchUrl = imageUrl;
      if (width > 0) {
        fetchUrl = `${imageUrl}/v1/fill/w_${width},q_${quality}/image.jpg`;
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        const fallbackResponse = await fetch(imageUrl);
        if (!fallbackResponse.ok) {
          return res.status(502).json({ message: "Failed to fetch image" });
        }
        res.set({
          "Content-Type": fallbackResponse.headers.get("content-type") || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Vary": "Accept",
        });
        const buffer = Buffer.from(await fallbackResponse.arrayBuffer());
        return res.send(buffer);
      }

      res.set({
        "Content-Type": response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Vary": "Accept",
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      return res.send(buffer);
    } catch (err) {
      return res.status(500).json({ message: "Image proxy error" });
    }
  });

  return httpServer;
}