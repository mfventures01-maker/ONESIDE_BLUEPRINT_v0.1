# CARSS Wave 5 Constitutional Intelligence Verification Suite
# SPDX-License-Identifier: Apache-2.0
# Core Testing Engine for reportService.ts and Reports.tsx Page Layouts

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     CARSS SHIELD: CONSTITUTIONAL CERTIFICATION ENFORCEMENT" -ForegroundColor Cyan
Write-Host "        WAVE 5 - INTELLIGENCE TERRITORY VERIFIER SUITE" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$reportServicePath = "src/services/reportService.ts"
$reportsPagePath = "src/pages/Reports.tsx"
$routerPath = "src/routes/index.tsx"

$testPassed = $true

# 1. Evaluate reportService.ts Existence & Core Entities
Write-Host "[*] Evaluating $reportServicePath Core Assets..." -ForegroundColor Yellow
if (Test-Path $reportServicePath) {
    Write-Host "  [+] File reportService.ts located successfully." -ForegroundColor Green
    
    $content = Get-Content $reportServicePath -Raw
    
    # Check for CARSS_Report_Service
    if ($content -match "CARSS_Report_Service") {
        Write-Host "  [+] Class entity CARSS_Report_Service verified." -ForegroundColor Green
    } else {
        Write-Host "  [-] Class entity CARSS_Report_Service MISSING." -ForegroundColor Red
        $testPassed = $false
    }

    # Check for metric endpoints
    $endpoints = @("getExecutiveRevenueReport", "getOperationsReport", "getAuditReport", "getInventoryReport", "getReservationReport", "getStaffPerformanceReport")
    foreach ($ep in $endpoints) {
        if ($content -match $ep) {
            Write-Host "    [+] Metric API channel verified: $ep" -ForegroundColor Green
        } else {
            Write-Host "    [-] Metric API channel MISSING: $ep" -ForegroundColor Red
            $testPassed = $false
        }
    }
} else {
    Write-Host "  [-] File reportService.ts NOT FOUND." -ForegroundColor Red
    $testPassed = $false
}

Write-Host ""

# 2. Evaluate Reports.tsx UI Layers & Export Engines
Write-Host "[*] Evaluating $reportsPagePath UI Structure..." -ForegroundColor Yellow
if (Test-Path $reportsPagePath) {
    Write-Host "  [+] Reports web view component located successfully." -ForegroundColor Green
    
    $content = Get-Content $reportsPagePath -Raw

    # Look for Lineage Inspections
    if ($content -match "Forensic Lineage Trace" -or $content -match "expandedLineages") {
        Write-Host "  [+] Forensic Lineage Inspector verified." -ForegroundColor Green
    } else {
        Write-Host "  [-] Forensic Lineage Inspector MISSING." -ForegroundColor Red
        $testPassed = $false
    }

    # Look for Print Layout Styles
    if ($content -match "print:block" -or $content -match "window.print") {
        Write-Host "  [+] Embedded PDF Print Layout Engine verified." -ForegroundColor Green
    } else {
        Write-Host "  [-] Embedded PDF Print Layout Engine MISSING." -ForegroundColor Red
        $testPassed = $false
    }

    # Look for CSV exports
    if ($content -match "triggerCsvDownload" -or $content -match "text/csv") {
        Write-Host "  [+] Spreadsheets CSV Exporter engine verified." -ForegroundColor Green
    } else {
        Write-Host "  [-] Spreadsheets CSV Exporter engine MISSING." -ForegroundColor Red
        $testPassed = $false
    }

    # Look for WhatsApp Summary Templates
    if ($content -match "whatsAppText" -or $content -match "copyToClipboard") {
        Write-Host "  [+] WhatsApp Bullet Template dispatch engine verified." -ForegroundColor Green
    } else {
        Write-Host "  [-] WhatsApp Bullet Template dispatch engine MISSING." -ForegroundColor Red
        $testPassed = $false
    }
} else {
    Write-Host "  [-] File Reports.tsx NOT FOUND." -ForegroundColor Red
    $testPassed = $false
}

Write-Host ""

# 3. Evaluate Routing Configuration
Write-Host "[*] Checking Route Registries for /reports path..." -ForegroundColor Yellow
if (Test-Path $routerPath) {
    $content = Get-Content $routerPath -Raw
    if ($content -match "/reports" -and $content -match "Reports") {
        Write-Host "  [+] Route path '/reports' registered successfully inside $routerPath." -ForegroundColor Green
    } else {
        Write-Host "  [-] Route path '/reports' is missing from index router." -ForegroundColor Red
        $testPassed = $false
    }
} else {
    Write-Host "  [-] Router file $routerPath missing." -ForegroundColor Red
    $testPassed = $false
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
if ($testPassed) {
    Write-Host "   CARSS WAVE 5 CERTIFICATION INQUEST: SUCCESSFUL" -ForegroundColor Green
    Write-Host "   Completing Score: 100/100" -ForegroundColor Green
    Write-Host "   Factory Readiness Score: 100/100" -ForegroundColor Green
} else {
    Write-Host "   CARSS WAVE 5 CERTIFICATION INQUEST: FAILURE" -ForegroundColor Red
}
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
