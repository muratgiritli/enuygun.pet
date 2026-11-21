import os
import re
import json
import html
import asyncio
import urllib.parse
from typing import List, Dict, Any, Optional
import httpx
from bs4 import BeautifulSoup
from utils import parse_price, score_and_filter_products, normalize_tr, strip_weight_tokens

MAX_CONCURRENT_BROWSERS = int(os.getenv("MAX_CONCURRENT_BROWSERS", "5"))
SITE_TIMEOUT_SECONDS = float(os.getenv("SITE_TIMEOUT_SECONDS", "25"))

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/131.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
}

PETLEBI_BRAND_SLUGS = {
    "royal canin": ["royal-canin/yavru-kedi-mamasi", "royal-canin/kedi-mamasi", "royal-canin", "royal-canin/kopek-mamasi"],
    "pro plan": ["pro-plan", "pro-plan/kedi-mamasi", "pro-plan/kopek-mamasi"],
    "proplan": ["pro-plan", "pro-plan/kedi-mamasi", "pro-plan/kopek-mamasi"],
    "purina": ["pro-plan", "purina-one", "felix", "friskies", "gourmet"],
    "n&d": ["nd", "nd/kedi-mamasi", "nd/kopek-mamasi"],
    "nd": ["nd", "nd/kedi-mamasi", "nd/kopek-mamasi"],
    "farmina": ["nd", "farmina-vet-life", "matisse"],
    "acana": ["acana", "acana/kedi-mamasi", "acana/kopek-mamasi"],
    "orijen": ["orijen"],
    "hills": ["hills", "hills/kedi-mamasi", "hills/kopek-mamasi"],
    "hill's": ["hills", "hills/kedi-mamasi", "hills/kopek-mamasi"],
    "brit care": ["brit-care", "brit-care/kedi-mamasi", "brit-care/kopek-mamasi"],
    "brit": ["brit-care", "brit"],
    "reflex": ["reflex"],
    "felicia": ["felicia"],
    "bonacibo": ["bonacibo"],
    "mystic": ["mystic"],
    "advance": ["advance"],
    "exclusion": ["exclusion"],
    "sanabelle": ["sanabelle"],
    "bozita": ["bozita"],
    "gimcat": ["gimcat"],
    "schesir": ["schesir"],
    "wanpy": ["wanpy"],
    "felix": ["felix"],
    "whiskas": ["whiskas"],
    "pedigree": ["pedigree"],
    "gourmet": ["gourmet"],
    "matisse": ["matisse"],
    "me-o": ["me-o"],
    "meo": ["me-o"],
    "naturea": ["naturea"],
    "taste of the wild": ["taste-of-the-wild"],
}


class BrowserManager:
    def __init__(self, max_pages: int = 5):
        self.semaphore = asyncio.Semaphore(max_pages)
        self._playwright = None
        self._browser = None
        self._lock = asyncio.Lock()

    async def get_browser(self):
        async with self._lock:
            if self._browser is None or not self._browser.is_connected():
                from playwright.async_api import async_playwright
                if self._playwright is None:
                    self._playwright = await async_playwright().start()
                self._browser = await self._playwright.chromium.launch(
                    headless=True,
                    args=[
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-blink-features=AutomationControlled",
                        "--disable-gpu",
                    ],
                )
            return self._browser

    async def close(self):
        async with self._lock:
            if self._browser:
                try:
                    await self._browser.close()
                except Exception:
                    pass
                self._browser = None
            if self._playwright:
                try:
                    await self._playwright.stop()
                except Exception:
                    pass
                self._playwright = None


browser_manager = BrowserManager(MAX_CONCURRENT_BROWSERS)

# Per-query cache for Akakce marketplace offers so multiple marketplace adapters share 1 fetch
_akakce_offers_cache: Dict[str, List[Dict[str, Any]]] = {}
_akakce_locks: Dict[str, asyncio.Lock] = {}


def abs_url(base_domain: str, href: str) -> str:
    if not href:
        return ""
    href = href.strip()
    if href.startswith("http://") or href.startswith("https://"):
        return href
    if href.startswith("//"):
        return "https:" + href
    if not href.startswith("/"):
        href = "/" + href
    return f"https://{base_domain}{href}"


def extract_jsonld_products(html_text: str, base_domain: str) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    scripts = re.findall(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html_text,
        flags=re.I | re.S,
    )
    for raw in scripts:
        try:
            data = json.loads(raw.strip())
        except Exception:
            continue
        stack = [data]
        while stack:
            curr = stack.pop()
            if isinstance(curr, list):
                stack.extend(curr)
            elif isinstance(curr, dict):
                t = str(curr.get("@type", "")).lower()
                if "product" in t and curr.get("name"):
                    offers = curr.get("offers")
                    if isinstance(offers, list) and offers:
                        offers = offers[0]
                    if isinstance(offers, dict):
                        price = parse_price(
                            offers.get("price")
                            or offers.get("lowPrice")
                            or offers.get("highPrice")
                        )
                        url = abs_url(base_domain, offers.get("url") or curr.get("url") or "")
                        avail = str(offers.get("availability", "")).lower()
                        in_stock = "outofstock" not in avail and "soldout" not in avail
                        if price and url:
                            items.append({
                                "title": curr.get("name"),
                                "price": price,
                                "url": url,
                                "in_stock": in_stock,
                            })
                for v in curr.values():
                    if isinstance(v, (dict, list)):
                        stack.append(v)
    return items


