# SCHEMA AUTHORITY CROSS-CHECK

## Overview
Based on static analysis, services (like `TransactionAdapter.ts`, `ShiftAdapter.ts`) use `supabase.from()` pointing to expected tables:
- `pos_transactions`
- `shifts`
- `audit_logs`
- `reservations`

No drift detected solely from static analysis of `.ts` files, but a deep SQL inspection is required for a 100% guarantee. The adapters appear strictly typed against `src/types.ts`.
