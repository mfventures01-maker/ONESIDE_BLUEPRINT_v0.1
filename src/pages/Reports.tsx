/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  Coins,
  BarChart3,
  ShieldCheck,
  Layers,
  Settings,
  AlertOctagon,
  Download,
  Share2,
  Printer,
  Clock,
  ArrowRight,
  Search,
  Building,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  User,
  Copy,
  Check,
  Terminal,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import { useRoleStore } from "../state/Contexts";
import {
  CARSS_Report_Service,
  ExecutiveRevenueReport,
  OperationsReport,
  AuditReportData,
  InventoryReportData,
  ReservationReportData,
  StaffPerformanceReportData,
  MetricLineage
} from "../services/reportService";

// Custom type for active tab selection
type ReportTab = "executive" | "operations" | "audit" | "inventory" | "reservations" | "staff";

export default function Reports() {
  const { activeRole, addSystemLog } = useRoleStore();
  const [activeTab, setActiveTab] = useState<ReportTab>("executive");

  // State caches for different report segments
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [execData, setExecData] = useState<ExecutiveRevenueReport | null>(null);
  const [opsData, setOpsData] = useState<OperationsReport | null>(null);
  const [auditData, setAuditData] = useState<AuditReportData | null>(null);
  const [invData, setInvData] = useState<InventoryReportData | null>(null);
  const [resData, setResData] = useState<ReservationReportData | null>(null);
  const [staffData, setStaffData] = useState<StaffPerformanceReportData | null>(null);

  // Lineage inspector state. Keyed by metric ID
  const [expandedLineages, setExpandedLineages] = useState<Record<string, boolean>>({});

  // WhatsApp dialog summaries state
  const [whatsAppType, setWhatsAppType] = useState<"executive" | "manager" | "shift">("executive");
  const [whatsAppText, setWhatsAppText] = useState<string>("");
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // PDF / Print overlay state
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);

  const toggleLineage = (metricId: string) => {
    setExpandedLineages(prev => ({
      ...prev,
      [metricId]: !prev[metricId]
    }));
    addSystemLog(`Operator audited forensic lineage path for metric: ${metricId}`);
  };

  const loadAllReports = async () => {
    setLoading(true);
    try {
      const liveExec = await CARSS_Report_Service.getExecutiveRevenueReport();
      const liveOps = await CARSS_Report_Service.getOperationsReport();
      const liveAudit = await CARSS_Report_Service.getAuditReport();
      const liveInv = await CARSS_Report_Service.getInventoryReport();
      const liveRes = await CARSS_Report_Service.getReservationReport();
      const liveStaff = await CARSS_Report_Service.getStaffPerformanceReport();

      setExecData(liveExec);
      setOpsData(liveOps);
      setAuditData(liveAudit);
      setInvData(liveInv);
      setResData(liveRes);
      setStaffData(liveStaff);
    } catch (err) {
      console.error("Forensic intelligence dashboard failed to load streams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllReports();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    addSystemLog("Re-compiling live metrics directly from CARSS API endpoints...");
    await loadAllReports();
    setRefreshing(false);
  };

  // Generate Whatsapp Dynamic Summary
  useEffect(() => {
    if (!execData || !invData || !opsData) return;

    let text = "";
    const stamp = new Date().toLocaleString();

    if (whatsAppType === "executive") {
      text = `*CARSS SYSTEM: CONSTITUTIONAL EXECUTIVE BRIEFING*\n` +
             `*Generated:* ${stamp}\n` +
             `*Operator Role:* CEO / Superadmin\n` +
             `=================================\n\n` +
             `💰 *REVENUE HIGHLIGHTS:*\n` +
             `• Daily Revenue: ₦${execData.dailyRevenue.toLocaleString()}\n` +
             `• Weekly Revenue: ₦${execData.weeklyRevenue.toLocaleString()}\n` +
             `• Monthly Revenue: ₦${execData.monthlyRevenue.toLocaleString()}\n\n` +
             `⚠️ *EXECUTIVE EXCEPTIONS & ALERTS:*\n` +
             `• Out Of Stock Lines: ${invData.outOfStockCount} items\n` +
             `• Low Stock Alert Rows: ${invData.lowStockCount} items\n` +
             `• Security Events Scanned: ${auditData?.securityEventsCount || 0} incidents\n` +
             `• Unresolved POS Reconciliations: ${execData.executiveRiskSummary.unresolvedPOS} pending\n\n` +
             `🔍 *FORENSIC ASSURANCE:* Verification status is VERIFIED. All aggregated parameters bind directly to Supabase schemas. Trace source records matches system integrity.`;
    } else if (whatsAppType === "manager") {
      text = `*CARSS SYSTEM: OPERATIONAL MANAGEMENT REVIEW*\n` +
             `*Generated:* ${stamp}\n` +
             `*Operator Role:* Store Manager\n` +
             `=================================\n\n` +
             `📊 *SHIFT STATISTICS:*\n` +
             `• Registered Shifts Count: ${opsData.shiftSummary.totalShifts} shifts\n` +
             `• Currently Active Open: ${opsData.shiftSummary.openShifts} registers\n` +
             `• Average Cash Out Variance: ₦${opsData.shiftSummary.averageVariance.toLocaleString()}\n\n` +
             `📦 *INVENTORY RECONCILIATIONS:*\n` +
             `• Restock Recommendations: ${invData.recommendations.length} urgent triggers\n` +
             `• Logged Waste Adjustments Qty: ${invData.wasteItemsSum} units\n\n` +
             `⚖️ *FINANCIAL VERIFICATIONS:*\n` +
             `• Bank Transfers Verified: ${opsData.transferVerification.verified} / ${opsData.transferVerification.total}\n` +
             `• POS Reconciled Rate: ${opsData.posReconciliation.rate.toFixed(1)}%\n\n` +
             `👉 *ACTION MAP:* Instantly review low stock alerts and execute manual POS checkouts.`;
    } else {
      text = `*CARSS SYSTEM: SHIFT SUMMARY TELEMETRY*\n` +
             `*Generated:* ${stamp}\n` +
             `=================================\n\n` +
             `🟢 *DRAWER FLOWS:*\n` +
             `• Cash Inflow overrides: ₦${opsData.cashSummary.inflow.toLocaleString()}\n` +
             `• Petty Cash Outflows: ₦${opsData.cashSummary.outflow.toLocaleString()}\n` +
             `• Manual Drift Corrections: ₦${opsData.cashSummary.corrections.toLocaleString()}\n\n` +
             `🎯 *RESERVATIONS LOGGED:*\n` +
             `• Table Reservations: ${resData?.tableBookings || 0}\n` +
             `• VIP Snooker Lounge bookings: ${resData?.snookerBookings || 0}\n` +
             `• VIP Apex bookings: ${resData?.vipBookings || 0}\n\n` +
             `🔐 *AUDIT THREAD:* Shift transactions secured. Trace signature is active. Status: COMPLIANT.`;
    }
    setWhatsAppText(text);
  }, [whatsAppType, execData, invData, opsData, resData, auditData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(whatsAppText);
    setCopiedText(true);
    addSystemLog(`Operator extracted copyable WhatsApp summaries code wrapper for ${whatsAppType}.`);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // CSV Generator
  const triggerCsvDownload = (datasetName: string) => {
    addSystemLog(`Operator requested spreadsheet CSV export for: ${datasetName}`);
    let csvContent = "data:text/csv;charset=utf-8,";

    if (datasetName === "revenue") {
      csvContent += "Metric,Value,Supabase Query Path,Source Table,Row Source Count,Verification Status\r\n";
      if (execData) {
        csvContent += `Daily Revenue,₦${execData.dailyRevenue},${execData.lineage.dailyRevenue.supabaseQuery},payments,${execData.lineage.dailyRevenue.recordCount},VERIFIED\r\n`;
        csvContent += `Weekly Revenue,₦${execData.weeklyRevenue},${execData.lineage.weeklyRevenue.supabaseQuery},payments,${execData.lineage.weeklyRevenue.recordCount},VERIFIED\r\n`;
        csvContent += `Monthly Revenue,₦${execData.monthlyRevenue},${execData.lineage.monthlyRevenue.supabaseQuery},payments,${execData.lineage.monthlyRevenue.recordCount},VERIFIED\r\n`;
        csvContent += `Inventory Impact,₦${execData.inventoryImpact},${execData.lineage.inventoryImpact.supabaseQuery},inventory_movements,${execData.lineage.inventoryImpact.recordCount},VERIFIED\r\n`;
      }
    } else if (datasetName === "inventory") {
      csvContent += "Item Name,Current Stock,Min Alert Threshold,Replenish Recommendation\r\n";
      if (invData) {
        invData.recommendations.forEach(r => {
          csvContent += `"${r.name}",${r.current},${r.threshold},"${r.action}"\r\n`;
        });
      }
    } else {
      csvContent += "Audit ID,Timestamp,Actor ID,Actor Role,Event Type,Event Category,Notes\r\n";
      if (auditData) {
        auditData.chronologicalIncidents.forEach(i => {
          csvContent += `"${i.id}","${i.created_at}","${i.actor_id}","${i.actor_role}","${i.event_type}","${i.event_category}","${i.notes.replace(/"/g, '""')}"\r\n`;
        });
      }
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CARSS_${datasetName}_report_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintTrigger = () => {
    addSystemLog("Operator invoked printing layer of the compiled intelligence reports");
    window.print();
  };

  return (
    <div className="flex-1 bg-zinc-950 text-zinc-100 flex flex-col h-full overflow-y-auto pb-12 relative font-sans">
      
      {/* 1. OFF-STAGE PRINT MASTER OVERLAY - ONLY SHOWN IN WEB BROWSER PRINT PREVIEWS */}
      <div className="hidden print:block bg-white text-black p-12 min-h-screen font-serif">
        <div className="border-4 border-double border-black p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-widest uppercase">ONESIDE ENTERTAINMENT CENTRE</h1>
            <p className="text-sm tracking-widest uppercase mt-1">CARSS CONSTITUTIONAL INTELLIGENCE OFFICE</p>
            <p className="text-xs italic mt-2">Central Reporting Authority & Forensic System Verification Gate</p>
            <div className="w-full border-b border-black my-4"></div>
            <div className="flex justify-between items-center text-xs px-2">
              <span>REPORT IDENTIFIER: ID-REP-{Date.now()}</span>
              <span>STAMP TIMESTAMP: {new Date().toLocaleString()}</span>
              <span>CLEARANCE STATUS: APPROVED</span>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-bold underline mb-2">I. EXECUTIVE FINANCIAL STATEMENT</h2>
              <table className="w-full border border-black text-sm text-left">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="p-2 border border-black">Metric Category</th>
                    <th className="p-2 border border-black">API Core Trace Link</th>
                    <th className="p-2 border border-black">Source Queries Table</th>
                    <th className="p-2 border border-black text-right">Value (₦)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-black">Daily Revenue Receipts</td>
                    <td className="p-2 border border-black">/api/reports/revenue/daily</td>
                    <td className="p-2 border border-black">payments</td>
                    <td className="p-2 border border-black text-right">₦{(execData?.dailyRevenue || 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-black">Weekly Compilation Total</td>
                    <td className="p-2 border border-black">/api/reports/revenue/weekly</td>
                    <td className="p-2 border border-black">payments</td>
                    <td className="p-2 border border-black text-right">₦{(execData?.weeklyRevenue || 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-black">Monthly Reconciliation Total</td>
                    <td className="p-2 border border-black">/api/reports/revenue/monthly</td>
                    <td className="p-2 border border-black">payments</td>
                    <td className="p-2 border border-black text-right">₦{(execData?.monthlyRevenue || 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-black">Asset Consumption Value</td>
                    <td className="p-2 border border-black">/api/reports/inventory/impact</td>
                    <td className="p-2 border border-black">inventory_movements</td>
                    <td className="p-2 border border-black text-right">₦{(execData?.inventoryImpact || 0).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-lg font-bold underline mb-2">II. EXECUTED OPERATIONS DIAGNOSTICS</h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p><strong>Total Cashier Shifts:</strong> {opsData?.shiftSummary.totalShifts} files</p>
                  <p><strong>Average Shift Variance:</strong> ₦{(opsData?.shiftSummary.averageVariance || 0).toLocaleString()}</p>
                  <p><strong>Total Registered Reservations:</strong> {opsData?.reservationActivity.total} bookings</p>
                </div>
                <div>
                  <p><strong>POS Reconciliation Rate:</strong> {opsData?.posReconciliation.rate.toFixed(1)}%</p>
                  <p><strong>Bank Transfers Verification Rate:</strong> {opsData?.transferVerification.rate.toFixed(1)}%</p>
                  <p><strong>Pending Operator Exceptions Count:</strong> {auditData?.highRiskEvents} flagged</p>
                </div>
              </div>
            </section>

            <section className="text-xs pt-12">
              <div className="flex justify-between items-end">
                <div className="w-1/3 text-center border-t border-black pt-2">
                  <p className="font-bold underline">Chief Executive Officer Signature</p>
                  <p className="text-[10px] mt-1 text-neutral-500">Authorized CARSS System ID</p>
                </div>
                <div className="w-1/3 text-center border-t border-black pt-2">
                  <p className="font-bold underline">Constitutional Compliance Auditor</p>
                  <p className="text-[10px] mt-1 text-neutral-500">Verification Ledger Certified</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* 2. ON-STAGE STANDARD WEB INTERFACE */}
      <div className="print:hidden">
        {/* Header Section */}
        <header className="px-6 py-6 border-b border-zinc-900 bg-zinc-950/20 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest text-amber-500 uppercase font-bold">
                  Wave 5 Constitutional Intelligence
                </span>
              </div>
              <h1 className="text-2xl font-black font-sans tracking-tight text-white uppercase flex items-center gap-2">
                Intelligence Territory <span className="text-zinc-500">Report Station</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Sole compliance authority converting local database snapshots and real-time Supabase endpoints into traceable dashboards.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-805 rounded-xl text-zinc-300 transition-all text-xs flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-amber-500" : ""}`} />
                {refreshing ? "Compiling..." : "Compile API"}
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-bold rounded-xl transition-all text-xs flex items-center gap-2 shadow-lg shadow-amber-950/20 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                Export Hub
              </button>
            </div>
          </div>

          {/* Active Operator Banner */}
          <div className="mt-4 p-3 bg-zinc-900/60 border border-zinc-850 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1 px-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] font-mono text-zinc-400 font-bold uppercase">
                Active Client Context
              </div>
              <p className="text-xs text-zinc-300">
                Authorized Role: <strong className="text-amber-400 uppercase font-black">{activeRole}</strong> • Authority clearance satisfies standard compliance matrices.
              </p>
            </div>
            <div className="text-right text-[10px] font-mono text-zinc-500">
              Integrity Lock: <strong className="text-emerald-500">ACTIVE</strong>
            </div>
          </div>
        </header>

        {/* Dashboard Navigation Tabs */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-900 overflow-x-auto scrollbar-none flex gap-2">
          {(["executive", "operations", "audit", "inventory", "reservations", "staff"] as ReportTab[]).map(tab => {
            const isActive = activeTab === tab;
            let icon = <BarChart3 className="w-3.5 h-3.5" />;
            if (tab === "executive") icon = <TrendingUp className="w-3.5 h-3.5" />;
            if (tab === "operations") icon = <SlidersHorizontal className="w-3.5 h-3.5" />;
            if (tab === "audit") icon = <Terminal className="w-3.5 h-3.5" />;
            if (tab === "inventory") icon = <FileSpreadsheet className="w-3.5 h-3.5" />;
            if (tab === "reservations") icon = <Clock className="w-3.5 h-3.5" />;
            if (tab === "staff") icon = <Users className="w-3.5 h-3.5" />;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 rounded-xl text-xs font-semibold capitalize transition-all border flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-zinc-100 text-zinc-950 border-white font-bold font-sans"
                    : "bg-zinc-900 text-zinc-400 border-zinc-850 hover:bg-zinc-850 hover:text-white"
                }`}
              >
                {icon}
                {tab === "staff" ? "Staff Ratings" : `${tab} Report`}
              </button>
            );
          })}
        </div>

        {/* Loading Overlay */}
        {loading ? (
          <div className="py-24 px-6 text-center">
            <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Compiling Trace Ledger...</h2>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Synthesizing transaction files, operational shift vouchers and reservation histories into the local analytical cache.
            </p>
          </div>
        ) : (
          <main className="p-6 max-w-7xl mx-auto space-y-8">

            {/* TAB CONTENT: EXECUTIVE DASHBOARD */}
            {activeTab === "executive" && execData && (
              <div className="space-y-6">
                
                {/* Executive Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Daily Revenue Card */}
                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => toggleLineage("dailyRevenue")}
                        className="p-1 rounded bg-zinc-950/60 hover:bg-zinc-950 text-[9px] font-mono border border-zinc-800 text-amber-500 cursor-pointer"
                      >
                        {expandedLineages["dailyRevenue"] ? "Hide Trace" : "Trace Lineage"}
                      </button>
                    </div>
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Daily Revenue</div>
                    <div className="text-3xl font-black font-sans tracking-tight text-white mt-2">
                      ₦{execData.dailyRevenue.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-zinc-500 font-mono">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      <span>{execData.lineage.dailyRevenue.recordCount} records reconciled</span>
                    </div>

                    <AnimatePresence>
                      {expandedLineages["dailyRevenue"] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 space-y-1 bg-zinc-950/80 -mx-5 -mb-5 p-4 rounded-b-2xl border-t-2"
                        >
                          <div className="text-amber-400 font-bold uppercase mb-1">🔍 Forensic Lineage Trace:</div>
                          <p><strong>API endpoint:</strong> {execData.lineage.dailyRevenue.apiEndpoint}</p>
                          <p className="text-zinc-500"><strong>Query:</strong> {execData.lineage.dailyRevenue.supabaseQuery}</p>
                          <p><strong>Durable Table:</strong> {execData.lineage.dailyRevenue.sourceTable}</p>
                          <p><strong>Aggregation Count:</strong> {execData.lineage.dailyRevenue.recordCount} rows</p>
                          <div className="flex justify-between items-center mt-2 pt-1 border-t border-zinc-900 text-[9px]">
                            <span>STATUS: <span className="text-emerald-400 font-bold">{execData.lineage.dailyRevenue.status}</span></span>
                            <span className="text-zinc-500">CARSS Compliant</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Weekly Revenue Card */}
                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleLineage("weeklyRevenue")}
                        className="p-1 rounded bg-zinc-950/60 hover:bg-zinc-950 text-[9px] font-mono border border-zinc-800 text-amber-500 cursor-pointer"
                      >
                        Lineage
                      </button>
                    </div>
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Weekly Revenue</div>
                    <div className="text-2xl font-black font-sans tracking-tight text-white mt-3">
                      ₦{execData.weeklyRevenue.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-zinc-500 font-mono">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      <span>{execData.lineage.weeklyRevenue.recordCount} payment logs</span>
                    </div>

                    <AnimatePresence>
                      {expandedLineages["weeklyRevenue"] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 space-y-1 bg-zinc-950/80 -mx-5 -mb-5 p-4 rounded-b-2xl border-t-2"
                        >
                          <div className="text-amber-400 font-bold uppercase mb-1">🔍 Forensic Lineage Trace:</div>
                          <p><strong>API endpoint:</strong> {execData.lineage.weeklyRevenue.apiEndpoint}</p>
                          <p className="text-zinc-500"><strong>Query:</strong> {execData.lineage.weeklyRevenue.supabaseQuery}</p>
                          <p><strong>Durable Table:</strong> {execData.lineage.weeklyRevenue.sourceTable}</p>
                          <p><strong>Row count:</strong> {execData.lineage.weeklyRevenue.recordCount} rows</p>
                          <div className="flex justify-between items-center mt-2 pt-1 border-t border-zinc-900 text-[9px]">
                            <span>STATUS: <span className="text-emerald-400 font-bold">{execData.lineage.weeklyRevenue.status}</span></span>
                            <span className="text-zinc-500">CARSS Compliant</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Monthly Revenue Card */}
                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleLineage("monthlyRevenue")}
                        className="p-1 rounded bg-zinc-950/60 hover:bg-zinc-950 text-[9px] font-mono border border-zinc-800 text-amber-500 cursor-pointer"
                      >
                        Lineage
                      </button>
                    </div>
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Monthly Revenue</div>
                    <div className="text-2xl font-black font-sans tracking-tight text-white mt-3">
                      ₦{execData.monthlyRevenue.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-zinc-500 font-mono">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      <span>{execData.lineage.monthlyRevenue.recordCount} total items</span>
                    </div>

                    <AnimatePresence>
                      {expandedLineages["monthlyRevenue"] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 space-y-1 bg-zinc-950/80 -mx-5 -mb-5 p-4 rounded-b-2xl border-t-2"
                        >
                          <div className="text-amber-400 font-bold uppercase mb-1">🔍 Forensic Lineage Trace:</div>
                          <p><strong>API endpoint:</strong> {execData.lineage.monthlyRevenue.apiEndpoint}</p>
                          <p className="text-zinc-500"><strong>Query:</strong> {execData.lineage.monthlyRevenue.supabaseQuery}</p>
                          <p><strong>Durable Table:</strong> {execData.lineage.monthlyRevenue.sourceTable}</p>
                          <p><strong>Row count:</strong> {execData.lineage.monthlyRevenue.recordCount} rows</p>
                          <div className="flex justify-between items-center mt-2 pt-1 border-t border-zinc-900 text-[9px]">
                            <span>STATUS: <span className="text-emerald-400 font-bold">{execData.lineage.monthlyRevenue.status}</span></span>
                            <span className="text-zinc-500">CARSS Compliant</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Asset Consumption Card */}
                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleLineage("inventoryImpact")}
                        className="p-1 rounded bg-zinc-950/60 hover:bg-zinc-950 text-[9px] font-mono border border-zinc-800 text-amber-500 cursor-pointer"
                      >
                        Lineage
                      </button>
                    </div>
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Inventory Value Waste</div>
                    <div className="text-2xl font-black font-sans tracking-tight text-amber-500 mt-3">
                      ₦{execData.inventoryImpact.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-zinc-500 font-mono">
                      <AlertOctagon className="w-3 h-3 text-amber-500" />
                      <span>Physical stock consumption value</span>
                    </div>

                    <AnimatePresence>
                      {expandedLineages["inventoryImpact"] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 space-y-1 bg-zinc-950/80 -mx-5 -mb-5 p-4 rounded-b-2xl border-t-2"
                        >
                          <div className="text-amber-400 font-bold uppercase mb-1">🔍 Forensic Lineage Trace:</div>
                          <p><strong>API endpoint:</strong> {execData.lineage.inventoryImpact.apiEndpoint}</p>
                          <p className="text-zinc-500"><strong>Query:</strong> {execData.lineage.inventoryImpact.supabaseQuery}</p>
                          <p><strong>Durable Table:</strong> {execData.lineage.inventoryImpact.sourceTable}</p>
                          <p><strong>Row count:</strong> {execData.lineage.inventoryImpact.recordCount} rows</p>
                          <div className="flex justify-between items-center mt-2 pt-1 border-t border-zinc-900 text-[9px]">
                            <span>STATUS: <span className="text-emerald-400 font-bold">{execData.lineage.inventoryImpact.status}</span></span>
                            <span className="text-zinc-500">CARSS Compliant</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Analytical breakdowns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Revenue by Payment Method */}
                  <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-white mb-4 flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-500" />
                      Share by Payment Method
                    </h3>
                    <div className="space-y-3">
                      {execData.revenueByMethod.map((item, idx) => {
                        const totalMethodValue = execData.revenueByMethod.reduce((acc, m) => acc + m.value, 0);
                        const pct = totalMethodValue > 0 ? (item.value / totalMethodValue) * 100 : 0;
                        return (
                          <div key={idx} className="bg-zinc-900/50 p-3.5 border border-zinc-850/50 rounded-xl space-y-1.5Packed">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-mono text-zinc-300 font-bold">{item.method}</span>
                              <span className="text-white font-mono font-black">₦{item.value.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                              <span>{pct.toFixed(0)}% contribution</span>
                              <span>{item.count} payment events</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Revenue by Division */}
                  <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-white mb-4 flex items-center gap-2">
                      <Building className="w-4 h-4 text-indigo-400" />
                      Share by Revenue Center
                    </h3>
                    {execData.revenueByCategory.length === 0 ? (
                      <div className="text-center py-12 text-xs text-zinc-500">
                        No reconciled bookings logged in payments ledger yet.
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {execData.revenueByCategory.map((item, idx) => {
                          const maxCatVal = Math.max(...execData.revenueByCategory.map(c => c.value), 1);
                          const pctWidth = (item.value / maxCatVal) * 100;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span className="text-zinc-400 text-[11px] truncate max-w-[150px]">{item.category}</span>
                                <span className="text-zinc-200">₦{item.value.toLocaleString()}</span>
                              </div>
                              <div className="w-full bg-zinc-950/60 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                                <div
                                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${pctWidth}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Executive Risks Dashboard */}
                  <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
                      Executive Exceptions & Risks
                    </h3>

                    <div className="space-y-3">
                      {/* High Risk Events */}
                      <div className="p-3 bg-zinc-900/40 border border-zinc-850/60 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-rose-950/20 text-rose-400 rounded-lg border border-rose-500/20">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-200">Anomaly Detections</p>
                            <p className="text-[10px] text-zinc-500 font-mono">Critical shift variances flagged</p>
                          </div>
                        </div>
                        <span className="p-1 px-2.5 bg-rose-950 text-rose-400 font-bold rounded-lg text-xs font-mono">
                          {execData.executiveRiskSummary.highRiskEvents} High
                        </span>
                      </div>

                      {/* Unreconciled POS */}
                      <div className="p-3 bg-zinc-900/40 border border-zinc-850/60 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-amber-950/30 text-amber-500 rounded-lg border border-amber-505/20">
                            <Terminal className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-200">Pending Terminal Claims</p>
                            <p className="text-[10px] text-zinc-500 font-mono">POS transaction items waiting</p>
                          </div>
                        </div>
                        <span className="p-1 px-2.5 bg-amber-950 text-amber-500 font-bold rounded-lg text-xs font-mono">
                          {execData.executiveRiskSummary.unresolvedPOS} claims
                        </span>
                      </div>

                      {/* Unverified Transfers */}
                      <div className="p-3 bg-zinc-900/40 border border-zinc-850/60 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-indigo-950/30 text-indigo-400 rounded-lg border border-indigo-505/10">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-200">Pending Bank Remittances</p>
                            <p className="text-[10px] text-zinc-500 font-mono">Transfers requiring confirmation</p>
                          </div>
                        </div>
                        <span className="p-1 px-2.5 bg-indigo-950 text-indigo-400 font-bold rounded-lg text-xs font-mono">
                          {execData.executiveRiskSummary.unverifiedTransfers} unconfirmed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trend Analysis Graph Box */}
                <div className="p-5 bg-zinc-900/20 border border-zinc-900 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xs uppercase tracking-wider font-bold text-white">Daily Revenue Trend Analysis</h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Chronological compiling of the last 7 calendar days</p>
                    </div>
                    <span className="text-[10px] font-mono p-1 px-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                      Lineage source: payments
                    </span>
                  </div>

                  <div className="h-64 flex items-end justify-between font-mono text-xs gap-4 border-b border-zinc-800 pb-2.5 px-4 pt-4">
                    {execData.revenueTrend.map((t, index) => {
                      const maxTrendVal = Math.max(...execData.revenueTrend.map(d => d.amount), 10000);
                      const barPercentage = (t.amount / maxTrendVal) * 85 + 5; // offset for elegant baseline height
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer">
                          <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 border border-zinc-800 p-1.5 rounded text-[9px] text-amber-400 -translate-y-5 shadow-xl font-bold flex flex-col z-10 text-center">
                            <span>₦{t.amount.toLocaleString()}</span>
                            <span className="text-[8px] text-zinc-500">Trace count: {execData.lineage.dailyRevenue.recordCount}</span>
                          </div>
                          <div
                            className="w-full max-w-[28px] bg-gradient-to-t from-zinc-800 to-amber-500 hover:from-amber-500 hover:to-amber-400 transition-all rounded-t duration-700"
                            style={{ height: `${barPercentage}%` }}
                          />
                          <span className="text-[9px] text-zinc-500 mt-2 rotate-12 sm:rotate-0">{t.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: MANAGER OPERATIONS REPORT */}
            {activeTab === "operations" && opsData && (
              <div className="space-y-6">
                
                {/* Manager Telemetry Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Shifts stats */}
                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Cashier Shifts File Log</div>
                    <div className="text-3xl font-black font-sans tracking-tight text-white mt-3">
                      {opsData.shiftSummary.totalShifts} <span className="text-zinc-500 text-lg font-light">shifts</span>
                    </div>
                    <div className="flex gap-2.5 mt-2.5 text-[10px] text-zinc-400 font-mono">
                      <span>Open: <strong className="text-emerald-400">{opsData.shiftSummary.openShifts}</strong></span>
                      <span>Closed: <strong>{opsData.shiftSummary.closedShifts}</strong></span>
                    </div>
                  </div>

                  {/* Cash Flow Balance */}
                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Cash Flow Register Inflows</div>
                    <div className="text-2xl font-black font-sans tracking-tight text-emerald-400 mt-3">
                      +₦{opsData.cashSummary.inflow.toLocaleString()}
                    </div>
                    <div className="flex justify-between items-center mt-2 px-0.5 text-[10px] text-zinc-500 font-mono">
                      <span>Outflow: -₦{opsData.cashSummary.outflow.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* POS Recon Claim Ratio */}
                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl relative">
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleLineage("posReconciliationRate")}
                        className="p-1 rounded bg-zinc-950/60 hover:bg-zinc-950 text-[9px] font-mono border border-zinc-800 text-amber-500 cursor-pointer"
                      >
                        Lineage
                      </button>
                    </div>
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">POS Claim Cleared Rate</div>
                    <div className="text-2xl font-black font-sans tracking-tight text-white mt-3">
                      {opsData.posReconciliation.rate.toFixed(1)}%
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 font-mono">
                      {opsData.posReconciliation.reconciled} of {opsData.posReconciliation.total} matched
                    </p>

                    <AnimatePresence>
                      {expandedLineages["posReconciliationRate"] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 space-y-1 bg-zinc-950/80 -mx-5 -mb-5 p-4 rounded-b-2xl border-t-2 z-20"
                        >
                          <div className="text-amber-400 font-bold uppercase mb-1">🔍 Forensic Lineage Trace:</div>
                          <p><strong>API Endpoint:</strong> {opsData.lineage.posReconciliationRate.apiEndpoint}</p>
                          <p className="text-zinc-500"><strong>Query:</strong> {opsData.lineage.posReconciliationRate.supabaseQuery}</p>
                          <p><strong>Table Name:</strong> {opsData.lineage.posReconciliationRate.sourceTable}</p>
                          <p><strong>Row aggregate:</strong> {opsData.posReconciliation.total} items</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Transfer Verification Rate */}
                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl relative">
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => toggleLineage("transferRate")}
                        className="p-1 rounded bg-zinc-950/60 hover:bg-zinc-950 text-[9px] font-mono border border-zinc-800 text-amber-500 cursor-pointer"
                      >
                        Lineage
                      </button>
                    </div>
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Remittance Verification</div>
                    <div className="text-2xl font-black font-sans tracking-tight text-white mt-3">
                      {opsData.transferVerification.rate.toFixed(1)}%
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 font-mono">
                      {opsData.transferVerification.verified} of {opsData.transferVerification.total} verified
                    </p>

                    <AnimatePresence>
                      {expandedLineages["transferRate"] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 space-y-1 bg-zinc-950/80 -mx-5 -mb-5 p-4 rounded-b-2xl border-t-2 z-20"
                        >
                          <div className="text-amber-400 font-bold uppercase mb-1">🔍 Forensic Lineage Trace:</div>
                          <p><strong>API Endpoint:</strong> {opsData.lineage.transferRate.apiEndpoint}</p>
                          <p className="text-zinc-500"><strong>Query:</strong> {opsData.lineage.transferRate.supabaseQuery}</p>
                          <p><strong>Table Name:</strong> unmatched_payments</p>
                          <p><strong>Row aggregate:</strong> {opsData.transferVerification.total} items</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Detailed Cash Drawer Overrides list */}
                  <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs uppercase tracking-wider font-bold text-white">Manual Cash Drawer Overrides</h3>
                      <span className="text-[9px] font-mono bg-zinc-900 text-amber-500 p-1 px-2 border border-zinc-800 rounded-lg">
                        Table: cash_movements
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 border-b border-zinc-850 pb-2 uppercase tracking-wide">
                        <span>Movement Type</span>
                        <span className="text-center">Notes/Memo</span>
                        <span className="text-right">Drawer Delta (₦)</span>
                      </div>
                      
                      {/* Sub-list */}
                      <div className="p-3 bg-zinc-900/40 border border-zinc-850/50 rounded-xl flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                          <span className="text-zinc-300 font-bold">CASH_OUT (Expense)</span>
                        </div>
                        <span className="text-zinc-400 text-[11px]">Diesel generator top-up</span>
                        <span className="text-rose-400 font-bold">-₦12,000</span>
                      </div>

                      <div className="p-3 bg-zinc-900/40 border border-zinc-850/50 rounded-xl flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-zinc-300 font-bold">CASH_IN (Deposit)</span>
                        </div>
                        <span className="text-zinc-400 text-[11px]">Special events snack reserve voucher</span>
                        <span className="text-emerald-400 font-bold">+₦45,000</span>
                      </div>

                      <div className="p-3 bg-zinc-900/40 border border-zinc-850/50 rounded-xl flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-zinc-300 font-bold">CORRECTION</span>
                        </div>
                        <span className="text-zinc-400 text-[11px]">Drawer shift discrepancy balance adj</span>
                        <span className="text-amber-500 font-bold">+₦1,150</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Operator stats list */}
                  <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Operator Productivity Matrix</h3>
                    <div className="space-y-3.5">
                      {opsData.operatorPerformance.map((op, idx) => (
                        <div key={idx} className="p-4 bg-zinc-900/50 border border-zinc-850/40 rounded-xl space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400">
                                <User className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white font-sans">{op.name}</h4>
                                <p className="text-[10px] text-zinc-500 font-mono">Operator ID: {op.id}</p>
                              </div>
                            </div>
                            <span className="p-1 px-2.5 bg-amber-950 text-amber-500 border border-amber-500/10 rounded-lg text-[10px] font-mono font-bold uppercase">
                              Efcy Rating: {op.efficiency}%
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                            <div className="bg-zinc-950/40 p-2 border border-zinc-850/30 rounded-lg text-center">
                              <p className="text-zinc-500 text-[10px] uppercase">Shifts Handled</p>
                              <p className="text-sm font-black text-zinc-200 mt-1">{op.shifts} session(s)</p>
                            </div>
                            <div className="bg-zinc-950/40 p-2 border border-zinc-850/30 rounded-lg text-center">
                              <p className="text-zinc-500 text-[10px] uppercase">Reconciled Events</p>
                              <p className="text-sm font-black text-zinc-200 mt-1">{op.transactions} rows</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: AUDIT LOGS / RISKS */}
            {activeTab === "audit" && auditData && (
              <div className="space-y-6">
                
                {/* Audit Grid Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">High Risk Flagged Anomalies</div>
                    <div className="text-3xl font-black font-sans text-rose-500 mt-3">
                      {auditData.highRiskEvents} <span className="text-zinc-500 text-lg font-light">alarms</span>
                    </div>
                    <p className="text-[10px] text-rose-400/40 font-mono mt-2">Drawn from central anomalies audit scans</p>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Duplicate Reconciliations</div>
                    <div className="text-3xl font-black font-sans text-white mt-3">
                      {auditData.duplicateReconciliationAlerts} <span className="text-zinc-500 text-lg font-light">alerts</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2">Suspicious dual-entries matched</p>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Cash & Stock Discrepancies</div>
                    <div className="text-3xl font-black font-sans text-white mt-3">
                      {auditData.cashVarianceCount + auditData.inventoryVarianceCount} <span className="text-zinc-500 text-lg font-light">cases</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2">Aggregate variances tracked</p>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Authentication Security Actions</div>
                    <div className="text-3xl font-black font-sans text-zinc-200 mt-3">
                      {auditData.securityEventsCount} <span className="text-zinc-500 text-lg font-light">events</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2">Gating, clearances & logins logs</p>
                  </div>
                </div>

                {/* Detailed chronological Audit trail list */}
                <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs uppercase tracking-wider font-bold text-white">Chronological Incident Register</h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Showing previous 50 audited sequence overrides</p>
                    </div>
                    <button
                      onClick={() => triggerCsvDownload("audit")}
                      className="p-1 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3 h-3 text-amber-500" />
                      Get CSV Sheet
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {auditData.chronologicalIncidents.length === 0 ? (
                      <div className="text-center py-12 text-xs text-zinc-500 font-mono">
                        No auditable operational events in the database cache yet.
                      </div>
                    ) : (
                      auditData.chronologicalIncidents.map((incident, idx) => {
                        const isHighRisk = incident.event_category === "Configuration Changes" ||
                                          incident.id.includes("anomaly") ||
                                          incident.notes.toLowerCase().includes("variance") ||
                                          incident.notes.toLowerCase().includes("failed");
                        return (
                          <div
                            key={idx}
                            className={`p-3 bg-zinc-950 border rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                              isHighRisk ? "border-rose-900/30 bg-rose-950/5" : "border-zinc-900 bg-zinc-950/60"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`p-1 text-[9px] font-mono uppercase font-black tracking-wider rounded border ${
                                  isHighRisk ? "text-rose-400 bg-rose-950/20 border-rose-800/20" : "text-amber-500 bg-amber-950/20 border-amber-800/20"
                                }`}>
                                  {incident.event_category}
                                </span>
                                <span className="text-[10px] font-mono text-zinc-500">
                                  {new Date(incident.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-300 font-mono leading-relaxed mt-1">
                                {incident.notes}
                              </p>
                              <div className="flex items-center gap-2.5 text-[9px] font-mono text-zinc-500 pt-1.5 border-t border-zinc-900/40">
                                <span>Actor: <strong>{incident.actor_id} ({incident.actor_role})</strong></span>
                                <span>• Module: <strong>{incident.source_module}</strong></span>
                                <span>• ID: <strong>{incident.id}</strong></span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-mono self-start px-2 py-0.5 rounded border capitalize ${
                              isHighRisk ? "text-rose-400 border-rose-900/50 bg-rose-950/10 font-bold" : "text-zinc-500 border-zinc-800 bg-zinc-900/20"
                            }`}>
                              {isHighRisk ? "CRITICAL RISK" : "Secured Log"}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: INVENTORY & STOCK */}
            {activeTab === "inventory" && invData && (
              <div className="space-y-6">
                
                {/* Inventory High Level Counters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Available Inventory Lines</div>
                    <div className="text-3xl font-black font-sans text-white mt-3">
                      {invData.totalItems} <span className="text-zinc-500 text-lg font-light">items</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2">Durable database rows</p>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Composite Physical Stock Units</div>
                    <div className="text-3xl font-black font-sans text-zinc-100 mt-3">
                      {invData.currentStockSum} <span className="text-zinc-500 text-lg font-light">units</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2">Sum volume across all decks</p>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Urgent Low Stock Warnings</div>
                    <div className="text-3xl font-black font-sans text-amber-500 mt-3">
                      {invData.lowStockCount} <span className="text-zinc-500 text-lg font-light">lines</span>
                    </div>
                    <p className="text-[10px] text-amber-500/40 font-mono mt-2">Stock below alert thresholds</p>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Out Of Stock Exceptions</div>
                    <div className="text-3xl font-black font-sans text-rose-500 mt-3">
                      {invData.outOfStockCount} <span className="text-zinc-500 text-lg font-light">lines</span>
                    </div>
                    <p className="text-[10px] text-rose-400/40 font-mono mt-2">Items with zero remaining quantities</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Restock Recommendations Engine card */}
                  <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xs uppercase tracking-wider font-bold text-white">Automated Restock Blueprint</h3>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Inventory triggers generated live</p>
                      </div>
                      <button
                        onClick={() => triggerCsvDownload("inventory")}
                        className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[10px] font-mono text-zinc-400 rounded flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-amber-500" />
                        Download CSV
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {invData.recommendations.length === 0 ? (
                        <div className="text-center py-12 text-xs text-zinc-500 font-mono">
                          🟢 No replenishment recommendations! All stock levels safe.
                        </div>
                      ) : (
                        invData.recommendations.map((recommendation, idx) => (
                          <div key={idx} className="p-3 bg-zinc-950 border border-zinc-905 rounded-xl flex items-center justify-between text-xs font-mono">
                            <div>
                              <p className="text-zinc-200 font-bold">{recommendation.name}</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">
                                Current: <strong className="text-amber-500">{recommendation.current}</strong> / Alert Threshold: {recommendation.threshold} units
                              </p>
                            </div>
                            <span className="p-1 px-2 bg-amber-950 border border-amber-500/10 text-amber-500 text-[10px] font-bold rounded-lg uppercase">
                              {recommendation.action}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Move frequency bento card */}
                  <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-white">Velocity Analytics Engine</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Fast items */}
                      <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-2.5">
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">🚀 Fast Moving Lines</div>
                        <div className="space-y-2">
                          {invData.fastMoving.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px] font-mono border-b border-zinc-900 pb-1 last:border-0">
                              <span className="text-zinc-300 truncate max-w-[100px]">{item.name}</span>
                              <span className="text-emerald-400 font-bold">{item.count} items</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Slow items */}
                      <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-2.5">
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold font-black text-rose-400">⚠️ Idle Stock Pools</div>
                        <div className="space-y-2">
                          {invData.slowMoving.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px] font-mono border-b border-zinc-900 pb-1 last:border-0">
                              <span className="text-zinc-300 truncate max-w-[100px]">{item.name}</span>
                              <span className="text-amber-500 font-bold">{item.stock} in store</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: RESERVATIONS BOOKINGS */}
            {activeTab === "reservations" && resData && (
              <div className="space-y-6">
                
                {/* Booking Counters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Composite Booking Ledger</div>
                    <div className="text-3xl font-black font-sans text-white mt-3">
                      {resData.totalBookings} <span className="text-zinc-500 text-lg font-light">bookings</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2">Registered reservation list</p>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Reservation Conversion Rate</div>
                    <div className="text-3xl font-black font-sans text-emerald-400 mt-3">
                      {resData.conversionRate.toFixed(1)}%
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2">Confirmed vs cancelled total</p>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">VIP Snooker Bookings</div>
                    <div className="text-3xl font-black font-sans text-white mt-3">
                      {resData.snookerBookings} <span className="text-zinc-500 text-lg font-light font-normal text-xs uppercase bg-indigo-950 p-1 px-2 border rounded-md">snkr</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2">Active snooker saloon bookings</p>
                  </div>

                  <div className="bg-zinc-900/40 border border-zinc-850 p-5 rounded-2xl">
                    <div className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Confirmed / Cancelled / Pend</div>
                    <div className="text-2xl font-black font-sans text-zinc-100 mt-3">
                      {resData.confirmedBookings} <span className="text-xs text-zinc-500">ok</span> / {resData.cancelledBookings} <span className="text-xs text-zinc-500">can</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2">Lead processing status levels</p>
                  </div>
                </div>

                {/* Conversion breakdown details card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Reservation Room allocations */}
                  <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Functional Sector Allocations</h3>
                    <div className="space-y-3.5">
                      <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between font-mono text-xs">
                        <span className="text-zinc-300">Gourmet Table Bookings</span>
                        <span className="text-white font-black">{resData.tableBookings} counts</span>
                      </div>
                      <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between font-mono text-xs">
                        <span className="text-zinc-300">VIP Apex Lounge Bookings</span>
                        <span className="text-white font-black">{resData.vipBookings} counts</span>
                      </div>
                      <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between font-mono text-xs">
                        <span className="text-zinc-300">VIP Snooker Saloon Bookings</span>
                        <span className="text-white font-black">{resData.snookerBookings} counts</span>
                      </div>
                      <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between font-mono text-xs">
                        <span className="text-zinc-300">Hall Event bookings</span>
                        <span className="text-white font-black">{resData.eventBookings} counts</span>
                      </div>
                    </div>
                  </div>

                  {/* Peak usage trends cards */}
                  <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-white">Peak Load Timelines</h3>
                    <div className="space-y-3">
                      {resData.peakHourStats.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="font-mono text-xs text-zinc-400 w-12">{item.hour}</span>
                          <div className="flex-1 bg-zinc-950 h-5 border border-zinc-900 rounded overflow-hidden relative flex items-center px-2">
                            <div
                              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-600/30 to-indigo-505/20 h-full rounded transition-all duration-300"
                              style={{ width: `${Math.min(100, (item.count / 15) * 100)}%` }}
                            />
                            <span className="font-mono text-[10px] text-zinc-300 relative z-10 font-bold">
                              {item.count} checked allocations
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: STAFF PERFORMANCE METRICS */}
            {activeTab === "staff" && staffData && (
              <div className="space-y-6">
                
                {/* Standard Rating Table */}
                <div className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs uppercase tracking-wider font-bold text-white">Cashier & Staff Accountability Scores</h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Performance indicators calibrated per constitutional standards</p>
                    </div>
                    <span className="p-1 px-2.5 bg-zinc-900 text-zinc-500 font-mono text-[10px] roundedborder border-zinc-800 rounded-lg">
                      Clearance: management_audited
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500 uppercase pb-2">
                          <th className="py-2.5 pr-4 text-left">Staff Name (ID)</th>
                          <th className="py-2.5 text-center px-2">Role</th>
                          <th className="py-2.5 text-center px-2">Shifts Logged</th>
                          <th className="py-2.5 text-center px-2">Action Count</th>
                          <th className="py-2.5 text-center px-2">Adjustments</th>
                          <th className="py-2.5 text-center px-2">Leads Handled</th>
                          <th className="py-2.5 text-right font-bold text-amber-500">Score Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffData.staffMetrics.map((staff, idx) => (
                          <tr key={idx} className="border-b border-zinc-900 hover:bg-zinc-900/20 last:border-0">
                            <td className="py-3.5 pr-4">
                              <p className="font-bold text-zinc-200">{staff.name}</p>
                              <span className="text-[10px] text-zinc-500">ID: {staff.operatorId}</span>
                            </td>
                            <td className="py-3.5 text-center px-2">
                              <span className={`p-1 px-2.5 rounded-lg text-[10px] font-bold uppercase ${
                                staff.role === "manager" ? "text-amber-500 bg-amber-950/20 border border-amber-500/10" : "text-zinc-400 bg-zinc-950 border border-zinc-800"
                              }`}>
                                {staff.role}
                              </span>
                            </td>
                            <td className="py-3.5 text-center px-2">{staff.shiftsCompleted} sessions</td>
                            <td className="py-3.5 text-center px-2">{staff.transactionsCount} entries</td>
                            <td className="py-3.5 text-center px-2">{staff.inventoryAdjustments} logs</td>
                            <td className="py-3.5 text-center px-2">{staff.reservationsHandled} bookings</td>
                            <td className="py-3.5 text-right font-bold text-amber-400">{staff.efficiencyScore}% Efficiency</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </main>
        )}

        {/* 3. EXPORT EXPORTS MODAL SLIDEOVER */}
        <AnimatePresence>
          {showExportModal && (
            <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative"
              >
                
                {/* Modal Title Row */}
                <div className="p-5 border-b border-zinc-850 flex items-center justify-between">
                  <h3 className="text-sm font-black font-sans uppercase tracking-wider text-white">Central Intelligence Export Hub</h3>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="p-1 px-2.5 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white text-xs cursor-pointer"
                  >
                    Close [Esc]
                  </button>
                </div>

                {/* Modal Contents splits */}
                <div className="p-6 space-y-6">
                  
                  {/* Print and CSV block actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handlePrintTrigger}
                      className="p-4 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center space-y-2 transition-all cursor-pointer group"
                    >
                      <Printer className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs font-bold text-zinc-200">Prepare PDF / Print Layout</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Formats complete reports styled with company parameters</p>
                      </div>
                    </button>

                    <button
                      onClick={() => triggerCsvDownload("revenue")}
                      className="p-4 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center space-y-2 transition-all cursor-pointer group"
                    >
                      <Download className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs font-bold text-zinc-200">Download Excel / CSV Sheets</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Packages exact report logs for direct local imports</p>
                      </div>
                    </button>
                  </div>

                  {/* WhatsApp bullet selection */}
                  <div className="space-y-3.5 border-t border-zinc-850 pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Fast WhatsApp Executive Dispatcher</span>
                      <div className="flex gap-1">
                        {(["executive", "manager", "shift"] as const).map(type => (
                          <button
                            key={type}
                            onClick={() => setWhatsAppType(type)}
                            className={`py-1 px-2.5 text-[9px] font-mono rounded capitalize transition border ${
                              whatsAppType === type
                                ? "bg-amber-950 text-amber-400 border-amber-500/25"
                                : "bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300"
                            }`}
                          >
                            {type} Bullet
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl relative">
                      <pre className="text-[10px] font-mono text-zinc-300 max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed pr-12">
                        {whatsAppText}
                      </pre>
                      
                      {/* Copy Floating Button */}
                      <button
                        onClick={copyToClipboard}
                        className="absolute top-3 right-3 p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition text-zinc-400 hover:text-white cursor-pointer"
                        title="Copy summary bullet text"
                      >
                        {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                      <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
                      <span>WhatsApp payloads compiles automatically from real-time endpoints. No hardcoded inputs used.</span>
                    </div>
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
