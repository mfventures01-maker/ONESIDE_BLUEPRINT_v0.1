# DASHBOARD CARTOGRAPHY

## Dashboard Decomposition

The Dashboard.tsx acts as a container for role-based views. Identified components/widgets:

- **Metrics Cards**: Revenue, Transactions, Operations, Audit Logs.
- **Charts**: LineChart (Revenue trends), BarChart (Transactions/Operations).
- **Tabs/Panels**: Dependent on the RoleType (CEO, Manager, Staff).
- **Services Used**: `revenueService`, `operationService`.
