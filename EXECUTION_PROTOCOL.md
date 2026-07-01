# ANTIGRAVITY EXECUTION PROTOCOL
## Layer Verification and Boundary Guarding

### SECTION 1: LAYER DEFINITIONS & CONSTRAINTS

Every operation inside the AntiGravity Software Factory must execute through the designated layer pipeline. This pipeline is unidirectional and absolute:

1. **The Presentation Layer (React UI)**:
   - Responsibility: Capture human intent, perform client-side input validation, and render interface components.
   - Constitutional Constraint: React must never import `supabase` or directly communicate with database clients, SQL, repositories, or data mappers.

2. **The Supreme Boundary Gateway (CARSS API)**:
   - Responsibility: Orchestrate business services, construct ExecutionContexts, append Request IDs and timestamps, and manage telemetry metadata tracing.
   - Constitutional Constraint: React components can only reference the `carssApi` global export.

3. **The Application Service Layer**:
   - Responsibility: Validate operational rules, authorize roles, coordinates transactional sequence, and resolve execution conditions.
   - Constitutional Constraint: Services do not execute database operations. They delegate execution to Repositories.

4. **The Repository Layer (Passive Persistence Adapters)**:
   - Responsibility: Pure reading, writing, and mapping of database records to standard domain schemas.
   - Constitutional Constraint: Repositories are prohibited from resolving sessions, generating timestamps, or evaluating business authorization.

5. **The Persistence Layer (Supabase / Database Client)**:
   - Responsibility: Durable storage execution.

---

### SECTION 2: VERIFICATION GATE CODES

To prevent architectural leakage, the following validation commands must execute before any branch is ready for deployment:

1. **Leakage Verification Command**:
   ```bash
   grep -rI "supabase\.from\|supabase\.auth\|supabase\.rpc" src/
   ```
   *Expected Output*: Only files residing in `src/repositories/` or `src/lib/supabaseClient.ts` may return positive matches. Any hit in `src/pages/`, `src/components/`, or `src/state/` triggers an immediate **FAIL** state.

2. **Repository Purity Command**:
   ```bash
   grep -rI "useAuth\|AuthContext" src/repositories/
   ```
   *Expected Output*: Zero results. Repositories must never import UI context hooks or session-based state providers.
