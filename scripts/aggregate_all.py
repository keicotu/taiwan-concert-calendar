#!/usr/bin/env python3
"""
Taiwan Concert Calendar Master Aggregator
Combines real concerts from OPENTIX, MNA (牛耳), and outputs src/data/concerts.json
"""

import os
import json
import sys
from scrape_opentix import fetch_opentix_programs
from scrape_mna import fetch_mna_concerts

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "concerts.json")

def main():
    print("=== Starting Taiwan Concert Aggregator ===")

    # 1. Fetch OPENTIX
    print("\n1. Fetching OPENTIX classical concerts...")
    opentix_concerts = fetch_opentix_programs(limit=40)
    print(f"-> Got {len(opentix_concerts)} concerts from OPENTIX.")

    # 2. Fetch MNA
    print("\n2. Fetching MNA (牛耳藝術) concerts...")
    mna_concerts = fetch_mna_concerts()
    print(f"-> Got {len(mna_concerts)} concerts from MNA.")

    # 3. Merge & Deduplicate
    all_concerts = []
    seen_titles = set()

    # Prioritize MNA direct links
    for c in mna_concerts:
        key = c["title"].replace("【MNA 牛耳藝術】", "").strip().lower()[:15]
        seen_titles.add(key)
        all_concerts.append(c)

    for c in opentix_concerts:
        key = c["title"].strip().lower()[:15]
        # Avoid duplicate if MNA already has it
        if any(k in key or key in k for k in seen_titles):
            continue
        all_concerts.append(c)

    # Sort all concerts by earliest upcoming date
    all_concerts.sort(key=lambda x: x["dates"][0]["datetime"] if x["dates"] else "9999")

    # 4. Save to src/data/concerts.json
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(all_concerts, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Successfully generated {len(all_concerts)} real concerts into {OUTPUT_PATH}!")

if __name__ == "__main__":
    main()
