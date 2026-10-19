#!/usr/bin/env python3
"""
OPENTIX Classical Concert Scraper
Fetches real classical, orchestral, solo, and chamber concerts from the OPENTIX search API.
"""

import urllib.request
import urllib.error
import json
import datetime
from typing import List, Dict, Any, Optional

OPENTIX_SEARCH_URL = "https://search.opentix.life/search"

CATEGORIES = [
    "音樂-管絃樂團",
    "音樂-室內樂",
    "音樂-絃樂團",
    "音樂-獨奏",
    "音樂-獨唱",
    "音樂-合唱",
    "音樂-歌劇",
    "音樂-動漫/電影音樂會",
]

def map_category(categories: List[str], title: str) -> str:
    cat_str = " ".join(categories) + " " + title
    if "管絃樂" in cat_str or "交響" in cat_str:
        return "交響樂"
    if "鋼琴" in cat_str or "獨奏" in cat_str:
        return "鋼琴獨奏"
    if "室內樂" in cat_str or "三重奏" in cat_str or "四重奏" in cat_str or "五重奏" in cat_str:
        return "室內樂"
    if "歌劇" in cat_str or "聲樂" in cat_str or "獨唱" in cat_str or "合唱" in cat_str:
        return "聲樂/歌劇"
    if "電影" in cat_str or "動漫" in cat_str or "配樂" in cat_str:
        return "跨界合奏"
    return "交響樂"

def detect_organizer_source(organizer_name: str, title: str) -> tuple[str, str]:
    combined = organizer_name + " " + title
    if "牛耳" in combined or "MNA" in combined:
        return "MNA 牛耳藝術", "mna"
    if "寬宏" in combined:
        return "寬宏藝術", "kham"
    if "鴻觀" in combined or "鴻宇" in combined:
        return "鴻觀/鴻宇藝術", "grandview"
    return (organizer_name or "兩廳院 OPENTIX"), "opentix"

def clean_city(city: Optional[str]) -> str:
    if not city:
        return "台北"
    c = city.replace("臺", "台")
    if "台北" in c:
        return "台北"
    if "台中" in c:
        return "台中"
    if "高雄" in c:
        return "高雄"
    if "台南" in c:
        return "台南"
    if "新竹" in c:
        return "新竹"
    return c[:2] if len(c) >= 2 else "台北"

def fetch_opentix_programs(limit: int = 50) -> List[Dict[str, Any]]:
    payload = {
        "language": "zh-CHT",
        "categoryFilter": CATEGORIES,
    }

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://www.opentix.life",
        "Referer": "https://www.opentix.life/",
    }

    req = urllib.request.Request(OPENTIX_SEARCH_URL, data=json.dumps(payload).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"Failed to fetch OPENTIX data: {e}")
        return []

    found = data.get("result", {}).get("found", [])
    print(f"Retrieved {len(found)} raw programs from OPENTIX API.")

    concerts = []
    now = datetime.datetime.now(datetime.timezone.utc)

    for item in found[:limit]:
        s = item.get("source", {})
        program_id = str(s.get("id"))
        title = s.get("title", "").strip()
        if not title:
            continue

        raw_organizer = s.get("organizers", "")
        organizer, source = detect_organizer_source(raw_organizer, title)
        category = map_category(s.get("categories", []), title)

        # Dates & Venues
        dates = []
        event_venues = s.get("eventVenues", [])
        for ev in event_venues:
            venue_name = ev.get("name", "國家音樂廳")
            city = clean_city(ev.get("city"))
            times = ev.get("times", [])
            for t in times:
                start_ms = t.get("start")
                if not start_ms:
                    continue
                dt = datetime.datetime.fromtimestamp(start_ms / 1000.0, tz=datetime.timezone.utc)
                # Filter out past events
                if dt < now:
                    continue

                status_code = t.get("status", 0)
                status = "on_sale"
                if status_code == 2:
                    status = "sold_out"
                elif status_code == 1:
                    status = "coming_soon"

                dates.append({
                    "datetime": dt.isoformat(),
                    "venue": venue_name,
                    "city": city,
                    "status": status,
                })

        # Skip if no upcoming dates
        if not dates:
            continue

        # Sort dates chronologically
        dates.sort(key=lambda d: d["datetime"])

        # Price range
        min_price = s.get("minPrice")
        max_price = s.get("maxPrice")
        if min_price is not None and max_price is not None:
            if min_price == max_price:
                price_range = f"NT$ {min_price:,}"
            else:
                price_range = f"NT$ {min_price:,} - {max_price:,}"
        else:
            price_range = "詳見購票頁面"

        # Performers from tags / organizers
        tags = s.get("tags", [])
        performers = [t for t in tags if len(t) > 1 and t not in ["音樂", "管絃樂", "音樂會"]]
        if not performers:
            performers = [organizer]

        # Poster image
        poster_url = s.get("imageUrl") or "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80"
        ticket_url = f"https://www.opentix.life/event/{program_id}"

        # AI summary highlight
        english_title = s.get("englishTitle")
        ai_summary = f"✨ {english_title}" if english_title else f"⭐️ {organizer} 精選呈獻"

        concerts.append({
            "id": f"opentix-{program_id}",
            "title": title,
            "organizer": organizer,
            "source": source,
            "performers": performers[:3],
            "category": category,
            "dates": dates,
            "posterUrl": poster_url,
            "ticketUrl": ticket_url,
            "priceRange": price_range,
            "aiSummary": ai_summary,
            "description": s.get("summary") or title,
        })

    return concerts

if __name__ == "__main__":
    results = fetch_opentix_programs(limit=30)
    print(f"Successfully processed {len(results)} upcoming classical concerts.")
    if results:
        print(f"Example concert: {results[0]['title']}")
        print(f"Dates: {len(results[0]['dates'])} shows, City: {results[0]['dates'][0]['city']}")
