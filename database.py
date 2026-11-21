import os
import json
import sqlite3
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from typing import List, Dict, Any, Optional

IST_TZ = ZoneInfo("Europe/Istanbul")
DB_PATH = os.getenv("DATABASE_PATH", "/data/mamafiyat.db")


def get_conn() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS searches (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query TEXT NOT NULL,
                created_at TEXT NOT NULL,
                cheapest_site TEXT,
                cheapest_price REAL,
                cheapest_url TEXT,
                cheapest_title TEXT,
                sites_with_results INTEGER DEFAULT 0,
                total_sites INTEGER DEFAULT 28,
                results_json TEXT NOT NULL
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches(created_at DESC)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_searches_query ON searches(query)")
        conn.commit()


def save_search(
    query: str,
    results: List[Dict[str, Any]],
    site_statuses: List[Dict[str, Any]],
    total_sites: int = 28
) -> int:
    now_str = datetime.now(IST_TZ).strftime("%Y-%m-%d %H:%M:%S")

    # Find cheapest in-stock item (or overall cheapest if none in stock)
    in_stock_items = [r for r in results if r.get("in_stock") and r.get("price")]
    pool = in_stock_items if in_stock_items else [r for r in results if r.get("price")]
    pool.sort(key=lambda x: x["price"])

    cheapest_site = pool[0]["site"] if pool else None
    cheapest_price = pool[0]["price"] if pool else None
    cheapest_url = pool[0]["url"] if pool else None
    cheapest_title = pool[0]["title"] if pool else None

    sites_with_results = len({r["site"] for r in results})

    payload = json.dumps({
        "results": results,
        "site_statuses": site_statuses
    }, ensure_ascii=False)

    with get_conn() as conn:
        cur = conn.execute(
            """
            INSERT INTO searches (
                query, created_at, cheapest_site, cheapest_price,
                cheapest_url, cheapest_title, sites_with_results,
                total_sites, results_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                query.strip(),
                now_str,
                cheapest_site,
                cheapest_price,
                cheapest_url,
                cheapest_title,
                sites_with_results,
                total_sites,
                payload,
            ),
        )
        conn.commit()
        return cur.lastrowid


def list_searches(
    period: str = "all",
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = 200
) -> List[Dict[str, Any]]:
    now = datetime.now(IST_TZ)
    today_str = now.strftime("%Y-%m-%d")

    where_clauses = []
    params: List[Any] = []

    if period == "today":
        where_clauses.append(" date(created_at) = ? ")
        params.append(today_str)
    elif period == "yesterday":
        yest_str = (now - timedelta(days=1)).strftime("%Y-%m-%d")
        where_clauses.append(" date(created_at) = ? ")
        params.append(yest_str)
    elif period == "7d":
        d7_str = (now - timedelta(days=7)).strftime("%Y-%m-%d %H:%M:%S")
        where_clauses.append(" created_at >= ? ")
        params.append(d7_str)
    elif period == "30d":
        d30_str = (now - timedelta(days=30)).strftime("%Y-%m-%d %H:%M:%S")
        where_clauses.append(" created_at >= ? ")
        params.append(d30_str)
    elif period == "custom":
        if start_date:
            where_clauses.append(" date(created_at) >= ? ")
            params.append(start_date)
        if end_date:
            where_clauses.append(" date(created_at) <= ? ")
            params.append(end_date)

    if q and q.strip():
        where_clauses.append(" LOWER(query) LIKE ? ")
        params.append(f"%{q.strip().lower()}%")

    where_sql = (" WHERE " + " AND ".join(where_clauses)) if where_clauses else ""
    sql = f"""
        SELECT id, query, created_at, cheapest_site, cheapest_price,
               cheapest_url, cheapest_title, sites_with_results, total_sites
        FROM searches
        {where_sql}
        ORDER BY id DESC
        LIMIT ?
    """
    params.append(limit)

    with get_conn() as conn:
        rows = conn.execute(sql, params).fetchall()
        return [dict(r) for r in rows]


def get_search_by_id(search_id: int) -> Optional[Dict[str, Any]]:
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM searches WHERE id = ?", (search_id,)).fetchone()
        if not row:
            return None
        d = dict(row)
        try:
            parsed = json.loads(d.pop("results_json", "{}"))
            d["results"] = parsed.get("results", [])
            d["site_statuses"] = parsed.get("site_statuses", [])
        except Exception:
            d["results"] = []
            d["site_statuses"] = []
        return d