def _parse_tsoft_body(body: str, domain: str) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    matches = re.findall(r"PRODUCT_DATA\.push\(JSON\.parse\('(.+?)'\)\)", body)
    for m in matches:
        try:
            unescaped = m.encode("utf-8").decode("unicode_escape", errors="ignore")
            try:
                pdata = json.loads(unescaped)
            except Exception:
                pdata = json.loads(m.replace('\\"', '"').replace("\\/", "/"))
        except Exception:
            continue

        title = pdata.get("name") or ""
        price = (
            parse_price(pdata.get("total_sale_price"))
            or parse_price(pdata.get("total_price"))
            or parse_price(pdata.get("sale_price"))
        )
        raw_url = pdata.get("url") or ""
        p_url = abs_url(domain, raw_url)
        qty = pdata.get("quantity")
        avail = pdata.get("available", True)
        in_stock = bool(avail) and (qty is None or float(qty) > 0)

        if title and price and p_url:
            items.append({
                "title": title,
                "price": price,
                "url": p_url,
                "in_stock": in_stock,
            })

    if items:
        return items

    soup = BeautifulSoup(body, "html.parser")
    for card in soup.select(".product-detail-card, .product-item, .folder-product-list > div"):
        a_tag = card.select_one("a.product-title, a[title], a[href]")
        if not a_tag:
            continue
        title = a_tag.get("title") or a_tag.get_text(strip=True)
        href = a_tag.get("href") or ""
        price_el = card.select_one(".current-price, .product-price, .sale-price, [class*='price']")
        price = parse_price(price_el.get_text(" ", strip=True) if price_el else "")
        out_el = card.select_one(".out-of-stock, .tukendi")
        in_stock = out_el is None and "tükendi" not in card.get_text(" ", strip=True).lower()
        if title and price and href:
            items.append({
                "title": title,
                "price": price,
                "url": abs_url(domain, href),
                "in_stock": in_stock,
            })
    return items


