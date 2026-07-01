# ANTIGRAVITY REPOSITORY TRUTH PROTOCOL
## Verification of Disk State vs. Documentation

To eliminate the discrepancy where documentation lists files that are not physically present on disk, this protocol establishes mandatory verification procedures.

---

### SECTION 1: SYSTEM DISCOVERY MANDATE

1. **Physical Existence Verification**:
   - Every file referenced in an engineering output must be verified via direct disk-level or Git-level auditing tools before outputting any completion message.
2. **Path Resolution**:
   - Paths must match file names and directories exactly. Spacing typos, trailing slashes, or casing mismatches are strictly prohibited.

---

### SECTION 2: VERIFICATION TASKS

Every build loop must execute these checks:

1. **Existence Verification**:
   Verify that all critical repository files exist and are tracked by Git:
   ```bash
   git ls-files
   ```
2. **Conflict Resolution**:
   Audit all code files to ensure no remaining Git conflict markers exist:
   ```bash
   grep -rI "<<<<<<<" src/
   ```
3. **Branch Cleanliness**:
   Ensure the current branch is verified and active:
   ```bash
   git status
   ```
   No uncommitted code, temporary files, or extraneous directories can remain when the loop terminates.
