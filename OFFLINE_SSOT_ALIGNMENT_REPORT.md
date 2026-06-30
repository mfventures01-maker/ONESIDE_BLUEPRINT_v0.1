# OFFLINE_SSOT_ALIGNMENT_REPORT.md

## 1. Offline Alignment Summary
In compliance with Rule 5 of the CARSS Constitution, the offline storage layer has been redesigned to act as a strict mirror of the Supabase Single Source of Truth (SSOT). Synthetic, fake, or hardcoded entities like static business cards, seed branches, or simulation accounts are prohibited.

---

## 2. Eliminated Synthetic Entities

The following hardcoded mocks and seeding operations are completely purged:
- `OFFLINE_STAFF_SEEDS` (Fake employees and pre-baked pin hashes)
- `DEFAULT_BUSINESS` (Synthetic primary corporate identity)
- `DEFAULT_BRANCH` (Synthetic Main Deck Lounge node)
- `INITIAL_CATEGORIES` & `INITIAL_MENU_ITEMS` (Synthetic product lists)
- `INITIAL_PROMOTIONS` & `INITIAL_INVENTORY` (Simulated stock values)

If no synchronized cache exists for these tables, the platform returns a deterministic, clean, empty state (`[]` or `null`) instead of fabricating mock records.

---

## 3. Synchronized Mirror Protocol
1. On successful online queries, repositories automatically update the corresponding `OfflineStorage` cache with fresh SSOT records.
2. In offline/fallback mode, repositories inspect this cache. If the cache is empty, they return `data: null` or `data: []` securely.
3. This guarantees that offline operations use genuine, previously validated records and prevents security or data leakage across local and online boundaries.

---

## 4. Constitutional Verdict
**PROCEED TO OFFLINE SYNCHRONIZATION HARDENING**
All synthetic simulator states are eliminated from the CARSS environment.
