import os
import json
import asyncio
from contextlib import asynccontextmanager
from typing import Optional
import yaml
import httpx
from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from database import init_db, save_search, list_searches, get_search_by_id
from adapters import search_single_site, browser_manager

SITES_FILE = os.path.join(os.path.dirname(__file__), "sites.yaml")


def load_sites():
    with open(SITES_FILE, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("sites", [])


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
    await browser_manager.close()


app = FastAPI(title="Mama Fiyat Karşılaştırma", lifespan=lifespan)

static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/", response_class=HTMLResponse)
async def index():
    index_path = os.path.join(static_dir, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/sites")
async def get_sites():
    sites = load_sites()
    return {"total": len(sites), "sites": [{"id": s["id"], "name": s["name"]} for s in sites]}


@app.get("/api/search/stream")
async def search_stream(q: str = Query(..., min_length=2, description="Aranacak mama adı")):
    query = q.strip()
    sites = load_sites()

    async def event_generator():
        all_results = []
        site_statuses = []

        # Yield initial start event
        init_payload = {
            "type": "start",
            "query": query,
            "total_sites": len(sites),
            "sites": [{"id": s["id"], "name": s["name"]} for s in sites],
        }
        yield f"data: {json.dumps(init_payload, ensure_ascii=False)}\n\n"

        limits = httpx.Limits(max_keepalive_connections=30, max_connections=60)
        async with httpx.AsyncClient(verify=False, timeout=20.0, limits=limits) as client:
            tasks = [
                asyncio.create_task(search_single_site(client, site, query))
                for site in sites
            ]

            for coro in asyncio.as_completed(tasks):
                try:
                    res = await coro
                except Exception as exc:
                    res = {
                        "site_id": "unknown",
                        "site": "Bilinmeyen",
                        "status": "error",
                        "message": str(exc)[:40],
                        "results": [],
                    }

                site_Results = res.get("results", [])
                all_results.extend(site_Results)
                site_statuses.append({
                    "site_id": res["site_id"],
                    "site": res["site"],
                    "status": res["status"],
                    "message": res["message"],
                    "count": len(site_Results),
                })

                event_data = {
                    "type": "site_result",
                    "site_id": res["site_id"],
                    "site": res["site"],
                    "status": res["status"],
                    "message": res["message"],
                    "results": site_Results,
                    "completed_count": len(site_statuses),
                    "total_sites": len(sites),
                }
                yield f"data: {json.dumps(event_data, ensure_ascii=False)}\n\n"

        # Sort final results (in_stock first, then price asc) before saving
        all_results.sort(
            key=lambda x: (
                not x.get("in_stock", True),
                x.get("price") if x.get("price") is not None else 999999.0,
            )
        )

        search_id = save_search(
            query=query,
            results=all_results,
            site_statuses=site_statuses,
            total_sites=len(sites),
        )

        done_payload = {
            "type": "done",
            "search_id": search_id,
            "total_results": len(all_results),
            "sites_with_results": len({r["site"] for r in all_results}),
            "total_sites": len(sites),
        }
        yield f"data: {json.dumps(done_payload, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/history")
async def api_history(
    period: str = Query("all", description="all | today | yesterday | 7d | 30d | custom"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
):
    items = list_searches(period=period, start_date=start_date, end_date=end_date, q=q)
    return {"items": items}


@app.get("/api/history/{search_id}")
async def api_history_detail(search_id: int):
    data = get_search_by_id(search_id)
    if not data:
        raise HTTPException(status_code=404, detail="Arama kaydı bulunamadı")
    return data
