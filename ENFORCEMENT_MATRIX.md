# ENFORCEMENT MATRIX
## Objective Verification & Enforcement Standards

This document establishes the exact execution commands, grep search expressions, and static analysis directives used to verify compliance with every rule defined in the AntiGravity Factory Constitution.

---

### SECTION 1: SYSTEM ENFORCEMENT RULES

| Rule Name | Constitutional Reference | Auditing Command / Method | Objective PASS Criteria |
| :--- | :--- | :--- | :--- |
| **Repository SSOT** | `FACTORY_CONSTITUTION.md` Sec 1.1 | `git ls-files` and folder inspection. | File path exists on disk and is actively tracked in Git. No discrepancy with documentation. |
| **Pristine Build** | `VERIFICATION_PROTOCOL.md` Gate 4 | `npm run build` | Process exits with status 0. Bundle is successfully generated. |
| **Type Integrity** | `VERIFICATION_PROTOCOL.md` Gate 3 | `npx tsc --noEmit` | Exit code is 0. No compiler errors are reported. |
| **Lint Compliance** | `VERIFICATION_PROTOCOL.md` Gate 5 | `npm run lint` | Linter exits with status 0 and zero lint violations. |
| **No UI Leakage** | `EXECUTION_PROTOCOL.md` Sec 2.1 | `grep -rI "supabase" src/pages/` | Zero files returned. No direct database dependencies allowed in pages. |
| **CARSS API Supreme Gateway** | `MACHINE_BOUNDARY.md` Sec 1.1 | `grep -rI "Repository" src/pages/` | Zero files returned. UI can only communicate via the CARSS API. |
| **Pristine Working Tree** | `VERIFICATION_PROTOCOL.md` Gate 5 | `git status` | Output contains `"nothing to commit, working tree clean"`. |
| **Zero Merge Conflicts** | `REPOSITORY_TRUTH_PROTOCOL.md` Sec 2.2 | `grep -rI "<<<<<<<" src/` | Zero matches returned. No unresolved merge markers in codebase. |
| **Runtime Proof** | `EVIDENCE_STANDARD.md` Sec 2.5 | Review logs from `npm run dev` / test execution. | Clear printout showing end-to-end operation completion with verified Request IDs. |

---

### SECTION 2: VERIFICATION PROTOCOL EXECUTION GUIDE

Every build loop run by the machine must execute the above Enforcement Matrix in sequence.
- If any audit command returns a non-zero exit status, or if a single file violates layer boundaries, the execution is automatically marked as **FAIL**.
- The machine is structurally blocked from continuing implementation or producing a success report until all audit commands are resolved.
