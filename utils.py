import re
import html
from typing import Optional, Tuple, List, Dict, Any
from rapidfuzz import fuzz

TR_MAP = str.maketrans({
    "ı": "i", "İ": "i", "I": "i",
    "ğ": "g", "Ğ": "g",
    "ü": "u", "Ü": "u",
    "ş": "s", "Ş": "s",
    "ö": "o", "Ö": "o",
    "ç": "c", "Ç": "c",
})


def normalize_tr(text: str) -> str:
    if not text:
        return ""
    t = html.unescape(text).translate(TR_MAP).lower()
    t = re.sub(r"[^a-z0-9\s.,+x]", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def parse_price(val: Any) -> Optional[float]:
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return round(float(val), 2) if val > 0 else None
    s = str(val).strip()
    if not s:
        return None
    s = html.unescape(s)
    m = re.search(r"(\d[\d.,]*)", s)
    if not m:
        return None
    num_str = m.group(1).strip(".,")
    if not num_str:
        return None

    if "," in num_str and "." in num_str:
        if num_str.rfind(",") > num_str.rfind("."):
            num_str = num_str.replace(".", "").replace(",", ".")
        else:
            num_str = num_str.replace(",", "")
    elif "," in num_str:
        parts = num_str.split(",")
        if len(parts[-1]) in (1, 2):
            num_str = "".join(parts[:-1]) + "." + parts[-1]
        else:
            num_str = "".join(parts)
    elif "." in num_str:
        parts = num_str.split(".")
        if len(parts) > 2:
            num_str = "".join(parts)
        elif len(parts[-1]) == 3 and len(parts[0]) <= 2 and int(parts[0]) > 0:
            num_str = "".join(parts)

    try:
        v = float(num_str)
        return round(v, 2) if v > 1.0 else None
    except ValueError:
        return None


def extract_weight(title: str) -> Tuple[Optional[str], Optional[float]]:
    """
    Extracts weight from product title.
    Returns (display_gramaj, weight_in_kg).
    """
    if not title:
        return None, None

    t = html.unescape(title).translate(TR_MAP).lower()

    # 1. Bonus bag pattern: e.g. "12+3 kg", "15 + 3 kg"
    m_plus = re.search(r"\b(\d+(?:[.,]\d+)?)\s*\+\s*(\d+(?:[.,]\d+)?)\s*(kg|kilo|kilogram)\b", t)
    if m_plus:
        w1 = float(m_plus.group(1).replace(",", "."))
        w2 = float(m_plus.group(2).replace(",", "."))
        total_kg = round(w1 + w2, 3)
        disp = f"{total_kg:g} kg ({w1:g}+{w2:g})"
        return disp, total_kg

    # 2. Multipack pattern A: "12x85 g", "12 x 85 gr", "2 x 15 kg"
    m_multi_a = re.search(
        r"\b(\d+)\s*(?:adet\s*|li\s*|lu\s*|paket\s*)?[x*×]\s*(\d+(?:[.,]\d+)?)\s*(kg|kilo|gr|gram|g|ml|lt|l)\b",
        t
    )
    if m_multi_a:
        count = int(m_multi_a.group(1))
        unit_val = float(m_multi_a.group(2).replace(",", "."))
        unit = m_multi_a.group(3)
        if 1 <= count <= 200 and unit_val > 0:
            if unit in ("kg", "kilo", "lt", "l"):
                kg = round(count * unit_val, 3)
                u_lbl = "kg" if unit in ("kg", "kilo") else "L"
                return f"{count}x{unit_val:g} {u_lbl}", kg
            else:
                kg = round((count * unit_val) / 1000.0, 3)
                u_lbl = "ml" if unit == "ml" else "g"
                return f"{count}x{unit_val:g} {u_lbl}", kg

    # 3. Multipack pattern B: "85 gr x 12", "140 gr 10'lu", "85 gr 12 adet", "2 kg (2 paketi)"
    m_multi_b = re.search(
        r"\b(\d+(?:[.,]\d+)?)\s*(kg|kilo|gr|gram|g|ml)\s*(?:\(\s*)?(?:[x*×]\s*)?(\d+)\s*(?:adet|li|lu|paket|paketi|'li|'lu|’li|’lu)\b",
        t
    )
    if m_multi_b:
        unit_val = float(m_multi_b.group(1).replace(",", "."))
        unit = m_multi_b.group(2)
        count = int(m_multi_b.group(3))
        if 1 < count <= 200 and unit_val > 0:
            if unit in ("kg", "kilo"):
                kg = round(count * unit_val, 3)
                return f"{count}x{unit_val:g} kg", kg
            else:
                kg = round((count * unit_val) / 1000.0, 3)
                return f"{count}x{unit_val:g} g", kg

    # 4. Multipack pattern C: "12'li ... 85 gr" or "24 Adet ... 85 g"
    m_count = re.search(r"\b(\d+)\s*(?:adet|paket|paketi|'li|'lu|’li|’lu|\s+li|\s+lu)\b", t)
    m_gram = re.search(r"\b(\d+(?:[.,]\d+)?)\s*(gr|gram|g)\b", t)
    if m_count and m_gram:
        count = int(m_count.group(1))
        g_val = float(m_gram.group(1).replace(",", "."))
        if 2 <= count <= 100 and 10 <= g_val <= 900:
            kg = round((count * g_val) / 1000.0, 3)
            return f"{count}x{g_val:g} g", kg

    # 5. Single weight in kg: "2 kg", "1,5 kg", "1.5kg"
    m_kg = re.search(r"(?:^|\s|[-_/(])(\d+(?:[.,]\d+)?)\s*(kg|kilo|kilogram)\b", t)
    if m_kg:
        val = float(m_kg.group(1).replace(",", "."))
        if 0.05 <= val <= 100:
            if m_count and 2 <= int(m_count.group(1)) <= 10:
                cnt = int(m_count.group(1))
                return f"{cnt}x{val:g} kg", round(cnt * val, 3)
            return f"{val:g} kg", round(val, 3)

    # 6. Single weight in g / gr: "400 g", "400 gr", "85g"
    m_g = re.search(r"(?:^|\s|[-_/(])(\d+(?:[.,]\d+)?)\s*(gr|gram|g)\b", t)
    if m_g:
        val = float(m_g.group(1).replace(",", "."))
        if 5 <= val <= 50000:
            if val >= 1000 and val % 1000 == 0:
                return f"{val / 1000:g} kg", round(val / 1000.0, 3)
            return f"{val:g} g", round(val / 1000.0, 3)

    # 7. Volume in L / ml
    m_lt = re.search(r"(?:^|\s|[-_/(])(\d+(?:[.,]\d+)?)\s*(lt|litre|l)\b", t)
    if m_lt:
        val = float(m_lt.group(1).replace(",", "."))
        if 0.1 <= val <= 100:
            return f"{val:g} L", round(val, 3)

    return None, None


def strip_weight_tokens(norm_text: str) -> str:
    s = re.sub(
        r"\b\d+(?:[.,]\d+)?\s*(?:[x*+]\s*\d+(?:[.,]\d+)?)?\s*(?:kg|kilo|kilogram|gr|gram|g|lt|litre|l|ml|adet|li|lu)\b",
        " ",
        norm_text,
        flags=re.I,
    )
    return re.sub(r"\s+", " ", s).strip()


def score_and_filter_products(
    query: str,
    raw_items: List[Dict[str, Any]],
    site_name: str,
    top_n: int = 3
) -> List[Dict[str, Any]]:
    """
    Enriches raw items with gramaj, weight_kg, price_per_kg, similarity score,
    filters out irrelevant products using rapidfuzz, and returns top_n most relevant items.
    """
    if not raw_items:
        return []

    q_norm = normalize_tr(query)
    _, q_weight_kg = extract_weight(query)
    q_core = strip_weight_tokens(q_norm)
    if not q_core:
        q_core = q_norm
    q_tokens = [tok for tok in q_core.split() if len(tok) >= 2]

    scored = []
    seen_urls = set()

    for item in raw_items:
        title = (item.get("title") or "").strip()
        title = html.unescape(re.sub(r"\s+", " ", title))
        price = parse_price(item.get("price"))
        url = (item.get("url") or "").strip()
        in_stock = bool(item.get("in_stock", True))

        if not title or not price or price <= 5.0 or not url:
            continue

        dedup_key = (url.split("?")[0].rstrip("/"), round(price, 1))
        if dedup_key in seen_urls:
            continue
        seen_urls.add(dedup_key)

        t_norm = normalize_tr(title)
        t_core = strip_weight_tokens(t_norm) or t_norm

        gramaj_str, weight_kg = extract_weight(title)

        # If query explicitly specified a weight (e.g. "2 kg"), filter out products with a different weight!
        if q_weight_kg is not None:
            if weight_kg is None:
                continue
            ratio_diff = abs(weight_kg - q_weight_kg) / max(q_weight_kg, 0.001)
            if ratio_diff > 0.15:
                continue

        # Calculate rapidfuzz similarity on core product name
        w_ratio = fuzz.WRatio(q_core, t_core)
        tset_ratio = fuzz.token_set_ratio(q_core, t_core)
        tsort_ratio = fuzz.token_sort_ratio(q_core, t_core)

        if q_tokens:
            matched_tokens = sum(1 for tok in q_tokens if tok in t_norm)
            coverage = matched_tokens / len(q_tokens)
        else:
            coverage = 1.0

        # Require at least half of core query tokens to appear in the product title
        if coverage < 0.55:
            continue

        base_score = (w_ratio * 0.35) + (tset_ratio * 0.45) + (tsort_ratio * 0.20)
        if coverage == 1.0:
            base_score = min(100.0, base_score + 8.0)

        if q_weight_kg is not None and weight_kg is not None:
            base_score = min(100.0, base_score + 5.0)

        if base_score < 58.0:
            continue

        price_per_kg = round(price / weight_kg, 2) if (weight_kg and weight_kg > 0) else None

        scored.append({
            "site": site_name,
            "title": title,
            "gramaj": gramaj_str or "-",
            "weight_kg": weight_kg,
            "price": round(price, 2),
            "price_per_kg": price_per_kg,
            "in_stock": in_stock,
            "url": url,
            "similarity": round(base_score, 1),
        })

    # Sort by relevance (similarity desc), then in_stock desc, then price asc
    scored.sort(key=lambda x: (-x["similarity"], not x["in_stock"], x["price"]))
    return scored[:top_n]
