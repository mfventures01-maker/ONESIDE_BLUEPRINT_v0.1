# ANTIGRAVITY EVIDENCE STANDARD
## Strict Evidence Requirements

To eliminate claims that diverge from repository reality, the AntiGravity Software Factory enforces a zero-tolerance policy against manual log fabrication or simulated results.

---

### SECTION 1: DEFINITION OF EVIDENCE

Evidence is defined strictly as **unmodified terminal output** generated directly from system execution. Any attempt to write mock command outputs or assume completion without executing the test commands is a critical system failure.

---

### SECTION 2: MANDATORY EVIDENCE SCHEMES

Every completion report must contain these exact blocks:

1. **BUILD_REPORT**:
   - Must contain the console printout of the bundler compiling modules.
2. **TYPECHECK_REPORT**:
   - Must contain the raw output of the typescript compiler.
3. **GIT_TREE_REPORT**:
   - Must contain the verbatim output of `git status` or file tracking commands showing that changes are cleanly tracked.
4. **FILE_EXISTENCE_REPORT**:
   - Must list the actual file paths on disk alongside their file sizes or creation dates.
5. **ROUTE_EXECUTION_REPORT**:
   - Must document console responses and API endpoints verified inside the container context.
