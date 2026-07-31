# Oneside Entertainment Superadmin – Constitutional Deterministic Blueprint

## 1. Project Identity & Territory Map
- **User Type**: Superadmin (Role Level 100).
- **Operational Scope**: Global (All Territories). RLS exemption via `carss_rls_ssot_gate`.
- **Governing Territories**: Identity, Authority, Onboarding, Audit, Intelligence.

---

## 2. Certified Database Schema (The Steel Frame)
The Superadmin interacts exclusively with the following certified tables via strictly defined RPCs:

| Table Name | Certified Columns (Source: Schema Registry v1) |
| :--- | :--- |
| `businesses` | `id`, `name`, `city`, `inventory_mode`, `created_at`, `is_active`, `slug` |
| `carss_roles` | `id`, `role_name`, `role_level` (Certified values: 100, 80, 50, 10) |
| `staff_profiles` | `id`, `auth_user_id`, `role_id`, `full_name`, `phone`, `is_active`, `pin_code` |
| `orders` | `id`, `state` (FSM), `total_amount`, `shift_id`, `branch_id`, `placed_at`, `completed_at` |
| `transactions` | `id`, `amount`, `order_id`, `payment_method`, `shift_id`, `staff_id`, `created_at` |
| `carss_shift_core` | `id`, `staff_id`, `status`, `total_revenue`, `declared_total`, `variance` |
| `audit_logs` | `id`, `actor_id`, `action`, `entity_type`, `status`, `severity`, `payload`, `created_at` |

---

## 3. Certified RPC Registry (The Behavioral Layer)
The Superadmin executes the following deterministic RPCs. Direct table mutations are constitutionally forbidden.

| RPC Name | Input Payload | Output | FSM Dependency |
| :--- | :--- | :--- | :--- |
| `create_ceo()` | `p_business_id`, `p_full_name`, `p_phone`, `p_auth_user_id` | `uuid` (Profile ID) | Onboarding FSM (Transitions CEO -> STRUCTURE) |
| `assign_job_role()` | `p_staff_id`, `p_job_role` (`ceo`, `manager`, `staff`) | `void` | Authority Territory |
| `close_shift_atomic()` | `p_shift_id`, `p_declared_cash`, `p_declared_pos`, `p_declared_transfer`, `p_actor` | `numeric` (Variance) | Shift FSM (Transitions APPROVED -> CLOSED) |
| `get_analytics_summary()`| `start_date`, `end_date` | `jsonb` (`Total Revenue`, `Avg Ticket`, `Active Businesses`) | Intelligence Territory |
| `carss_append_event()` | `p_event_type`, `p_entity_type`, `p_entity_id`, `p_payload` | `void` | Audit Territory |

---

## 4. Certified FSM State Machines
- **Onboarding FSM**: `BUSINESS` (Business Created) → `CEO` (CEO Created) → `STRUCTURE` (Org Created) → `BLUEPRINT` (Blueprint Assigned) → `THEME` (Theme Assigned) → `CATALOG` (Catalog Completed) → `REVIEW` → `ACTIVATED` (Business Activated).
- **Shift FSM**: `OPEN` → `DECLARED` → `SUBMITTED` → `APPROVED` → `CLOSED`. (Superadmin has authority to force `OPEN` → `FORCE_CLOSED` if unreconciled).

---

## 5. Certified Frontend Routes & Layouts (Master Page)
- **Layout**: `AuthenticatedLayout` wrapping `DashboardLayout` (Sidebar on left, Content on right).
- **Certified Routes**:
  - `/dashboard` (Command Center)
  - `/onboarding` (Genesis Wizard)
  - `/roles` (Authority Management)
  - `/settings` (System Configuration)
  - `/audit` (Audit Observatory)
- **Visibility**: All routes are visible to Superadmin. They see the full territory map.

---

## 6. Experience & Motion Contract (Luxury Constitution)
- **Background**: `#0F172A` (Deep Slate) – 90% dominance.
- **Glass Surfaces**: `rgba(15, 23, 42, 0.65)` with `backdrop-filter: blur(12px)` and `border: 1px solid rgba(255,255,255,0.05)`.
- **Primary Action Color**: `#C46210` (Burnt Ochre) – Used for "Onboard New Business" and "Approve Shift" CTAs.
- **Typography**: Headings Montserrat (700-900, tracking-tighter), Labels Montserrat UPPERCASE (`tracking-[0.3em]`), Body Inter (300-600).
- **Motion (Sacred Motions)**:
  - *Navigation Emergence*: `transform: translateX(-100%)` to `0` over 450ms, `cubic-bezier(0.16, 1, 0.3, 1)`.
  - *Revenue Counter*: Animates from 0 to final value over exactly 200ms. No slot-machine effects.
  - *Breathing CTA*: Scale from 1.00 to 1.02 every 2000ms.

---

## 7. Financial Truth & Reconciliation
- **Authoritative Truth**: Platform Revenue = `SUM(transactions.amount)`.
- **Frontend Restriction**: The frontend must never calculate totals. It must render the `total_revenue` property returned by `get_analytics_summary()`.
- **Variance Rule**: `Variance = SUM(transactions.amount) - declared_total`. If variance is non-zero, shift closure requires manager/superadmin override.

---

## 8. Security & RLS Gates
- **Normal Operation**: Users are restricted to their `business_id` via `carss_rls_business_gate`.
- **Superadmin Exemption**: The Superadmin operates under `carss_rls_ssot_gate`. They can view data across all businesses, but must still execute actions via `carss_authorize()` to ensure Role Level 100 is verified before execution.
