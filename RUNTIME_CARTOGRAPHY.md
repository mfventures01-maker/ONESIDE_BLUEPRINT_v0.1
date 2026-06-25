# RUNTIME AUTHORITY CARTOGRAPHY

## Runtime Flow

UI -> Components -> Hooks -> Services -> Adapters -> Supabase RPC/Views/Tables.

### Example Flow (Revenue)
1. `Dashboard.tsx`
2. `useRoleStore` / `useState`
3. `CARSS_Revenue_Server.fetchMetrics()`
4. `TransactionAdapter`
5. `supabase.from('pos_transactions')`