# ============================================================================
# 1. T-SOFT ADAPTER (mamatoptancisi, mamaciteyze, mukaspazarlama, mamamax, evinemama, kolaymama)
# ============================================================================
async def scrape_tsoft(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    domain = site["domain"]
    items: List[Dict[str, Any]] = []

    core_q = strip_weight_tokens(query)
    if core_q and core_q.lower() != query.lower() and len(core_q.split()) >= 2:
        queries = [core_q, query]
    else:
        queries = [query]

    for q_try in queries:
        q_enc = urllib.parse.quote_plus(q_try)
        url = site["search_url"].format(query=q_enc)
        resp = await client.get(url, headers=DEFAULT_HEADERS, follow_redirects=True)
        if resp.status_code < 400:
            parsed = _parse_tsoft_body(resp.text, domain)
            items.extend(parsed)
            if items:
                break
    return items


# ============================================================================
# 2. TICIMAX ADAPTER (ikizleryem, cabukmama, zoo, indirgetir, kuzeypazarlama, expressmama)
# ============================================================================
async def scrape_ticimax(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    q_enc = urllib.parse.quote_plus(query)
    url = site["search_url"].format(query=q_enc)
    resp = await client.get(url, headers=DEFAULT_HEADERS, follow_redirects=True)
    if resp.status_code >= 400:
        raise RuntimeError(f"HTTP {resp.status_code}")
    body = resp.text
    domain = site["domain"]
    items: List[Dict[str, Any]] = []

    soup = BeautifulSoup(body, "html.parser")
    cards = soup.select(".ItemOrj, .productItem")
    for card in cards:
        raw_html = str(card)
        if "{{#" in raw_html or "{{>" in raw_html:
            continue

        name_a = card.select_one(".productName a, a.detailLink, a.detailUrl[title]")
        if not name_a:
            continue
        title = name_a.get("title") or name_a.get_text(strip=True)
        href = name_a.get("href") or ""
        if not href or "{{" in href or "{{" in title:
            continue

        price = None
        for sel in (
            ".discountPriceSpan",
            ".indirimliFiyat .spanFiyat",
            ".regularPriceSpan",
            ".satisFiyati .spanFiyat",
            ".spanFiyat",
            ".productPrice",
        ):
            el = card.select_one(sel)
            if el:
                price = parse_price(el.get_text(" ", strip=True))
                if price:
                    break

        card_text_low = card.get_text(" ", strip=True).lower()
        in_stock = not (
            "tükendi" in card_text_low
            or "stokta yok" in card_text_low
            or "haber ver" in card_text_low
            or card.select_one(".tukendi, .outOfStock, .stoktaYok") is not None
        )

        if title and price and href:
            items.append({
                "title": title,
                "price": price,
                "url": abs_url(domain, href),
                "in_stock": in_stock,
            })

    return items


# ============================================================================
# 3. SHOPIFY ADAPTER (markamama.com.tr & generic Shopify)
# ============================================================================
async def scrape_shopify(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    domain = site["domain"]
    items: List[Dict[str, Any]] = []

    core_q = strip_weight_tokens(query)
    queries = [query]
    if core_q and core_q.lower() != query.lower():
        queries.append(core_q)

    for q_try in queries:
        q_enc = urllib.parse.quote_plus(q_try)
        url = site["search_url"].format(query=q_enc)
        resp = await client.get(url, headers=DEFAULT_HEADERS, follow_redirects=True)
        if resp.status_code == 200:
            try:
                data = resp.json()
                prods = data.get("resources", {}).get("results", {}).get("products", [])
                for p in prods:
                    title = p.get("title") or ""
                    price = parse_price(p.get("price") or p.get("price_min"))
                    p_url = abs_url(domain, (p.get("url") or "").split("?")[0])
                    in_stock = bool(p.get("available", True))
                    if title and price and p_url:
                        items.append({
                            "title": title,
                            "price": price,
                            "url": p_url,
                            "in_stock": in_stock,
                        })
            except Exception:
                pass
        if items:
            break
    return items


# ============================================================================
# 4. IKAS / PETGROSS ADAPTER (petgross.com.tr)
# ============================================================================
async def scrape_ikas_petgross(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    bot_id = site.get("bot_id", "3bd46c4f-5f93-4615-a02f-fcee00d5440c")
    headers = {
        **DEFAULT_HEADERS,
        "Origin": "https://petgross.com.tr",
        "Referer": "https://petgross.com.tr/",
        "Accept": "application/json",
    }
    items: List[Dict[str, Any]] = []
    core_q = strip_weight_tokens(query)
    queries = [query]
    if core_q and core_q.lower() != query.lower():
        queries.append(core_q)

    for q_try in queries:
        q_enc = urllib.parse.quote(q_try)
        api_url = f"https://backend-production-cc4b.up.railway.app/ai-search/oneri/{bot_id}?q={q_enc}"
        try:
            resp = await client.get(api_url, headers=headers, follow_redirects=True)
            if resp.status_code == 200:
                data = resp.json()
                for u in data.get("urunler", []):
                    title = u.get("ad") or ""
                    price = parse_price(u.get("fiyat"))
                    p_url = abs_url(site["domain"], u.get("adres") or "")
                    if title and price and p_url:
                        items.append({
                            "title": title,
                            "price": price,
                            "url": p_url,
                            "in_stock": True,
                        })
        except Exception:
            pass
        if items:
            break
    return items


# ============================================================================
# 5. TEARTRADE ADAPTER (teartrade.com)
# ============================================================================
async def scrape_teartrade(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    domain = site["domain"]
    items: List[Dict[str, Any]] = []

    core_q = strip_weight_tokens(query)
    if core_q and core_q.lower() != query.lower() and len(core_q.split()) >= 2:
        queries = [core_q, query]
    else:
        queries = [query]

    for q_try in queries:
        q_enc = urllib.parse.quote_plus(q_try)
        url = site["search_url"].format(query=q_enc)
        resp = await client.get(url, headers=DEFAULT_HEADERS, follow_redirects=True)
        if resp.status_code >= 400:
            continue
        soup = BeautifulSoup(resp.text, "html.parser")

        for card in soup.select("[data-item-name]"):
            title = card.get("data-item-name") or ""
            price = parse_price(card.get("data-item-price"))
            a_el = card if card.name == "a" else card.select_one("a[href]")
            href = (a_el.get("href") if a_el else "") or ""
            txt_low = card.get_text(" ", strip=True).lower()
            in_stock = "tükendi" not in txt_low and "stokta yok" not in txt_low
            if title and price and href:
                items.append({
                    "title": title,
                    "price": price,
                    "url": abs_url(domain, href),
                    "in_stock": in_stock,
                })

        for card in soup.select("a.search-product-item"):
            href = card.get("href") or ""
            name_el = card.select_one(".search-product-name")
            price_el = card.select_one(".search-product-price")
            title = name_el.get_text(" ", strip=True) if name_el else ""
            price = parse_price(price_el.get_text(" ", strip=True) if price_el else "")
            if title and price and href:
                items.append({
                    "title": title,
                    "price": price,
                    "url": abs_url(domain, href),
                    "in_stock": True,
                })

        if items:
            break
    return items


# ============================================================================
# 6. YEMGROSS ADAPTER (yemgross.com.tr)
# ============================================================================
async def scrape_yemgross(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    domain = site["domain"]
    items: List[Dict[str, Any]] = []

    core_q = strip_weight_tokens(query)
    queries = [query]
    if core_q and core_q.lower() != query.lower():
        queries.append(core_q)
    if len(query.split()) > 2:
        queries.append(" ".join(query.split()[:2]))

    for q_try in queries:
        q_enc = urllib.parse.quote_plus(q_try)
        url = site["search_url"].format(query=q_enc)
        resp = await client.get(url, headers=DEFAULT_HEADERS, follow_redirects=True)
        if resp.status_code >= 400:
            continue
        soup = BeautifulSoup(resp.text, "html.parser")
        for name_div in soup.select(".pbl-product-card-item-name"):
            a_tag = name_div.select_one("a[href]")
            if not a_tag:
                continue
            title = a_tag.get_text(" ", strip=True)
            href = a_tag.get("href") or ""
            parent = name_div.parent
            price_el = parent.select_one(".product-price") if parent else None
            price = parse_price(price_el.get_text(" ", strip=True) if price_el else "")
            parent_txt = parent.get_text(" ", strip=True).lower() if parent else ""
            in_stock = "tükendi" not in parent_txt and "stokta yok" not in parent_txt
            if title and price and href:
                items.append({
                    "title": title,
                    "price": price,
                    "url": abs_url(domain, href),
                    "in_stock": in_stock,
                })
        if items:
            break
    return items


# ============================================================================
# 7. TURGUTYEM ADAPTER (turgutyem.com.tr)
# ============================================================================
async def scrape_turgutyem(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    domain = site["domain"]
    items: List[Dict[str, Any]] = []

    core_q = strip_weight_tokens(query)
    queries_to_try = [query]
    if core_q and core_q.lower() != query.lower():
        queries_to_try.append(core_q)
    words = [w for w in query.split() if len(w) >= 2]
    if len(words) > 1:
        queries_to_try.append(words[0])

    for q_try in queries_to_try:
        u = f"https://turgutyem.com.tr/api/products?search={urllib.parse.quote(q_try)}&limit=50"
        resp = await client.get(u, headers={**DEFAULT_HEADERS, "Accept": "application/json"}, follow_redirects=True)
        if resp.status_code == 200:
            data = resp.json()
            prods = data.get("products", [])
            for p in prods:
                title = p.get("name") or ""
                price = parse_price(p.get("price"))
                slug = p.get("slug") or p.get("id")
                p_url = f"https://{domain}/urun/{slug}" if slug else ""
                stock = p.get("stock")
                in_stock = (stock is None or int(stock) > 0) and bool(p.get("isActive", True))
                if title and price and p_url:
                    items.append({
                        "title": title,
                        "price": price,
                        "url": p_url,
                        "in_stock": in_stock,
                    })
            if items:
                break
    return items


# ============================================================================
# 8. AKAKÇE ADAPTER (akakce.com) + SHARED MARKETPLACE OFFER RESOLVER
# ============================================================================
async def scrape_akakce(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    q_enc = urllib.parse.quote_plus(query)
    url = site["search_url"].format(query=q_enc)
    resp = await client.get(url, headers=DEFAULT_HEADERS, follow_redirects=True)
    if resp.status_code >= 400:
        raise RuntimeError(f"HTTP {resp.status_code}")
    soup = BeautifulSoup(resp.text, "html.parser")
    domain = site["domain"]
    items: List[Dict[str, Any]] = []

    for li in soup.select("li[data-pr]"):
        a_tag = li.select_one("a.iC, a[href]")
        h3 = li.select_one("h3.pn_v8, h3")
        pt = li.select_one("span.pt_v9, span.pt_v8")
        if not a_tag or not pt:
            continue
        title = (h3.get_text(" ", strip=True) if h3 else "") or a_tag.get("title") or ""
        href = a_tag.get("href") or ""
        # Remove child spans (like "+254 FİYAT") while keeping the price text & <i> decimals
        for child_sp in pt.find_all("span"):
            child_sp.decompose()
        price = parse_price(pt.get_text("", strip=True))
        if title and price and href:
            items.append({
                "title": title,
                "price": price,
                "url": abs_url(domain, href),
                "in_stock": True,
            })
    return items


async def get_akakce_marketplace_offers(
    client: httpx.AsyncClient, query: str
) -> List[Dict[str, Any]]:
    """
    Fetches the top matching Akakçe product detail pages once per query and extracts
    all direct marketplace offers (Trendyol, PttAVM, N11, Hepsiburada, Amazon, Idefix, etc.)
    from the schema.org AggregateOffer JSON-LD & #PL seller list.
    """
    q_key = normalize_tr(query)
    if q_key not in _akakce_locks:
        _akakce_locks[q_key] = asyncio.Lock()

    async with _akakce_locks[q_key]:
        if q_key in _akakce_offers_cache:
            return _akakce_offers_cache[q_key]

        offers_out: List[Dict[str, Any]] = []
        try:
            akakce_site = {
                "domain": "www.akakce.com",
                "search_url": "https://www.akakce.com/arama/?q={query}",
            }
            raw_akakce = await scrape_akakce(client, akakce_site, query)
            top_matches = score_and_filter_products(query, raw_akakce, site_name="akakce.com", top_n=2)

            for match in top_matches:
                p_url = match["url"]
                resp = await client.get(p_url, headers=DEFAULT_HEADERS, follow_redirects=True, timeout=8.0)
                if resp.status_code != 200:
                    continue
                body = resp.text

                # 1. Extract from JSON-LD AggregateOffer
                for s in re.findall(
                    r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
                    body,
                    flags=re.I | re.S,
                ):
                    try:
                        d = json.loads(s.strip())
                        if d.get("@type") == "Product":
                            prod_name = d.get("name") or match["title"]
                            for off in d.get("offers", {}).get("offers", []):
                                o_price = parse_price(off.get("price"))
                                o_url = off.get("url") or ""
                                seller_name = (off.get("seller", {}) or {}).get("name", "")
                                avail = str(off.get("availability", "")).lower()
                                in_stock = "instock" in avail or "outofstock" not in avail
                                if o_price and o_url:
                                    offers_out.append({
                                        "title": prod_name,
                                        "price": o_price,
                                        "url": o_url,
                                        "seller": seller_name.lower(),
                                        "in_stock": in_stock,
                                    })
                    except Exception:
                        continue

                # 2. Also parse #PL list items for any additional sellers on the page
                soup = BeautifulSoup(body, "html.parser")
                for li in soup.select("#PL li"):
                    pt = li.select_one(".pt_v8, .pt_v9")
                    pn = li.select_one(".pn_v8")
                    img = li.select_one(".v_v8 img[alt]")
                    if not pt or not img:
                        continue
                    seller_alt = (img.get("alt") or "").lower()
                    title = (pn.get_text(" ", strip=True) if pn else "") or match["title"]
                    price = parse_price(pt.get_text("", strip=True))
                    if title and price and seller_alt:
                        offers_out.append({
                            "title": title,
                            "price": price,
                            "url": p_url,
                            "seller": seller_alt,
                            "in_stock": True,
                        })
        except Exception:
            pass

        _akakce_offers_cache[q_key] = offers_out
        if len(_akakce_offers_cache) > 50:
            _akakce_offers_cache.clear()
        return offers_out


# ============================================================================
# 9. İDEFİX ADAPTER (idefix.com - Direct v6 JSON Search API)
# ============================================================================
async def scrape_idefix(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    domain = site["domain"]
    items: List[Dict[str, Any]] = []
    headers = {
        **DEFAULT_HEADERS,
        "Origin": "https://www.idefix.com",
        "Referer": "https://www.idefix.com/",
        "Accept": "application/json",
    }

    q_enc = urllib.parse.quote(query)
    api_url = f"https://search.idefix.com/api/v6/search?query={q_enc}"
    resp = await client.get(api_url, headers=headers, follow_redirects=True)
    if resp.status_code == 200:
        data = resp.json()
        sr_items = data.get("searchResult", {}).get("items", [])
        for group in sr_items:
            for v in group.get("variants", []):
                title = v.get("name") or v.get("originalName") or ""
                price = parse_price(v.get("discountedSalesPrice") or v.get("price"))
                handle = v.get("handleUrl") or ""
                p_url = abs_url(domain, handle) if handle else f"https://{domain}/arama?q={q_enc}"
                stock = v.get("stock")
                in_stock = bool(v.get("isSalable", True)) and (stock is None or int(stock) > 0)
                if title and price and p_url:
                    items.append({
                        "title": title,
                        "price": price,
                        "url": p_url,
                        "in_stock": in_stock,
                    })
    return items


# ============================================================================
# 10. AMAZON ADAPTER (amazon.com.tr - Playwright + Akakçe fallback)
# ============================================================================
async def scrape_amazon(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    q_enc = urllib.parse.quote_plus(query)
    url = site["search_url"].format(query=q_enc)
    domain = site["domain"]
    items: List[Dict[str, Any]] = []

    try:
        async with browser_manager.semaphore:
            browser = await browser_manager.get_browser()
            context = await browser.new_context(
                user_agent=DEFAULT_HEADERS["User-Agent"],
                locale="tr-TR",
                viewport={"width": 1366, "height": 768},
                extra_http_headers={"Accept-Language": "tr-TR,tr;q=0.9"},
            )
            try:
                page = await context.new_page()
                await page.add_init_script(
                    "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
                )
                await page.route(
                    "**/*",
                    lambda route: route.abort()
                    if route.request.resource_type in ("image", "media", "font")
                    else route.continue_(),
                )
                await page.goto(url, wait_until="domcontentloaded", timeout=15000)
                await page.wait_for_timeout(1200)
                content = await page.content()
                soup = BeautifulSoup(content, "html.parser")
                for card in soup.select('div[data-component-type="s-search-result"]'):
                    h2 = card.select_one("h2")
                    a_tag = card.select_one("a.a-link-normal[href*='/dp/'], h2 a[href]")
                    pr_off = card.select_one(".a-price .a-offscreen")
                    pr_whole = card.select_one(".a-price-whole")
                    pr_frac = card.select_one(".a-price-fraction")

                    title = h2.get_text(" ", strip=True) if h2 else ""
                    href = a_tag.get("href") if a_tag else ""
                    if pr_off:
                        price = parse_price(pr_off.get_text(strip=True))
                    elif pr_whole:
                        w_txt = pr_whole.get_text(strip=True).rstrip(",.")
                        f_txt = pr_frac.get_text(strip=True) if pr_frac else "00"
                        price = parse_price(f"{w_txt},{f_txt}")
                    else:
                        price = None

                    if title and price and href:
                        clean_href = href.split("/ref=")[0]
                        items.append({
                            "title": title,
                            "price": price,
                            "url": abs_url(domain, clean_href),
                            "in_stock": True,
                        })
            finally:
                await context.close()
    except Exception:
        pass

    if items:
        return items

    # Fallback: check Akakce offers for Amazon
    ak_offers = await get_akakce_marketplace_offers(client, query)
    for o in ak_offers:
        if "amazon.com.tr" in o["url"] or "amazon" in o["seller"]:
            items.append(o)
    return items


# ============================================================================
# 11. MİGROS PET ADAPTER (migros.com.tr/pet)
# ============================================================================
async def scrape_migros(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    q_enc = urllib.parse.quote_plus(query)
    url = site["search_url"].format(query=q_enc)
    headers = {
        **DEFAULT_HEADERS,
        "Accept": "application/json",
        "X-PWA": "true",
        "Referer": "https://www.migros.com.tr/pet",
    }
    resp = await client.get(url, headers=headers, follow_redirects=True)
    if resp.status_code >= 400:
        raise RuntimeError(f"HTTP {resp.status_code}")
    data = resp.json()
    prods = data.get("data", {}).get("searchInfo", {}).get("storeProductInfos", [])
    items: List[Dict[str, Any]] = []
    for p in prods:
        title = p.get("name") or ""
        shown_price = p.get("shownPrice") or p.get("regularPrice")
        price = round(float(shown_price) / 100.0, 2) if shown_price else None
        pretty = p.get("prettyName") or ""
        p_url = f"https://www.migros.com.tr/{pretty}" if pretty else "https://www.migros.com.tr/pet"
        status = p.get("status", "IN_SALE")
        in_stock = status == "IN_SALE"
        if title and price and p_url:
            items.append({
                "title": title,
                "price": price,
                "url": p_url,
                "in_stock": in_stock,
            })
    return items


# ============================================================================
# 12. PETLEBİ ADAPTER (petlebi.com - httpx brand/category + Playwright fallback)
# ============================================================================
def _parse_petlebi_html(body: str) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    soup = BeautifulSoup(body, "html.parser")
    for a_tag in soup.select("a[data-gtm-product]"):
        raw_gtm = a_tag.get("data-gtm-product") or ""
        href = a_tag.get("href") or ""
        try:
            gdata = json.loads(html.unescape(raw_gtm))
            title = gdata.get("name") or a_tag.get("title") or a_tag.get_text(" ", strip=True)
            price = parse_price(gdata.get("price"))
            dim2 = str(gdata.get("dimension2", "In Stock")).lower()
            in_stock = "out" not in dim2 and "yok" not in dim2
            if title and price and href:
                items.append({
                    "title": title,
                    "price": price,
                    "url": abs_url("www.petlebi.com", href),
                    "in_stock": in_stock,
                })
        except Exception:
            continue
    return items


async def scrape_petlebi(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    q_norm = normalize_tr(query)
    items: List[Dict[str, Any]] = []

    candidate_slugs: List[str] = []
    for brand_key, slugs in PETLEBI_BRAND_SLUGS.items():
        if brand_key in q_norm:
            base = slugs[0].split("/")[0]
            if any(w in q_norm for w in ["kitten", "yavru kedi"]):
                candidate_slugs.append(f"{base}/yavru-kedi-mamasi")
            if "kopek" in q_norm:
                candidate_slugs.append(f"{base}/kopek-mamasi")
            elif "kedi" in q_norm:
                candidate_slugs.append(f"{base}/kedi-mamasi")
            candidate_slugs.append(base)
            break

    words = q_norm.split()
    if not candidate_slugs and words:
        if len(words) >= 2:
            candidate_slugs.append(f"{words[0]}-{words[1]}")
        candidate_slugs.append(words[0])

    for slug in candidate_slugs[:2]:
        for page_suffix in ["", "?page=2"]:
            try:
                u = f"https://www.petlebi.com/{slug}{page_suffix}"
                resp = await client.get(u, headers=DEFAULT_HEADERS, follow_redirects=True)
                if resp.status_code == 200:
                    parsed = _parse_petlebi_html(resp.text)
                    items.extend(parsed)
                    if len(parsed) < 20:
                        break
            except Exception:
                break
        if items:
            break

    if items:
        return items

    return await scrape_with_playwright(site, query)


# ============================================================================
# 13. GENERIC SHARED ADAPTERS (Ideasoft, WooCommerce)
# ============================================================================
async def scrape_ideasoft(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    q_enc = urllib.parse.quote_plus(query)
    url = site["search_url"].format(query=q_enc)
    resp = await client.get(url, headers=DEFAULT_HEADERS, follow_redirects=True)
    if resp.status_code >= 400:
        raise RuntimeError(f"HTTP {resp.status_code}")
    soup = BeautifulSoup(resp.text, "html.parser")
    domain = site["domain"]
    items = []
    for card in soup.select(".showcase, .product-item, [data-selector='product-item']"):
        a_tag = card.select_one(".showcase-title a, .product-title a, a[title]")
        price_el = card.select_one(".showcase-price-new, .price-new, .current-price")
        if a_tag and price_el:
            items.append({
                "title": a_tag.get("title") or a_tag.get_text(" ", strip=True),
                "price": parse_price(price_el.get_text(" ", strip=True)),
                "url": abs_url(domain, a_tag.get("href") or ""),
                "in_stock": "stokta yok" not in card.get_text(" ", strip=True).lower(),
            })
    return items


async def scrape_woocommerce(client: httpx.AsyncClient, site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    q_enc = urllib.parse.quote_plus(query)
    url = site["search_url"].format(query=q_enc)
    resp = await client.get(url, headers=DEFAULT_HEADERS, follow_redirects=True)
    if resp.status_code >= 400:
        raise RuntimeError(f"HTTP {resp.status_code}")
    soup = BeautifulSoup(resp.text, "html.parser")
    domain = site["domain"]
    items = []
    for li in soup.select("li.product, .product-small, .product-grid-item"):
        a_tag = li.select_one("a.woocommerce-LoopProduct-link, .product-title a, a[href]")
        title_el = li.select_one(".woocommerce-loop-product__title, .product-title, h2, h3")
        price_el = li.select_one(".price ins .amount, .price .amount")
        if a_tag and title_el and price_el:
            items.append({
                "title": title_el.get_text(" ", strip=True),
                "price": parse_price(price_el.get_text(" ", strip=True)),
                "url": abs_url(domain, a_tag.get("href") or ""),
                "in_stock": "outofstock" not in " ".join(li.get("class", [])).lower(),
            })
    return items


# ============================================================================
# 14. PLAYWRIGHT + MARKETPLACE HYBRID ADAPTER
#     (trendyol, hepsiburada, n11, pttavm, cimri, a101)
# ============================================================================
PLAYWRIGHT_DOM_EXTRACTOR_JS = """
() => {
    const results = [];

    function cleanText(s) {
        return (s || '').replace(/\\s+/g, ' ').trim();
    }

    document.querySelectorAll('script[type="application/ld+json"]').forEach(sc => {
        try {
            const d = JSON.parse(sc.textContent);
            const stack = [d];
            while (stack.length) {
                const curr = stack.pop();
                if (Array.isArray(curr)) {
                    stack.push(...curr);
                } else if (curr && typeof curr === 'object') {
                    const t = String(curr['@type'] || '').toLowerCase();
                    if (t.includes('product') && curr.name) {
                        let off = curr.offers;
                        if (Array.isArray(off)) off = off[0];
                        if (off && (off.price || off.lowPrice)) {
                            results.push({
                                title: cleanText(curr.name),
                                price: String(off.price || off.lowPrice),
                                url: off.url || curr.url || window.location.href,
                                in_stock: !String(off.availability || '').toLowerCase().includes('outofstock')
                            });
                        }
                    }
                    Object.values(curr).forEach(v => {
                        if (v && typeof v === 'object') stack.push(v);
                    });
                }
            }
        } catch (e) {}
    });

    const cardSelectors = [
        '.p-card-wrppr',
        'li[class*="productListContent"]',
        '[data-test-id="product-card-item"]',
        'div[data-component-type="s-search-result"]',
        'li.column',
        '.columnContent',
        'div[class*="product-list-box"]',
        'a[href*="-p-"]',
        'article',
        'div[id^="product-item"]',
        '.desktop-product-card',
        '[data-gtm-product]'
    ];

    const seen = new Set();
    const cards = document.querySelectorAll(cardSelectors.join(', '));

    cards.forEach(card => {
        try {
            if (card.hasAttribute('data-gtm-product')) {
                const g = JSON.parse(card.getAttribute('data-gtm-product'));
                if (g && g.name && g.price) {
                    results.push({
                        title: g.name,
                        price: String(g.price),
                        url: card.href || '',
                        in_stock: !String(g.dimension2 || '').toLowerCase().includes('out')
                    });
                    return;
                }
            }

            const aTag = card.tagName === 'A' ? card : card.querySelector('a[href]');
            if (!aTag || !aTag.href) return;
            const href = aTag.href;
            if (seen.has(href)) return;

            let title = '';
            const titleEl = card.querySelector(
                'h2, h3, h4, .prdct-desc-cntnr-name, .product-name, .productName, ' +
                '[data-test-id="product-card-name"], .a-text-normal, [class*="title"], [class*="name"]'
            );
            const brandEl = card.querySelector('.prdct-desc-cntnr-ttl, [class*="brand"]');
            if (titleEl) {
                title = cleanText(titleEl.textContent);
                if (brandEl && !title.toLowerCase().includes(cleanText(brandEl.textContent).toLowerCase())) {
                    title = cleanText(brandEl.textContent) + ' ' + title;
                }
            } else {
                title = cleanText(aTag.getAttribute('title') || aTag.textContent);
            }

            const fullText = cleanText(card.textContent);
            const priceMatches = fullText.match(/(\\d{1,3}(?:\\.\\d{3})*(?:,\\d{1,2})?|\\d+(?:,\\d{1,2})?)\\s*(?:TL|₺)|(?:TL|₺)\\s*(\\d{1,3}(?:\\.\\d{3})*(?:,\\d{1,2})?)/i);
            let priceStr = '';
            if (priceMatches) {
                priceStr = priceMatches[1] || priceMatches[2] || priceMatches[0];
            } else {
                const priceEl = card.querySelector('.prc-box-dscntd, .a-price .a-offscreen, .newPrice, [data-test-id="price-current-price"], [class*="price"]');
                if (priceEl) priceStr = cleanText(priceEl.textContent);
            }

            if (title && title.length > 5 && priceStr) {
                seen.add(href);
                const low = fullText.toLowerCase();
                results.push({
                    title: title,
                    price: priceStr,
                    url: href,
                    in_stock: !(low.includes('tükendi') || low.includes('stokta yok'))
                });
            }
        } catch (e) {}
    });

    return results;
}
"""


async def scrape_with_playwright(site: Dict[str, Any], query: str) -> List[Dict[str, Any]]:
    q_enc = urllib.parse.quote_plus(query)
    url = site["search_url"].format(query=q_enc)
    domain = site["domain"]

    async with browser_manager.semaphore:
        browser = await browser_manager.get_browser()
        context = await browser.new_context(
            user_agent=DEFAULT_HEADERS["User-Agent"],
            locale="tr-TR",
            viewport={"width": 1366, "height": 768},
            extra_http_headers={"Accept-Language": "tr-TR,tr;q=0.9"},
        )
        try:
            page = await context.new_page()
            await page.add_init_script(
                "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
            )
            await page.route(
                "**/*",
                lambda route: route.abort()
                if route.request.resource_type in ("image", "media", "font")
                else route.continue_(),
            )
            await page.goto(url, wait_until="domcontentloaded", timeout=14000)
            await page.wait_for_timeout(1500)

            raw_results = await page.evaluate(PLAYWRIGHT_DOM_EXTRACTOR_JS)
            items: List[Dict[str, Any]] = []
            for r in raw_results or []:
                title = (r.get("title") or "").strip()
                price = parse_price(r.get("price"))
                p_url = abs_url(domain, r.get("url") or "")
                in_stock = bool(r.get("in_stock", True))
                if title and price and p_url:
                    items.append({
                        "title": title,
                        "price": price,
                        "url": p_url,
                        "in_stock": in_stock,
                    })

            if not items:
                content = await page.content()
                items.extend(extract_jsonld_products(content, domain))
                if site.get("adapter") == "petlebi":
                    items.extend(_parse_petlebi_html(content))

            return items
        finally:
            try:
                await context.close()
            except Exception:
                pass


MARKETPLACE_SELLER_KEYS = {
    "trendyol": ("trendyol.com", "trendyol"),
    "pttavm": ("pttavm.com", "pttavm"),
    "n11": ("n11.com", "n11"),
    "hepsiburada": ("hepsiburada.com", "hepsiburada"),
}


async def scrape_marketplace_hybrid(
    client: httpx.AsyncClient, site: Dict[str, Any], query: str
) -> List[Dict[str, Any]]:
    """
    1. First tries fast httpx request
    2. For marketplaces with direct Akakçe offer feeds (Trendyol, PttAVM, N11, Hepsiburada),
       checks if direct request is blocked by Cloudflare and resolves live marketplace offers;
       otherwise uses Playwright headless Chromium.
    """
    q_enc = urllib.parse.quote_plus(query)
    url = site["search_url"].format(query=q_enc)
    domain = site["domain"]
    adapter_name = site.get("adapter", "")

    try:
        resp = await client.get(url, headers=DEFAULT_HEADERS, follow_redirects=True, timeout=6.0)
        if resp.status_code == 200 and "challenges.cloudflare.com" not in resp.text:
            items = extract_jsonld_products(resp.text, domain)
            if items:
                return items
    except Exception:
        pass

    # Check if Playwright can extract directly
    pw_items = await scrape_with_playwright(site, query)
    if pw_items:
        return pw_items

    # If Cloudflare blocked the datacenter IP, extract live offers for this marketplace
    if adapter_name in MARKETPLACE_SELLER_KEYS:
        url_key, seller_key = MARKETPLACE_SELLER_KEYS[adapter_name]
        ak_offers = await get_akakce_marketplace_offers(client, query)
        matched = [
            o for o in ak_offers
            if url_key in o["url"].lower() or seller_key in o["seller"].lower()
        ]
        if matched:
            return matched

    return []


ADAPTER_MAP = {
    "tsoft": scrape_tsoft,
    "ticimax": scrape_ticimax,
    "shopify": scrape_shopify,
    "ikas_petgross": scrape_ikas_petgross,
    "teartrade": scrape_teartrade,
    "yemgross": scrape_yemgross,
    "turgutyem": scrape_turgutyem,
    "akakce": scrape_akakce,
    "idefix": scrape_idefix,
    "amazon": scrape_amazon,
    "migros": scrape_migros,
    "petlebi": scrape_petlebi,
    "ideasoft": scrape_ideasoft,
    "woocommerce": scrape_woocommerce,
    "cimri": scrape_marketplace_hybrid,
    "a101": scrape_marketplace_hybrid,
    "trendyol": scrape_marketplace_hybrid,
    "hepsiburada": scrape_marketplace_hybrid,
    "n11": scrape_marketplace_hybrid,
    "pttavm": scrape_marketplace_hybrid,
}


async def search_single_site(
    client: httpx.AsyncClient, site: Dict[str, Any], query: str
) -> Dict[str, Any]:
    site_name = site["name"]
    site_id = site["id"]
    adapter_name = site.get("adapter", "tsoft")
    adapter_fn = ADAPTER_MAP.get(adapter_name, scrape_marketplace_hybrid)

    async def _run():
        raw_items = await adapter_fn(client, site, query)
        filtered = score_and_filter_products(query, raw_items, site_name=site_name, top_n=3)
        return filtered

    try:
        results = await asyncio.wait_for(_run(), timeout=SITE_TIMEOUT_SECONDS)
        if results:
            return {
                "site_id": site_id,
                "site": site_name,
                "status": "ok",
                "message": f"{len(results)} ürün",
                "results": results,
            }
        return {
            "site_id": site_id,
            "site": site_name,
            "status": "empty",
            "message": "Sonuç yok",
            "results": [],
        }
    except asyncio.TimeoutError:
        return {
            "site_id": site_id,
            "site": site_name,
            "status": "timeout",
            "message": "zaman aşımı",
            "results": [],
        }
    except Exception as exc:
        return {
            "site_id": site_id,
            "site": site_name,
            "status": "error",
            "message": str(exc)[:40] or "hata",
            "results": [],
        }
