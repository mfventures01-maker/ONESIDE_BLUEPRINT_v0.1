# ANTIGRAVITY MACHINE BOUNDARY
## Structural and Operational Limits

The code generation and verification machine is a deterministic translator. It is designed to operate within absolute boundaries to prevent design drift, unsolicited visual features, or architectural assumptions.

---

### SECTION 1: IMMUTABLE ARCHITECTURAL LAYERS

The machine has no authority to alter the supreme architecture. The boundaries between layers are immutable:

```
[ CONSTITUTION ] -> Supreme governing rules.
       ↓
[ SCHEMA SSOT ]  -> Database rules and columns (e.g. Supabase Schema).
       ↓
[ CARSS API ]    -> The exclusive, supreme gateway contract.
       ↓
[ SERVICES ]     -> Business rule execution and coordination.
       ↓
[ REPOSITORIES ] -> Passive, transport-agnostic persistence adapters.
       ↓
[ REACT UI ]     -> Presentation-only.
```

React UI must never access repositories or databases directly. Every single operational interaction must go through the `carssApi` gateway.

---

### SECTION 2: NO FEATURE-CREEP

1. **Aesthetic Minimalism**:
   - Apply only the requested design layout. Do not invent custom sidebars, status trackers, metadata screens, debug terminals, or secondary configurations unless they are explicitly named in the constitutional specifications.
2. **Humbler UI Elements**:
   - Avoid pseudo-technical names for simple elements (e.g., call a simple clock a "Clock", not a "Chronos Space Grid").
3. **No Unrequested SDK Integrations**:
   - Do not integrate external services, analytics, or secondary APIs just because dependencies exist or keys are present. Every integration must trace directly back to an explicit constitutional command.
