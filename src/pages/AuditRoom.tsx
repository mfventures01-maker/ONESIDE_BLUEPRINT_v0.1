/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { 
  ShieldAlert, 
  Terminal, 
  Search, 
  Filter, 
  Calendar, 
  Trash2, 
  Users, 
  Layers, 
  Key, 
  Zap, 
  CheckCircle, 
  TrendingUp,
  Sliders,
  Sparkles,
  Info,
  Database,
  ArrowRight,
  User,
  ShieldAlert as AnomalyIcon,
  HelpCircle,
  FileCode,
  ShieldCheck
} from "lucide-react";
import { useRoleStore } from "../state/Contexts";
import { 
  ConstitutionalAuditService, 
  AnomalyLog 
} from "../services/auditService";
import { AuditEvent, EventCategoryType, RoleType } from "../types";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from "recharts";

type TabType = "timeline" | "anomalies" | "executive" | "manager" | "entity" | "database";

export default function AuditRoom() {
  const { activeRole, addSystemLog } = useRoleStore();
  
  // Auditing Feed States
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation & Categorized Tabs
  const [activeTab, setActiveTab] = useState<TabType>("timeline");
  
  // Rich Filter Engine
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategoryType | "all">("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<"all" | "today" | "yesterday" | "this_week" | "this_month">("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Timeline Replayer Selection row
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Entity Tracker Focus Parameters
  const [focusedOperator, setFocusedOperator] = useState("");
  const [focusedResourceType, setFocusedResourceType] = useState("");
  const [focusedResourceId, setFocusedResourceId] = useState("");

  // Fetch audit records and run anomaly scan interval
  const reloadAuditData = async () => {
    setLoading(true);
    try {
      const results = await ConstitutionalAuditService.getTimeline({
        search: searchTerm,
        eventCategory: selectedCategory !== "all" ? selectedCategory : undefined,
        role: selectedRole !== "all" ? selectedRole : undefined,
        timeRange: timeRange !== "all" ? timeRange : undefined,
        customStart: customStart || undefined,
        customEnd: customEnd || undefined,
        operatorId: focusedOperator || undefined,
        resourceType: focusedResourceType || undefined,
        resourceId: focusedResourceId || undefined
      });
      
      const computedAnoms = await ConstitutionalAuditService.detectAnomalies();
      
      setEvents(results);
      setAnomalies(computedAnoms);
    } catch (err) {
      console.error("Constitutional audit feed load issue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadAuditData();
  }, [
    searchTerm, 
    selectedCategory, 
    selectedRole, 
    timeRange, 
    customStart, 
    customEnd, 
    focusedOperator, 
    focusedResourceType, 
    focusedResourceId
  ]);

  // Handle immediate filters clearing
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedRole("all");
    setTimeRange("all");
    setCustomStart("");
    setCustomEnd("");
    setFocusedOperator("");
    setFocusedResourceType("");
    setFocusedResourceId("");
    addSystemLog("Operator flushed compliance filters inside central Audit Room.");
  };

  // Helper colors for Event Categories context indicators
  const getCategoryTheme = (cat: EventCategoryType) => {
    switch (cat) {
      case "Authentication":
        return { text: "text-amber-400 bg-amber-950/20 border-amber-500/10", tag: "AUTH" };
      case "Reservations":
        return { text: "text-indigo-400 bg-indigo-950/20 border-indigo-500/10", tag: "RES" };
      case "Payments":
        return { text: "text-emerald-400 bg-emerald-950/20 border-emerald-500/10", tag: "PAY" };
      case "POS":
        return { text: "text-sky-400 bg-sky-950/20 border-sky-505/10", tag: "POS" };
      case "Transfers":
        return { text: "text-violet-400 bg-violet-950/20 border-violet-500/10", tag: "XFER" };
      case "Cash Movements":
        return { text: "text-amber-500 bg-amber-950/15 border-amber-500/15", tag: "CASH" };
      case "Inventory":
      case "Stock Adjustments":
        return { text: "text-rose-400 bg-rose-950/20 border-rose-500/10", tag: "STCK" };
      case "Shifts":
        return { text: "text-yellow-400 bg-yellow-950/15 border-yellow-500/15", tag: "SHFT" };
      case "Reports":
        return { text: "text-cyan-400 bg-cyan-950/20 border-cyan-505/10", tag: "REPT" };
      case "System Events":
        return { text: "text-zinc-400 bg-zinc-950 border-zinc-800", tag: "SYS" };
      default:
        return { text: "text-amber-200 bg-zinc-900 border-zinc-800", tag: "GEN" };
    }
  };

  // Enforce precise Gating/Clearance Roles
  const isCEOCleared = ["superadmin", "ceo"].includes(activeRole);
  const isManagerCleared = ["superadmin", "ceo", "manager"].includes(activeRole);

  // Recharts aggregation metrics
  const getChartData = () => {
    const cats: Record<string, number> = {};
    events.forEach(e => {
      cats[e.event_category] = (cats[e.event_category] || 0) + 1;
    });
    return Object.keys(cats).map(key => ({
      name: key,
      value: cats[key]
    }));
  };

  const getOperatorsActivity = () => {
    const ops: Record<string, number> = {};
    events.forEach(e => {
      ops[e.actor_id] = (ops[e.actor_id] || 0) + 1;
    });
    return Object.keys(ops).map(k => ({
      operator: k,
      activityCount: ops[k]
    })).slice(0, 5);
  };

  const categoriesAggregate = getChartData();
  const operatorMetrics = getOperatorsActivity();

  // Premium Palette matching Gold & Charcoal tones
  const COLORS = ["#f59e0b", "#6366f1", "#10b981", "#06b6d4", "#ec4899", "#8b5cf6", "#a855f7"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* --- EXECUTIVE COGNITIONAL BANNER --- */}
        <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 relative overflow-hidden backdrop-blur">
          <div className="absolute top-0 right-0 w-96 h-48 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-bold">WAVE 4 SECURITY ASSURED</span>
              </div>
              <h3 className="text-xl font-bold font-mono tracking-tight text-white uppercase flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-amber-400" />
                <span>Constitutional Trust Audit Room</span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans max-w-2xl leading-relaxed mt-1">
                Real-time chronological replay engine tracking all transactional mutations, compliance checks, and cash variances. Zero-omission corporate traceability layer.
              </p>
            </div>

            {/* Quick Status Badges */}
            <div className="flex flex-wrap gap-2 text-right">
              <div className="bg-zinc-950 border border-zinc-850 px-3.5 py-2 rounded-xl text-left">
                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Online Sync State</div>
                <div className="text-xxs font-mono font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>PREPARED & LISTENING</span>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-850 px-3.5 py-2 rounded-xl text-left">
                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Active Ledgers</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">
                  {events.length} Events Logged
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-850 px-3.5 py-2 rounded-xl text-left">
                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Variance Scanner</div>
                <div className="text-xs font-mono font-bold text-rose-400 mt-0.5 flex items-center gap-1.5">
                  <span>{anomalies.length} Flagged</span>
                  {anomalies.length > 0 && <span className="w-2 h-2 rounded-full bg-red-505 animate-ping" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC PROTOCOL NAVIGATOR --- */}
        <div className="flex flex-wrap gap-1 bg-zinc-900/50 border border-zinc-850/60 p-1.5 rounded-2xl w-full">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition rounded-xl cursor-pointer ${
              activeTab === "timeline"
                ? "bg-amber-600 text-zinc-950 font-bold"
                : "text-zinc-400 hover:bg-zinc-855 hover:text-white"
            }`}
          >
            Trust Timeline
          </button>
          
          <button
            onClick={() => {
              setActiveTab("anomalies");
              addSystemLog("CEO requested live anomaly detection sweep.");
            }}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition rounded-xl relative cursor-pointer ${
              activeTab === "anomalies"
                ? "bg-amber-600 text-zinc-950 font-bold"
                : "text-zinc-400 hover:bg-zinc-855 hover:text-white"
            }`}
          >
            Anomaly Scanner
            {anomalies.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-[8px] font-bold text-white font-mono rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                {anomalies.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("executive");
              addSystemLog("Operator loading Executive Audit Room clearance state.");
            }}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition rounded-xl flex items-center gap-1.5 cursor-pointer ${
              activeTab === "executive"
                ? "bg-amber-600 text-zinc-950 font-bold"
                : !isCEOCleared
                ? "text-zinc-600 cursor-not-allowed"
                : "text-zinc-400 hover:bg-zinc-855 hover:text-white"
            }`}
            disabled={!isCEOCleared}
          >
            CEO Audit Room {!isCEOCleared && <span className="text-[8px] border border-zinc-700 text-zinc-600 px-1 rounded">LOCKED</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("manager");
              addSystemLog("Operator loading Manager Audit Room clearance state.");
            }}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition rounded-xl flex items-center gap-1.5 cursor-pointer ${
              activeTab === "manager"
                ? "bg-amber-600 text-zinc-950 font-bold"
                : !isManagerCleared
                ? "text-zinc-600 cursor-not-allowed"
                : "text-zinc-400 hover:bg-zinc-855 hover:text-white"
            }`}
            disabled={!isManagerCleared}
          >
            Manager Audit Room {!isManagerCleared && <span className="text-[8px] border border-zinc-700 text-zinc-600 px-1 rounded">LOCKED</span>}
          </button>

          <button
            onClick={() => setActiveTab("entity")}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition rounded-xl cursor-pointer ${
              activeTab === "entity"
                ? "bg-amber-600 text-zinc-950 font-bold"
                : "text-zinc-400 hover:bg-zinc-855 hover:text-white"
            }`}
          >
            Entity Tracer
          </button>

          <button
            onClick={() => setActiveTab("database")}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition rounded-xl ml-auto cursor-pointer ${
              activeTab === "database"
                ? "bg-zinc-800 text-amber-400 border border-amber-500/10"
                : "text-zinc-500 hover:bg-zinc-855 hover:text-zinc-300"
            }`}
          >
            SQL Schemas
          </button>
        </div>

        {/* --- CENTRAL AUDIT SEARCH ENGINE & FILTERS BLOCKS --- */}
        {activeTab !== "database" && (
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest border-b border-zinc-850 pb-2.5">
              <Sliders className="w-3.5 h-3.5 text-amber-500" />
              <span>Constitutional Query Engine Config</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Search input field */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Operator, note context, asset reference..."
                  className="w-full pl-9 h-10 bg-zinc-950 border border-zinc-850 focus:border-amber-500/40 rounded-xl font-mono text-xs text-white focus:outline-none transition resize-none"
                />
              </div>

              {/* Category filter option dropdown */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full h-10 bg-zinc-950 border border-zinc-850 focus:border-amber-500/45 rounded-xl font-mono text-xs text-zinc-300 px-3.5 uppercase focus:outline-none"
                >
                  <option value="all">Category: (All Fields)</option>
                  <option value="Authentication">Authentication</option>
                  <option value="Reservations">Reservations</option>
                  <option value="Payments">Payments</option>
                  <option value="POS">POS</option>
                  <option value="Transfers">Transfers</option>
                  <option value="Cash Movements">Cash Movements</option>
                  <option value="Stock Adjustments">Stock Adjustments</option>
                  <option value="Shifts">Shifts</option>
                  <option value="Reports">Reports</option>
                  <option value="System Events">System Events</option>
                </select>
              </div>

              {/* Role filter focus dropdown */}
              <div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full h-10 bg-zinc-950 border border-zinc-850 focus:border-amber-500/45 rounded-xl font-mono text-xs text-zinc-300 px-3.5 uppercase focus:outline-none"
                >
                  <option value="all">Clearance: (All Levels)</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="ceo">CEO</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff Member</option>
                  <option value="customer">Customer Access</option>
                </select>
              </div>

              {/* Fast Timeline selector */}
              <div>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="w-full h-10 bg-zinc-950 border border-zinc-850 focus:border-amber-500/45 rounded-xl font-mono text-xs text-zinc-300 px-3.5 uppercase focus:outline-none"
                >
                  <option value="all">Chrono Interval: (Forever)</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                </select>
              </div>
            </div>

            {/* Custom Chrono Calendar Range Picker & Tracers */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-zinc-850/50 mt-1">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Custom Chrono Deck:</span>
                </span>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="bg-zinc-950 border border-zinc-850 rounded-lg px-2 py-1 font-mono text-[11px] text-zinc-400 focus:outline-none focus:border-amber-500"
                />
                <span className="text-zinc-600 font-mono text-xs">to</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="bg-zinc-950 border border-zinc-850 rounded-lg px-2 py-1 font-mono text-[11px] text-zinc-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* If active target focuses exist, show indicators */}
              {(searchTerm || selectedCategory !== "all" || selectedRole !== "all" || timeRange !== "all" || customStart || customEnd || focusedOperator || focusedResourceType || focusedResourceId) && (
                <button
                  onClick={handleClearFilters}
                  className="text-xxs font-mono text-amber-500/80 hover:text-amber-400 flex items-center gap-2 border border-amber-500/20 bg-amber-500/5 px-3 py-1 rounded-lg uppercase tracking-wider transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Flush Query Filters</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- MAIN TAB 1: OPERATIONAL CHRONOLOGY TIMELINE ENGINE --- */}
        {activeTab === "timeline" && (
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h4 className="font-mono text-xs uppercase tracking-wider text-white">Trust Timeline Logs Feed</h4>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Synchronized Offline Ledger Feed</span>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center font-mono text-xs text-zinc-500 gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-505 animate-pulse" />
                <span>QUERYING CHRONOLOGY BOUNDS...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center font-mono text-xs text-zinc-500 space-y-2">
                <Info className="w-8 h-8 text-zinc-700" />
                <span>NO CORRESPONDING MEMORY RECORDS DETECTED IN ACTIVE SCOPE</span>
                <button 
                  onClick={handleClearFilters}
                  className="text-[10px] text-amber-500 hover:underline uppercase tracking-wide block mt-1"
                >
                  Clean query constraints
                </button>
              </div>
            ) : (
              <div className="border border-zinc-850 rounded-xl overflow-hidden divide-y divide-zinc-850/60">
                
                {/* Ledger Header Bar */}
                <div className="bg-zinc-950 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 grid grid-cols-12 p-3 h-10 items-center">
                  <div className="col-span-1">TAG</div>
                  <div className="col-span-2">TIMESTAMP</div>
                  <div className="col-span-2">ACTION TYPE</div>
                  <div className="col-span-2">ACTOR / ID</div>
                  <div className="col-span-3">AFFECTED RESOURCE</div>
                  <div className="col-span-1">CLEARANCE</div>
                  <div className="col-span-1 text-right">AUDIT</div>
                </div>

                {/* Ledger Body Rows */}
                {events.map((e) => {
                  const design = getCategoryTheme(e.event_category);
                  const isExpanded = expandedEventId === e.id;
                  
                  return (
                    <div 
                      key={e.id} 
                      className={`hover:bg-zinc-900/60 transition duration-150 ${isExpanded ? "bg-zinc-900/40" : ""}`}
                    >
                      <div 
                        onClick={() => setExpandedEventId(isExpanded ? null : e.id)}
                        className="p-3.5 grid grid-cols-12 font-mono text-xs items-center cursor-pointer select-none"
                      >
                        {/* TAG BADGE */}
                        <div className="col-span-1">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${design.text}`}>
                            {design.tag}
                          </span>
                        </div>

                        {/* TIMESTAMP */}
                        <div className="col-span-2 text-zinc-400 font-mono text-[11px]">
                          {new Date(e.created_at).toLocaleTimeString()}{" "}
                          <span className="text-[10px] text-zinc-500 block">
                            {new Date(e.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {/* ACTION */}
                        <div className="col-span-2 font-bold text-white tracking-tight uppercase text-[11px]">
                          {e.event_type.replace(":", " ▸ ")}
                        </div>

                        {/* ACTOR FIELD */}
                        <div className="col-span-2 text-zinc-300">
                          <button
                            onClick={(evt) => {
                              evt.stopPropagation();
                              setFocusedOperator(e.actor_id);
                              addSystemLog(`Query constrained by operator: ${e.actor_id}`);
                            }}
                            className="text-amber-400/90 font-bold hover:underline"
                          >
                            {e.actor_id}
                          </button>
                        </div>

                        {/* RESOURCE TARGET */}
                        <div className="col-span-3 truncate text-zinc-300 flex items-center gap-1.5 pr-2">
                          <button
                            onClick={(evt) => {
                              evt.stopPropagation();
                              setFocusedResourceType(e.resource_type);
                              setFocusedResourceId(e.resource_id);
                              addSystemLog(`Query constrained by resource target: ${e.resource_type}:${e.resource_id}`);
                            }}
                            className="hover:underline flex items-center gap-1 text-left truncate"
                          >
                            <span className="text-zinc-500 font-normal uppercase text-[9px]">[{e.resource_type}]</span>
                            <span className="text-zinc-200 truncate font-semibold">{e.resource_name}</span>
                          </button>
                        </div>

                        {/* ROLE CLEARANCE */}
                        <div className="col-span-1">
                          <span className="px-1.5 py-0.5 bg-zinc-950 text-zinc-500 rounded text-[9px] uppercase font-bold border border-zinc-850">
                            {e.actor_role}
                          </span>
                        </div>

                        {/* TOGGLE/OUTCOME BUTTON */}
                        <div className="col-span-1 text-right text-xs">
                          <span className="text-amber-500 font-mono text-xxs transition group-hover:text-amber-400 block p-1">
                            {isExpanded ? "Collapse ▲" : "Inspect ▼"}
                          </span>
                        </div>
                      </div>

                      {/* --- DETAILED INSPECTION BLOCK (PROVENANCE EVIDENCE) --- */}
                      {isExpanded && (
                        <div className="px-6 py-5 bg-zinc-950/80 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs animate-fade-in">
                          
                          {/* Info Column */}
                          <div className="space-y-3.5">
                            <div className="space-y-1 font-mono">
                              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Historical Narrative</div>
                              <p className="text-zinc-200 text-xs italic font-sans leading-relaxed">
                                "{e.notes || "No custom ledger narration supplied by emitter module."}"
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
                              <div>
                                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Module Origin</span>
                                <span className="text-zinc-300 font-mono text-[11px] uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">{e.source_module}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-zinc-505 font-mono uppercase block">Session Signature</span>
                                <span className="text-zinc-300 font-mono text-[11px] font-semibold">{e.session_id || "SYS-KNL-FALLBACK"}</span>
                              </div>
                              {e.shift_id && (
                                <div className="col-span-2">
                                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Shift Linkage ID</span>
                                  <span className="text-amber-400 font-mono text-[11px] font-bold tracking-tight">{e.shift_id}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Pre/Post State Transitions */}
                          <div className="space-y-3 font-mono">
                            <div>
                              <div className="text-[10.5px] text-zinc-500 uppercase tracking-widest flex items-center justify-between font-bold mb-1">
                                <span>Constitutional Transition State Payload</span>
                                <span className="text-[8.5px] bg-amber-600/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded-md">VERIFIED STATE</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                  <span className="text-[9.5px] text-zinc-600 uppercase tracking-wider block">Before State Representation</span>
                                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 h-28 overflow-y-auto text-[10.5px] text-amber-200/60 leading-relaxed font-mono">
                                    <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(e.before_state || "{}"), null, 2)}</pre>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-[9.5px] text-zinc-600 uppercase tracking-wider block">After State Outcome</span>
                                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 h-28 overflow-y-auto text-[10.5px] text-indigo-300/80 leading-relaxed font-mono">
                                    <pre className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(e.after_state || "{}"), null, 2)}</pre>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- MAIN TAB 2: COGNITIVE ANOMALY DETECTION SCANNER --- */}
        {activeTab === "anomalies" && (
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <AnomalyIcon className="w-5 h-5 text-red-505 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-400 animate-ping" />
                </div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-white">Integrity Anomaly Intelligence</h4>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider">SECURE SHIELD CONSTANT PATROLLER</span>
            </div>

            {anomalies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center font-mono">
                <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
                <span className="text-white text-xs font-bold uppercase tracking-wider">NO INTEGRITY VULNERABILITIES DISCOVERED</span>
                <p className="text-[10px] text-zinc-500 max-w-sm mt-1 leading-relaxed">
                  Drawer cash flows, stock counts, reconciliation records, and operator clearances balance perfectly in this timeframe. Integrity metrics is 100%.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Warning Summary Card */}
                <div className="bg-red-950/15 border border-red-500/15 rounded-xl p-4 flex gap-4 items-center">
                  <Info className="w-8 h-8 text-red-400 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-red-300 font-mono block uppercase">ATTENTION REQUIRED</span>
                    <p className="text-zinc-400 font-sans mt-0.5 leading-relaxed">
                      Our real-time analyzer isolated <span className="font-bold text-white font-mono">{anomalies.length} potential anomalies</span> in the current ledger intervals. Review immediately, and run security compliance actions to rectify.
                    </p>
                  </div>
                </div>

                {/* Anomalies List */}
                <div className="grid grid-cols-1 gap-3">
                  {anomalies.map((anom) => (
                    <div 
                      key={anom.id}
                      className={`p-4 bg-zinc-950 border rounded-xl flex gap-4 items-start shadow-xl transition-all duration-200 hover:border-red-500/30 ${
                        anom.severity === "high"
                          ? "border-red-500/15"
                          : "border-amber-500/15"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        anom.severity === "high"
                          ? "bg-red-950/25 border-red-500/15 text-red-400"
                          : "bg-amber-955/25 border-amber-500/15 text-amber-500"
                      }`}>
                        <AnomalyIcon className="w-4 h-4" />
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="font-mono text-xs font-bold text-white uppercase tracking-tight">
                            {anom.title}
                          </h5>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                            anom.severity === "high"
                              ? "bg-red-500/15 text-red-400 border border-red-500/20"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                          }`}>
                            {anom.severity} Risk
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                          {anom.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[9.5px] text-zinc-500 pt-1.5 border-t border-zinc-900 mt-1">
                          <span>Operator ID: <span className="text-zinc-300 underline font-semibold">{anom.operator_id}</span></span>
                          <span>•</span>
                          <span>Asset ID: <span className="text-zinc-300">{anom.resource_id}</span></span>
                          <span>•</span>
                          <span>Timestamp: <span className="text-zinc-400">{new Date(anom.timestamp).toLocaleTimeString()} {new Date(anom.timestamp).toLocaleDateString()}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- MAIN TAB 3: EXECUTIVE AUDIT ROOM (CEO CLEARANCE GATED) --- */}
        {activeTab === "executive" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Clearance Gating Safeguard */}
            {!isCEOCleared ? (
              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-12 text-center font-mono py-24">
                <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
                <span className="text-white text-sm font-bold uppercase tracking-wider block">CLEARANCE REJECTED</span>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  Executive rooms are exclusive to authorized Superadmin and CEO key holders. Elevate simulated security context roles to access.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Visual Analytics Header Ribbon */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Category share chart */}
                  <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between h-80">
                    <h5 className="font-mono text-xs uppercase tracking-wider text-zinc-300 border-b border-zinc-850 pb-2.5 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      <span>Ledger Categories Breakdown</span>
                    </h5>
                    
                    <div className="flex-1 w-full flex items-center justify-center py-2">
                      {categoriesAggregate.length === 0 ? (
                        <span className="text-xs text-zinc-600 font-mono uppercase">No telemetry found</span>
                      ) : (
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie
                              data={categoriesAggregate}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={65}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {categoriesAggregate.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a" }} 
                              itemStyle={{ color: "#f59e0b", fontFamily: "monospace", fontSize: "11px" }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 items-center justify-center text-[10px] font-mono text-zinc-500 border-t border-zinc-850 pt-2.5">
                      {categoriesAggregate.map((el, i) => (
                        <span key={el.name} className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          {el.name} ({el.value})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Active Operator Activity Level */}
                  <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between h-80">
                    <h5 className="font-mono text-xs uppercase tracking-wider text-zinc-300 border-b border-zinc-850 pb-2.5 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-400" />
                      <span>Operator Authority Shares</span>
                    </h5>

                    <div className="flex-1 w-full flex items-center justify-center py-2">
                      {operatorMetrics.length === 0 ? (
                        <span className="text-xs text-zinc-600 font-mono uppercase">No audit entries</span>
                      ) : (
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={operatorMetrics}>
                            <XAxis dataKey="operator" stroke="#71717a" fontSize={9} fontStyle="monospace" />
                            <YAxis stroke="#71717a" fontSize={9} fontStyle="monospace" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a" }}
                              labelStyle={{ color: "#a1a1aa", fontFamily: "monospace" }}
                            />
                            <Bar dataKey="activityCount" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                              {operatorMetrics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    
                    <span className="text-[10px] text-zinc-500 font-mono text-center border-t border-zinc-850 pt-2.5 block leading-relaxed">
                      Bar heights mapping logged protocol frequencies by actor ID.
                    </span>
                  </div>

                  {/* High Risk Control Desk */}
                  <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between h-80">
                    <h5 className="font-mono text-xs uppercase tracking-wider text-zinc-300 border-b border-zinc-850 pb-2.5 flex items-center gap-2">
                      <Key className="w-4 h-4 text-red-400" />
                      <span>Chief Policy Control Desk</span>
                    </h5>

                    <div className="flex-1 space-y-3.5 pt-3 overflow-y-auto pr-1">
                      <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-xl space-y-1 text-xs">
                        <span className="text-[9.5px] font-mono uppercase text-red-400 font-bold block">PROTOCOL CHECKOUT GUARD</span>
                        <p className="text-zinc-400 font-sans leading-relaxed">
                          All operational actions strictly emit telemetry verifying before/after system states. Clear local data below.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <button 
                          onClick={() => {
                            ConstitutionalAuditService.reseedSandbox();
                            reloadAuditData();
                            addSystemLog("CEO flushed and reseeded constitutional audit registries.");
                          }}
                          className="py-2 hover:bg-zinc-850 hover:text-white border border-zinc-800 rounded-lg text-[10.5px] font-mono text-yellow-500 transition cursor-pointer"
                        >
                          Reseed Sandbox
                        </button>

                        <button 
                          onClick={() => {
                            localStorage.setItem("carss_audit_events", "[]");
                            reloadAuditData();
                            addSystemLog("CEO requested emergency wipe command of all local audit streams.");
                          }}
                          className="py-2 hover:bg-red-950/20 hover:text-red-400 border border-red-900/10 rounded-lg text-[10.5px] font-mono text-zinc-500 transition cursor-pointer"
                        >
                          Emergency Wipe
                        </button>
                      </div>
                    </div>

                    <div className="text-[9.5px] text-zinc-600 font-mono text-center pt-2 border-t border-zinc-850/60 block uppercase leading-relaxed">
                      LOCKED SYSTEM LEVEL DIRECT PROTOCOLS
                    </div>
                  </div>
                </div>

                {/* CEO Gated Categorized Feeds */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Security Clearance logs */}
                  <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-red-400 border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <Key className="w-4 h-4 text-red-500 animate-pulse" />
                      <span>Security Protection Logs Feed (Clearance)</span>
                    </h4>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {events.filter(e => ["Authentication", "Shifts", "Configuration Changes"].includes(e.event_category)).length === 0 ? (
                        <div className="text-center font-mono text-zinc-600 text-[11px] py-10 uppercase">
                          No secure access events logged
                        </div>
                      ) : (
                        events
                          .filter(e => ["Authentication", "Shifts", "Configuration Changes"].includes(e.event_category))
                          .slice(0, 10)
                          .map((e, index) => (
                            <div key={index} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1 relative">
                              <span className="absolute top-2 right-3 text-[9px] text-zinc-600 font-mono uppercase">{new Date(e.created_at).toLocaleTimeString()}</span>
                              <div className="font-mono text-[9px] uppercase tracking-wider text-amber-500/85 font-semibold">
                                {e.actor_id} / [{e.actor_role}]
                              </div>
                              <p className="text-xs text-zinc-300 font-sans italic leading-relaxed">
                                {e.notes}
                              </p>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* High Value Revenue Log */}
                  <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-4">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-emerald-400 border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span>High Value Revenue Event Registry</span>
                    </h4>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {events.filter(e => ["Reservations", "Payments", "POS", "Transfers"].includes(e.event_category)).length === 0 ? (
                        <div className="text-center font-mono text-zinc-600 text-[11px] py-10 uppercase">
                          No revenue telemetry logged
                        </div>
                      ) : (
                        events
                          .filter(e => ["Reservations", "Payments", "POS", "Transfers"].includes(e.event_category))
                          .slice(0, 10)
                          .map((e, index) => (
                            <div key={index} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1 relative">
                              <span className="absolute top-2 right-3 text-[9px] text-zinc-600 font-mono uppercase">{new Date(e.created_at).toLocaleTimeString()}</span>
                              <div className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span>{e.event_type}</span>
                              </div>
                              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                                {e.notes}
                              </p>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- MAIN TAB 4: MANAGER AUDIT ROOM (OPERATIONS TAPS) --- */}
        {activeTab === "manager" && (
          <div className="space-y-6">
            
            {/* Clearance Gating Safeguard */}
            {!isManagerCleared ? (
              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-12 text-center font-mono py-24">
                <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-bounce" />
                <span className="text-white text-sm font-bold uppercase tracking-wider block">CLEARANCE DENIED</span>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  Manager protocols are restricted to Superadmin, CEO, and Manager clearances. Elevate simulated security context roles to access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                
                {/* Inventory Adjustments Feed */}
                <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-rose-400 border-b border-zinc-850 pb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-rose-400" />
                    <span>Manager Stock Adjustment Ledger</span>
                  </h4>

                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {events.filter(e => ["Stock Adjustments", "Inventory"].includes(e.event_category)).length === 0 ? (
                      <div className="text-center font-mono text-zinc-600 text-[11px] py-16 uppercase">
                        No inventory adjustments logged
                      </div>
                    ) : (
                      events
                        .filter(e => ["Stock Adjustments", "Inventory"].includes(e.event_category))
                        .map((e, index) => (
                          <div key={index} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1 relative">
                            <span className="absolute top-2 right-3 text-[9px] text-zinc-600 font-mono">{new Date(e.created_at).toLocaleTimeString()}</span>
                            <div className="font-mono text-[9px] uppercase tracking-wider text-rose-400 font-bold">
                              {e.actor_id} / [{e.actor_role}]
                            </div>
                            <p className="text-xs text-zinc-300 font-sans leading-relaxed text-zinc-400 italic">
                              "{e.notes}"
                            </p>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Staff Shift Activity Feed */}
                <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-indigo-400 border-b border-zinc-850 pb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>Operator Shift and Float Tracker</span>
                  </h4>

                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {events.filter(e => ["Shifts", "Cash Movements"].includes(e.event_category)).length === 0 ? (
                      <div className="text-center font-mono text-zinc-600 text-[11px] py-16 uppercase">
                        No shift activities logged
                      </div>
                    ) : (
                      events
                        .filter(e => ["Shifts", "Cash Movements"].includes(e.event_category))
                        .map((e, index) => (
                          <div key={index} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1 relative">
                            <span className="absolute top-2 right-3 text-[9px] text-zinc-600 font-mono">{new Date(e.created_at).toLocaleTimeString()}</span>
                            <div className="font-mono text-[9px] uppercase text-indigo-400 font-bold tracking-tight">
                              {e.event_type} - {e.actor_id}
                            </div>
                            <p className="text-xs text-zinc-300 font-sans leading-relaxed text-zinc-400">
                              {e.notes}
                            </p>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- MAIN TAB 5: ADVANCED HISTORICAL ENTITY TRACER --- */}
        {activeTab === "entity" && (
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-500 animate-pulse" />
                <h4 className="font-mono text-xs uppercase tracking-wider text-white">Advanced Resource & Operator Trace Engine</h4>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-955 px-2 py-0.5 rounded border border-zinc-850/65">OPERATIONAL EVIDENCE</span>
            </div>

            {/* Trace setup controls */}
            <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">Focus Operator ID</label>
                <input
                  type="text"
                  value={focusedOperator}
                  onChange={(e) => setFocusedOperator(e.target.value)}
                  placeholder="e.g. operator-active-02"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5 font-bold">Focus Asset Resource Type</label>
                <select
                  value={focusedResourceType}
                  onChange={(e) => setFocusedResourceType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-2 font-mono text-xs text-zinc-300 focus:outline-none focus:border-amber-500 transition uppercase"
                >
                  <option value="">(All Resource Types)</option>
                  <option value="shift">Shift Controllers</option>
                  <option value="reservation">Reservations</option>
                  <option value="payment">Payments</option>
                  <option value="pos_transaction">POS Journals</option>
                  <option value="bank_transfer">Bank Transfers</option>
                  <option value="inventory_item">Inventory Deck Items</option>
                  <option value="cash_movement">Cash Movement Vouchers</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">Focus Specific Resource ID</label>
                <input
                  type="text"
                  value={focusedResourceId}
                  onChange={(e) => setFocusedResourceId(e.target.value)}
                  placeholder="e.g. SHIFT-REV-ACTIVE-02"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* Entity feed output logs */}
            <div className="space-y-3.5">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Trace Chrono Output</span>
              
              {events.length === 0 ? (
                <div className="border border-dashed border-zinc-850 rounded-xl py-12 text-center text-xs font-mono text-zinc-600 uppercase">
                  Select Focus operators or Asset parameters to trace.
                </div>
              ) : (
                <div className="relative border-l-2 border-zinc-800 pl-4 ml-2.5 space-y-4">
                  {events.map((evt) => (
                    <div key={evt.id} className="relative group">
                      {/* Timeline Dot */}
                      <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-zinc-950 group-hover:bg-amber-400 group-hover:scale-110 transition duration-150" />
                      
                      <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1.5 hover:border-zinc-800 transition">
                        <div className="flex items-center justify-between font-mono text-[9.5px]">
                          <span className="text-amber-500 font-bold uppercase">{evt.event_type}</span>
                          <span className="text-zinc-600">{new Date(evt.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                          "{evt.notes}"
                        </p>
                        <div className="flex font-mono text-[9px] text-zinc-500 gap-3">
                          <span>Operator: <span className="text-zinc-400 font-semibold">{evt.actor_id}</span></span>
                          <span>•</span>
                          <span>Source Module: <span className="text-zinc-400">{evt.source_module}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- MAIN TAB 6: SUPABASE PREPARATION SCHEMA COMPLIANCE --- */}
        {activeTab === "database" && (
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-6 animate-fade-in font-mono">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs uppercase tracking-wider text-white">Database Preparation & Contracts Room</h4>
              </div>
              <span className="text-[9px] text-indigo-400 font-semibold uppercase tracking-widest bg-indigo-950/20 px-2 py-0.5 border border-indigo-505/10 rounded">CONTRACT READY</span>
            </div>

            {/* CARSS CONSTITUTIONAL REGISTRY COMPLIANCE SHIELD */}
            <div className="border border-zinc-800 bg-zinc-950/45 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs uppercase tracking-wider text-zinc-300 font-bold font-mono">Constitutional Table Registry & Target Counts</span>
                </div>
                <span className="text-[8.5px] font-bold text-emerald-400 font-mono tracking-widest bg-emerald-950/25 px-2.5 py-0.5 border border-emerald-500/10 rounded flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  WAVE 5 COMPLIANT
                </span>
              </div>
              
              <p className="text-xs font-sans text-zinc-400 leading-relaxed">
                The current territory operates under the CARSS Wave 5 Constitutional Schema Registry. All reporting engines, analytics traces, and backend pipelines are guided by the certified data scopes and target record counts below:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {[
                  { name: "bookings", count: 13, area: "Reservations", desc: "Verified guest reservation records & tickets" },
                  { name: "businesses", count: 10, area: "Corporate", desc: "Certified branch operations & canonical maps" },
                  { name: "carss_orders_unified", count: 10, area: "Unified", desc: "Consolidated checkout order journals" },
                  { name: "carss_shift_core", count: 11, area: "Shifts", desc: "Shift timelines, balances & float ledgers" },
                  { name: "customers", count: 7, area: "Identity", desc: "Consumer profiles & high-value VIP ledger" },
                  { name: "inventory", count: 18, area: "Resources", desc: "Raw stocks, levels & alerts thresholds" },
                  { name: "payment_intents", count: 17, area: "Payments", desc: "Active payment intentions & transactions" },
                  { name: "payments", count: 24, area: "Ledger", desc: "Reconciled ledger records & bank confirmations" },
                  { name: "transactions", count: 19, area: "POS Journals", desc: "Point-of-Sale logs & reconciliations" }
                ].map((tb) => (
                  <div key={tb.name} className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-3 flex flex-col justify-between hover:border-zinc-805 transition duration-150">
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                        <span className="text-zinc-200 font-bold bg-zinc-950 px-1.5 py-0.5 border border-zinc-850 rounded">{tb.name}</span>
                        <span className="text-indigo-400 text-[8.5px] uppercase tracking-wider">{tb.area}</span>
                      </div>
                      <p className="text-[10px] font-sans text-zinc-500 leading-snug">{tb.desc}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-850/40 mt-2.5 pt-2 font-mono text-[9.5px]">
                      <span className="text-zinc-500">Target Count:</span>
                      <span className="text-emerald-400 font-black">{tb.count} rows</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-bold">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Supabase DDL Preparation Scripts</span>
              </div>
              <div className="text-xs font-sans text-zinc-400 leading-relaxed max-w-2xl">
                <p>
                  In alignment with the Wave 4 constitutional contracts, we have prepared the secure audit schemas. Execute the script below inside the Supabase SQL editor to create high-throughput indexed, chronologically partitioned audit logs in production.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 pr-1 relative">
                <div className="absolute top-3 right-4 bg-indigo-600/10 text-indigo-400 border border-indigo-505/25 text-[8.5px] px-2 py-0.5 rounded font-bold uppercase">
                  SUPABASE SQL CONTRACTS
                </div>
                
                <div className="max-h-96 overflow-y-auto text-xxs text-zinc-500 leading-normal pr-3 scrollbar-thin">
                  <pre>{ConstitutionalAuditService.getBootstrapSQLWave4()}</pre>
                </div>
              </div>
            </div>

            <div className="text-xxs text-zinc-600 font-mono leading-relaxed border-t border-zinc-850/60 pt-3 block uppercase">
              CARSS SECURED REGISTRY // EMIT VERIFIED ACTIONS IN CONTEXT OF ACTIVE PROTOCOLS
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
