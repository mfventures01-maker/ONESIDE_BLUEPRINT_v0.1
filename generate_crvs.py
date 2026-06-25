import json

with open('analysis.json', 'r') as f:
    data = json.load(f)

def write_file(filename, content):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. ROUTE_EXECUTION_REPORT.md
routes = "# ROUTE EXECUTION REPORT\n\n"
routes += "## Routes Discovered\n"
routes += "- `/`: `PublicGatewayPage` - PARTIALLY VERIFIED (Static trace exists, no runtime render evidence)\n"
routes += "- `/login/ceo`: `CEOLogin` - PARTIALLY VERIFIED\n"
routes += "- `/login/staff`: `StaffLogin` - PARTIALLY VERIFIED\n"
routes += "- `/dashboard`: `Dashboard` - PARTIALLY VERIFIED (Guarded by `ProtectedRoute`)\n"
routes += "- `/reports`: `Reports` - PARTIALLY VERIFIED (Guarded by `ProtectedRoute`)\n"
routes += "- `/audit`: `AuditRoom` - PARTIALLY VERIFIED (Guarded by `ProtectedRoute`)\n"
routes += "- `/home`: `CustomerHomepage` - PARTIALLY VERIFIED (Guarded by `ProtectedRoute`)\n"
routes += "- `/notifications`: `Notifications` - PARTIALLY VERIFIED (Guarded by `ProtectedRoute`)\n"
routes += "- `/profile`: `Profile` - PARTIALLY VERIFIED (Guarded by `ProtectedRoute`)\n"
routes += "- `/onboarding`: `Onboarding` - PARTIALLY VERIFIED (Guarded by `ProtectedRoute`)\n"
write_file('ROUTE_EXECUTION_REPORT.md', routes)

# 2. COMPONENT_EXECUTION_REPORT.md
components = "# COMPONENT EXECUTION REPORT\n\n"
comps = [d for d in data if 'components' in d['file']]
for c in comps:
    components += f"### Component: `{c['file']}`\n"
    components += f"- Render condition: UNVERIFIED (No runtime trace)\n"
    components += f"- Props supplied: UNVERIFIED\n"
    components += f"- Status: PARTIALLY VERIFIED (Static AST mapped)\n\n"
write_file('COMPONENT_EXECUTION_REPORT.md', components)

# 3. HOOK_EXECUTION_REPORT.md
hooks = "# HOOK EXECUTION REPORT\n\n"
pages_and_comps = [d for d in data if 'pages' in d['file'] or 'components' in d['file']]
for p in pages_and_comps:
    hooks += f"### Hooks in `{p['file']}`\n"
    for h in p['hooks']:
        hooks += f"- `{h}`: UNVERIFIED (No runtime dependency array tracking)\n"
    hooks += "\n"
write_file('HOOK_EXECUTION_REPORT.md', hooks)

# 4. SERVICE_EXECUTION_REPORT.md
services = "# SERVICE EXECUTION REPORT\n\n"
srvs = [d for d in data if 'services' in d['file']]
for s in srvs:
    services += f"### Service: `{s['file']}`\n"
    services += f"- Exports: {', '.join(s['exports'])}\n"
    services += f"- Runtime frequency: UNVERIFIED\n"
    services += f"- Database interaction: PARTIALLY VERIFIED (Contains Supabase calls)\n"
    services += f"- Status: PARTIALLY VERIFIED\n\n"
write_file('SERVICE_EXECUTION_REPORT.md', services)

# 5. ADAPTER_EXECUTION_REPORT.md
adapters = "# ADAPTER EXECUTION REPORT\n\n"
adpts = [d for d in data if 'adapters' in d['file']]
for a in adpts:
    adapters += f"### Adapter: `{a['file']}`\n"
    adapters += f"- Exports: {', '.join(a['exports'])}\n"
    adapters += f"- Mapping logic: PARTIALLY VERIFIED (Types mapped statically)\n"
    adapters += f"- Runtime Consumer: UNVERIFIED\n\n"
write_file('ADAPTER_EXECUTION_REPORT.md', adapters)

# 6. SUPABASE_AUTHORITY_REPORT.md
supabase = "# SUPABASE AUTHORITY REPORT\n\n"
supabase += "## Authority Objects\n"
supabase += "All objects classified as UNVERIFIED due to lack of Live Database Inspection.\n"
supabase += "Expected Tables (Static): `pos_transactions`, `shifts`, `audit_logs`, `reservations`\n"
write_file('SUPABASE_AUTHORITY_REPORT.md', supabase)

# 7. SQL_EXECUTION_REPORT.md
sql = "# SQL EXECUTION REPORT\n\n"
sql += "## Recovered Runtime Queries\n"
sql += "None. Classified as UNVERIFIED.\n"
sql += "Reason: No live query execution logs captured via Supabase inspection.\n"
write_file('SQL_EXECUTION_REPORT.md', sql)

# 8. COLUMN_UTILIZATION_REPORT.md
columns = "# COLUMN UTILIZATION REPORT\n\n"
columns += "## Column Utilization\n"
columns += "UNVERIFIED. Cannot determine runtime read/write frequencies without live database analytics.\n"
write_file('COLUMN_UTILIZATION_REPORT.md', columns)

# 9. CRVS_PHASE_1_5_EXECUTION_SUMMARY.md
summary = "# CRVS PHASE 1.5 EXECUTION SUMMARY\n\n"
summary += "• Total routes verified: 0 (10 PARTIALLY VERIFIED)\n"
summary += "• Total components verified: 0 (All PARTIALLY VERIFIED)\n"
summary += "• Total hooks executed: 0 (No runtime evidence)\n"
summary += "• Total services executed: 0\n"
summary += "• Total adapters executed: 0\n"
summary += "• Total SQL statements verified: 0\n"
summary += "• Total Supabase objects inspected: 0\n"
summary += "• Total columns analysed: 0\n"
summary += "• Dead code discovered: 0 (UNVERIFIED)\n"
summary += "• Legacy pathways discovered: 0\n"
summary += "• Shadow pathways discovered: 0\n"
summary += "• Runtime drift discovered: 0\n"
summary += "• Constitutional risks: Lack of live execution tracing environment.\n"
summary += "• Required remediation: Implement runtime tracing wrappers, DB query logs, and browser automation to satisfy CRVS live evidence requirements.\n"
write_file('CRVS_PHASE_1_5_EXECUTION_SUMMARY.md', summary)

print("CRVS Documents Generated.")
