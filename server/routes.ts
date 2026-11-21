import type { Express } from "express";
import { type Server } from "http";
import { NOT_FOUND_HTML } from "./static";
import { getTrafikHtml } from "./trafik-page";
import { TRAFIK_PASS, createTrafikToken, verifyTrafikToken, getTrafficStats, recordAction, exportTrafficCsv } from "./traffic";

export async function registerRoutes(
  _httpServer: Server,
  app: Express
): Promise<Server> {

  const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.enuygun.pet/</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg</image:loc>
      <image:title>ENUYGUN.PET Samsun Atakum Petshop Gross Market</image:title>
      <image:caption>Samsun Atakum petshop gross marketi mağaza görünümü</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://static.wixstatic.com/media/63853e_f5ae600f104c4dfcae521fe694ba017b~mv2.jpeg</image:loc>
      <image:title>Atakum Petshop Kedi ve Köpek Mama Reyonları</image:title>
      <image:caption>Orijinal kedi ve köpek mamaları, taze yem ve aksesuarlar</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg</image:loc>
      <image:title>Samsun Petshop Kedi Kumları ve Bakım Ürünleri</image:title>
      <image:caption>Bentonit ve pelet kedi kumları, taşıma çantaları ve tırmalamalar</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg</image:loc>
      <image:title>Samsun Atakum Köpek Malzemeleri ve Tasmaları</image:title>
      <image:caption>Köpek tasmaları, ödül kemikleri ve hijyen ürünleri</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg</image:loc>
      <image:title>Samsun Kuş Yemi ve Kafes Malzemeleri</image:title>
      <image:caption>Muhabbet kuşu ve papağan yemleri, kafesler ve takviyeler</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/atakum-petshop</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Atakum Petshop Enuygun.pet Evcil Hayvan Mağazası</image:title>
      <image:caption>Samsun Atakum evcil hayvan mağazası, kedi köpek mamaları ve pet aksesuarları</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/petshop</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Samsun Petshop Enuygun.pet Evcil Hayvan Mağazası</image:title>
      <image:caption>Samsun petshop mama ve evcil hayvan ürünleri</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/samsun-petshop</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Samsun Petshop Enuygun.pet</image:title>
      <image:caption>Samsun geneli petshop ve evcil hayvan ürünleri</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/pet-shop</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Pet Shop Ürünleri Enuygun.pet</image:title>
      <image:caption>Orijinal kedi köpek mamaları ve pet shop ürünleri</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/en-yakin-petshop</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>En Yakın Petshop Enuygun.pet</image:title>
      <image:caption>Samsun Atakum en yakın petshop evcil hayvan mağazası ve hızlı teslimat</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/samsun-atakum-petshop</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Samsun Atakum Petshop Enuygun.pet</image:title>
      <image:caption>Samsun Atakum petshop evcil hayvan gross mağazası ve hızlı teslimat</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/petshop-en-yakin</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Petshop En Yakın Enuygun.pet</image:title>
      <image:caption>Samsun Atakum petshop en yakın şubesi ve acil hızlı teslimat</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/petshop-samsun</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Petshop Samsun Enuygun.pet</image:title>
      <image:caption>Samsun petshop evcil hayvan malzemeleri ve hızlı teslimat</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/samsun-pet-shop</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Samsun Pet Shop Enuygun.pet</image:title>
      <image:caption>Samsun pet shop evcil hayvan ürünleri ve hızlı teslimat</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/samsun-petshop-atakum</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Samsun Petshop Atakum Enuygun.pet</image:title>
      <image:caption>Samsun Petshop Atakum gross marketi ve hızlı teslimat</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/en-uygun-pet</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>En Uygun Pet Enuygun.pet</image:title>
      <image:caption>En uygun pet ürünleri, kaliteli mamalar ve toptan fiyat avantajı</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/petshop-samsun-atakum</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Petshop Samsun Atakum Enuygun.pet</image:title>
      <image:caption>Samsun Atakum petshop gross marketi ve hızlı teslimat</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/samsun-ilkadim-petshop</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Samsun İlkadım Petshop Enuygun.pet</image:title>
      <image:caption>Samsun İlkadım petshop evcil hayvan ürünleri ve hızlı teslimat</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/petshop-atakum</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Petshop Atakum Enuygun.pet</image:title>
      <image:caption>Petshop Atakum evcil hayvan gross mağazası ve hızlı sipariş</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/en-uygun-petshop</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>En Uygun Petshop Gross Fiyatlar</image:title>
      <image:caption>En uygun petshop kaliteli mama kum ve evcil hayvan ürünleri</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/en-yakin-petshop-yol-tarifi</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>En Yakın Petshop Yol Tarifi Enuygun.pet</image:title>
      <image:caption>En yakın petshop yol tarifi ve mağazamıza kolay ulaşım rehberi</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/kedi-kopek-mamasi</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Kedi Köpek Maması Taze ve Orijinal Enuygun.pet</image:title>
      <image:caption>Kedi ve köpek maması çeşitleri süper premium markalar ve gross fiyatlar</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/en-yakin-pet</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>En Yakın Pet Enuygun.pet</image:title>
      <image:caption>En yakın pet mağazası kaliteli mama kum ve evcil hayvan ürünleri</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/pet-store-samsun</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Pet Store Samsun Enuygun.pet</image:title>
      <image:caption>Pet store Samsun kaliteli mama kum ve evcil hayvan ürünleri</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/petsop</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Petşop Enuygun.pet</image:title>
      <image:caption>Petşop kaliteli mama kum ve evcil hayvan ürünleri</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/en-yakin-kuscu</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>En Yakın Kuşçu Enuygun.pet</image:title>
      <image:caption>En yakın kuşçu kaliteli yem kafes ve kuş bakım ürünleri</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/kus-yemi-nerede-satilir</loc>
    <lastmod>2026-11-07</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://lh3.googleusercontent.com/aida-public/AB6AXuAgolxjJrymlNfBCOxASHAnwLnwSoZ4PUg5eTRnsc0qTdZGO-YEn3gTa6vyDuS6CC4yaw_JLQ_HVNhy9_lhCojFmIV-DR4eAvK9rSzUewVfJ-f2dZAEQJ1s43wF60Ub5GeDPL_HUzCtBhvEG7G-nDJli8P6ewqvsfkVofaj7eVhgUxSD4OnoCl_gBoL0H0iL_GgH7HMunTzpzZxNdHwcSbwH8WltvixfxRuT8bjsq0</image:loc>
      <image:title>Kuş Yemi Nerede Satılır Enuygun.pet</image:title>
      <image:caption>Taze muhabbet kuşu papağan ve kanarya yemleri güvenilir satış noktası</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/pet-shop-samsun</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/en-yakin-pet-shop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/pet-store</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/pershop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/enuygun-pet</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/petshop-samsun-ilkadim</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/acik-petshop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/atakum-pet-shop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/yakinlarda-petshop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/bana-en-yakin-petshop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/ilkadim-petshop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/enuygunpet</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/pet-store-atakum</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/acik-petshop-en-yakin</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/gross-petshop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/pet-store-near-me</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/samsun-atakum-pet-shop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/samsun-muhabbet-kusu</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/atakent-petshop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/cazip-pet-avm</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/atakum-petshop-samsun</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/uygun-petshop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/pet-market</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/pet-shop-en-yakin</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/hayvan-magazasi</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/pet-shop-atakum</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/pet-gross-market</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/samsun-pet</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/kedi-market</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/konumuma-en-yakin-petshop</loc>
    <lastmod>2026-11-14</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  // 0. 301 Permanent Redirects (Cannibalization Prevention)
  app.get(["/atakum-petshop", "/atakum-pet-shop"], (_req, res) => {
    return res.redirect(301, "/");
  });

  // 1. Primary Sitemap (and standard aliases)
  app.get(["/sitemap.xml", "/sitemap_index.xml", "/sitemap-home.xml", "/sitemap-main.xml"], (_req, res) => {
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(SITEMAP_XML);
  });

  // 2. All Old Sitemaps & RSS Return 404 Not Found
  app.get("/rss.xml", (_req, res) => {
    res.status(404);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("X-Robots-Tag", "noindex, follow");
    res.send(NOT_FOUND_HTML);
  });

  app.get("/sitemap-:name", (_req, res) => {
    res.status(404);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("X-Robots-Tag", "noindex, follow");
    res.send(NOT_FOUND_HTML);
  });

  // 3. Robots.txt
  app.get("/robots.txt", (_req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /trafik

# AI Search & Answer Engine Crawlers (Explicitly Allowed)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: OAI-SearchBot
Allow: /

Sitemap: https://www.enuygun.pet/sitemap.xml
`;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(robots);
  });

  // 3.1 AI Knowledge Manifests (llms.txt standard)
  app.get(["/llms.txt", "/.well-known/llms.txt"], (_req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.set("Cache-Control", "public, max-age=86400");
    const distPath = path.join(process.cwd(), "dist", "public", "llms.txt");
    const clientPath = path.join(process.cwd(), "client", "public", "llms.txt");
    if (fs.existsSync(distPath)) {
      return res.send(fs.readFileSync(distPath, "utf-8"));
    }
    if (fs.existsSync(clientPath)) {
      return res.send(fs.readFileSync(clientPath, "utf-8"));
    }
    res.send("# Enuygun.pet Samsun Atakum Petshop\\nhttps://www.enuygun.pet/\\n");
  });

  app.get("/llms-full.txt", (_req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.set("Cache-Control", "public, max-age=86400");
    const distPath = path.join(process.cwd(), "dist", "public", "llms-full.txt");
    const clientPath = path.join(process.cwd(), "client", "public", "llms-full.txt");
    if (fs.existsSync(distPath)) {
      return res.send(fs.readFileSync(distPath, "utf-8"));
    }
    if (fs.existsSync(clientPath)) {
      return res.send(fs.readFileSync(clientPath, "utf-8"));
    }
    res.send("# Enuygun.pet Samsun Atakum Petshop Full Knowledge\\nhttps://www.enuygun.pet/\\n");
  });

  // 4. Traffic Monitoring & Action tracking
  app.get("/trafik", (req, res) => {
    const cookie = req.headers.cookie || "";
    const token = cookie.split(";").map(c => c.trim()).find(c => c.startsWith("trafik_token="))?.split("=")[1];
    const isAuthed = token ? verifyTrafikToken(token) : false;
    res.send(getTrafikHtml(isAuthed));
  });

  app.post("/api/trafik/login", (req, res) => {
    const { password } = req.body || {};
    if (password === TRAFIK_PASS) {
      const token = createTrafikToken();
      res.setHeader("Set-Cookie", `trafik_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
      return res.json({ ok: true });
    }
    return res.status(401).json({ error: "Gecersiz sifre" });
  });

  app.get("/api/trafik/data", (req, res) => {
    const cookie = req.headers.cookie || "";
    const token = cookie.split(";").map(c => c.trim()).find(c => c.startsWith("trafik_token="))?.split("=")[1];
    if (!token || !verifyTrafikToken(token)) {
      return res.status(401).json({ error: "Yetkisiz" });
    }
    const days = parseInt(req.query.days as string) || 7;
    return res.json(getTrafficStats(days));
  });

  app.get("/api/trafik/export", (req, res) => {
    const cookie = req.headers.cookie || "";
    const token = cookie.split(";").map(c => c.trim()).find(c => c.startsWith("trafik_token="))?.split("=")[1];
    if (!token || !verifyTrafikToken(token)) {
      return res.status(401).send("Yetkisiz");
    }
    const days = parseInt(req.query.days as string) || 30;
    const csv = exportTrafficCsv(days);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=enuygunpet-trafik-${days}gun.csv`);
    return res.send(csv);
  });

  app.post("/api/trafik/action", async (req, res) => {
    try {
      const { action, label, path } = req.body || {};
      if (action) {
        await recordAction(action, label, path);
      }
      return res.json({ ok: true });
    } catch {
      return res.json({ ok: false });
    }
  });

  return _httpServer;
}
