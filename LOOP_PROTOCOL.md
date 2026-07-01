# ANTIGRAVITY LOOP PROTOCOL
## The Deterministic Engineering Loop

All engineering modifications must execute through the following 11-step factory loop. Under no circumstances may any step be bypassed.

```
 [1] PLAN
    ↓
 [2] SPECIFICATION
    ↓
 [3] IMPLEMENTATION
    ↓
 [4] BUILD
    ↓
 [5] TYPESCRIPT
    ↓
 [6] LINT
    ↓
 [7] GIT VERIFICATION
    ↓
 [8] RUNTIME VERIFICATION
    ↓
 [9] COMMIT
    ↓
 [10] FREEZE
    ↓
 [11] STOP
```

---

### Step 1: PLAN
- Identify the exact delta requested by the constitutional specification.
- Locate the targeted modules on disk. Never assume a file exists based on previous logs; verify via file explorer first.

### Step 2: SPECIFICATION
- Write down the precise function signatures, structural models, and database columns that will be altered or created.

### Step 3: IMPLEMENTATION
- Write modular, highly cohesive, single-responsibility files. Avoid packing logic into a single file to prevent token limit truncation.

### Step 4: BUILD
- Run the build tool.
- Command: `npm run build`
- Verify that the exit code is 0 and the build output contains zero warnings.

### Step 5: TYPESCRIPT
- Compile with full type safety checks.
- Command: `npx tsc --noEmit`
- Verify that no type-mismatch or syntax errors exist.

### Step 6: LINT
- Run static analysis code checks.
- Command: `npm run lint` or equivalent linter command.
- Verify exit code is 0.

### Step 7: GIT VERIFICATION
- Audit the git working tree to confirm only expected modifications took place.
- Command: `git status` and `git diff --stat`

### Step 8: RUNTIME VERIFICATION
- Test the feature in the runtime environment. Capture console logs and verify the operations complete successfully.

### Step 9: COMMIT
- Commit the changes with a clear, concise commit message capturing the exact scope of modifications.

### Step 10: FREEZE
- Mark all completed modules as read-only. Further changes to these files inside the current phase are strictly prohibited.

### Step 11: STOP
- Terminate the run immediately. Await further operational commands. Do not clean up other folders, do not execute next phases.
