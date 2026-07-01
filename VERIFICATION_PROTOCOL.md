# ANTIGRAVITY VERIFICATION PROTOCOL
## Mandatory Verification Gates

Certification of any software output requires passing through five distinct, executable verification gates. Reports must document the actual command executed and the exact terminal output.

---

### GATE 1: REPOSITORY DISCOVERY GATE
- **Goal**: Verify that all files claimed to exist are physically present on the branch.
- **Protocol**:
  - Run `git ls-files` to list tracked files, or check direct folder structures.
  - Document the exact paths and sizes of all created/modified modules.

---

### GATE 2: REACTION ISOLATION GATE (LEAKAGE CHECK)
- **Goal**: Confirm zero database leakage or context references inside the UI presentation layer.
- **Protocol**:
  - Run grep commands targeting supabase client instances inside React pages:
    ```bash
    grep -rI "supabaseClient\|supabase" src/pages/ src/components/
    ```
  - Verification succeeds if and only if zero hits are returned.

---

### GATE 3: COMPILATION GATE
- **Goal**: Confirm that the code compiles for production without error.
- **Protocol**:
  - Run the typescript compiler:
    ```bash
    npx tsc --noEmit
    ```
  - Verify that no type, module-resolution, or syntax errors are reported.

---

### GATE 4: PRODUCTION BUILD GATE
- **Goal**: Ensure the application generates standard, minified distribution bundles.
- **Protocol**:
  - Run the bundler build script:
    ```bash
    npm run build
    ```
  - Verify that the process exits with status 0.

---

### GATE 5: GIT CLEANLINESS GATE
- **Goal**: Confirm the working tree is clean and does not contain unexpected modifications, merge conflicts, or untracked temporary artifacts.
- **Protocol**:
  - Run `git status` and search the code for any remaining Git conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
  - Working tree must be verified as fully reconciled.
