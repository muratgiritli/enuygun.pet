<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="tr">
      <head>
        <title>XML Site Haritası (Sitemap) — Enuygun Petshop</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #16325c; background: #f4f8fb; margin: 0; padding: 1.5rem 1rem; line-height: 1.5; }
          .box { max-width: 72rem; margin: 0 auto; background: #fff; border-radius: 0.875rem; border: 1px solid #d8e3ee; overflow: hidden; box-shadow: 0 6px 20px rgba(15,36,68,0.06); }
          .hdr { background: #0f2444; color: #fff; padding: 1.25rem 1.5rem; }
          .hdr h1 { margin: 0 0 0.35rem; font-size: 1.25rem; }
          .hdr p { margin: 0; font-size: 0.875rem; color: #cbd5e1; }
          .hdr a { color: #fbbf24; text-decoration: underline; }
          .tbl-wrap { width: 100%; overflow-x: auto; }
          table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
          th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e6eef6; }
          th { background: #eef4fa; font-weight: 700; color: #0f2444; white-space: nowrap; }
          tr:hover td { background: #f8fbff; }
          td a { color: #0e4d64; font-weight: 600; text-decoration: none; word-break: break-all; }
          td a:hover { text-decoration: underline; }
          .pill { display: inline-block; background: #e0f2fe; color: #083344; font-weight: 700; font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 999px; }
        </style>
      </head>
      <body>
        <div class="box">
          <div class="hdr">
            <h1>Enuygun Petshop — XML Site Haritası</h1>
            <p>Google, Bing, Yandex ve Yapay Zeka arama motorları için yapılandırılmış kanonik site haritası • Toplam <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> sayfa • <a href="https://www.enuygunpetshop.com/">Ana Sayfaya Dön</a></p>
          </div>
          <div class="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Kanonik Sayfa Adresi (URL)</th>
                  <th>Öncelik</th>
                  <th>Görsel</th>
                  <th>Son Güncelleme (ISO 8601)</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td><xsl:value-of select="position()"/></td>
                    <td>
                      <xsl:variable name="u"><xsl:value-of select="sitemap:loc"/></xsl:variable>
                      <a href="{$u}"><xsl:value-of select="sitemap:loc"/></a>
                    </td>
                    <td><span class="pill"><xsl:value-of select="sitemap:priority"/></span></td>
                    <td><xsl:value-of select="count(image:image)"/> adet</td>
                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
