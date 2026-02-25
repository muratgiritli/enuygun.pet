# EnuygunPet - Petshop Gross Market Landing Page

## Overview
Mobile-first landing page for EnuygunPet, a pet shop gross market located in Samsun, Atakum. The site is optimized for mobile visitors coming from Google search and Google Maps.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js (image proxy + static files)
- **Routing**: wouter
- **Animations**: framer-motion
- **Icons**: lucide-react + react-icons
- **PWA**: Service Worker + Web App Manifest

## Key Features
- Mobile-first responsive design (phone app-like experience)
- Full SEO optimization with structured data (JSON-LD)
- Schema.org markup for PetStore, LocalBusiness, FAQ, BreadcrumbList
- Open Graph and Twitter Card meta tags
- WhatsApp, Phone, and Google Maps quick actions
- Sticky bottom navigation bar for quick contact
- Image gallery with auto-slideshow
- FAQ section for AI/search visibility
- Product categories showcase
- Popular brands display
- Business hours, ratings, and contact info
- PWA support (installable as phone app)
- Image proxy with caching for optimized loading
- Service Worker for offline caching

## Business Info
- **Name**: EnuygunPet - Petshop Gross Market
- **Address**: Yeni Mahalle Atatürk 3. Kısım Bulvarı No:113, Atakum / SAMSUN
- **Phone**: 0542 211 49 44
- **Hours**: Every day 09:00 - 21:00
- **Instagram**: @enuygun.pet
- **Website**: https://www.enuygun.pet/

## File Structure
- `client/src/pages/home.tsx` - Main landing page component
- `client/src/App.tsx` - App router
- `client/index.html` - SEO meta tags, structured data, schema.org
- `client/public/manifest.json` - PWA manifest
- `client/public/sw.js` - Service Worker
- `client/public/icons/` - PWA app icons (192x192, 512x512)
- `client/public/images/` - Generated store/product images (fallback)
- `client/src/index.css` - Theme colors (green/amber pet theme)
- `server/routes.ts` - Image proxy endpoint with caching

## API Endpoints
- `GET /api/image-proxy?url=...&w=...&q=...` - Proxies and caches Wix images with optional width/quality params

## Theme
- Primary: Green (pet/nature theme) - hsl(160, 65%, 32%)
- Secondary: Amber/Orange (warmth/trust) - hsl(35, 85%, 52%)
- Font: Poppins (sans-serif)

## SEO Elements
- PetStore schema.org markup
- LocalBusiness schema.org markup
- FAQ Page schema.org markup
- BreadcrumbList schema.org markup
- Geo meta tags for local search
- Canonical URL
- Open Graph / Twitter Cards
- Semantic HTML5 sections with aria-labels

## PWA Features
- Web App Manifest with app name, icons, theme color
- Service Worker with cache-first strategy for images
- Stale-while-revalidate strategy for static assets
- Install prompt for Android (beforeinstallprompt)
- iOS install guide (Share > Add to Home Screen)
- Standalone display mode
