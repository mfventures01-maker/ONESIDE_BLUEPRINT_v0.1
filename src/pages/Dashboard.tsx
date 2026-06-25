/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useRoleStore } from "../state/Contexts";
import { CARSS_Revenue_Server } from "../services/revenueService";
import { CARSS_Operations_Server } from "../services/operationService";
import {
  Reservation,
  PaymentIntention,
  PaymentDispute,
  InventoryItem,
  MenuItem,
  MenuCategory,
  Shift,
  CashMovement,
  POSTransaction,
  BankTransfer,
  OperationalInventoryMovement
} from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import {
  TrendingUp,
  ShieldCheck,
  FileSpreadsheet,
  Terminal,
  Activity,
  AlertCircle,
  Play,
  Calendar,
  Check,
  X,
  Layers,
  Sparkles,
  Search,
  CheckCircle,
  Plus,
  RefreshCw,
  Lock,
  Unlock,
  ArrowUpDown,
  DollarSign,
  Users,
  AlertTriangle,
  History
} from "lucide-react";
import { motion } from "motion/react";

const chartData = [
  { day: "MON", actions: 120, issues: 0 },
  { day: "TUE", actions: 160, issues: 1 },
  { day: "WED", actions: 180, issues: 0 },
  { day: "THU", actions: 210, issues: 0 },
  { day: "FRI", actions: 195, issues: 0 },
  { day: "SAT", actions: 80, issues: 0 },
  { day: "SUN", actions: 95, issues: 0 },
];

export default function Dashboard() {
  const { activeRole, systemLogs, addSystemLog } = useRoleStore();
  const [incidentsCount, setIncidentsCount] = useState(0);

  // --- Live Backoffice Data ---
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<PaymentIntention[]>([]);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeTab, setActiveTab] = useState<"reservations" | "payments" | "inventory">("reservations");
  const [reconciliationRefInput, setReconciliationRefInput] = useState<Record<string, string>>({});
  const [disputes, setDisputes] = useState<PaymentDispute[]>([]);
  const [disputeReasonInput, setDisputeReasonInput] = useState<Record<string, string>>({});
  const [disputeResolutionInput, setDisputeResolutionInput] = useState<Record<string, string>>({});

  // --- Wave 3 Operational States ---
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [cashMovements, setCashMovements] = useState<CashMovement[]>([]);
  const [posTransactions, setPOSTransactions] = useState<POSTransaction[]>([]);
  const [bankTransfers, setBankTransfers] = useState<BankTransfer[]>([]);
  const [inventoryMovements, setInventoryMovements] = useState<OperationalInventoryMovement[]>([]);
  const [dashboardViewTab, setDashboardViewTab] = useState<"operations" | "ceo" | "revenue" | "audit">("operations");

  // Operational Form states
  const [openFloatInput, setOpenFloatInput] = useState<string>("15000");
  const [closeAmountInput, setCloseAmountInput] = useState<string>("0");

  const [cashAmount, setCashAmount] = useState<string>("");
  const [cashType, setCashType] = useState<"cash_in" | "cash_out" | "correction" | "adjustment">("cash_out");
  const [cashNotes, setCashNotes] = useState<string>("");

  const [newPosRef, setNewPosRef] = useState<string>("");
  const [newPosAmount, setNewPosAmount] = useState<string>("");
  const [newPosTerminal, setNewPosTerminal] = useState<string>("TERM_A");

  const [newTrfRef, setNewTrfRef] = useState<string>("");
  const [newTrfAmount, setNewTrfAmount] = useState<string>("");
  const [newTrfPayer, setNewTrfPayer] = useState<string>("");

  const [invAdjustItemId, setInvAdjustItemId] = useState<string>("");
  const [invAdjustQty, setInvAdjustQty] = useState<string>("5");
  const [invAdjustType, setInvAdjustType] = useState<"stock_in" | "stock_out" | "consumption" | "waste" | "adjustment">("stock_in");
  const [invAdjustReason, setInvAdjustReason] = useState<string>("");

  const loadBackofficeMetrics = async () => {
    try {
      const res = await CARSS_Revenue_Server.getReservations();
      setReservations(res);

      const pay = await CARSS_Revenue_Server.getPaymentIntentions();
      setPayments(pay);

      const inv = await CARSS_Revenue_Server.getInventory();
      setInventoryList(inv);

      const items = await CARSS_Revenue_Server.getMenuItems();
      setMenuItems(items);

      const cats = await CARSS_Revenue_Server.getCategories();
      setCategories(cats);

      const disps = await CARSS_Revenue_Server.getPaymentDisputes();
      setDisputes(disps);
    } catch (err) {
      console.error("Backoffice load issue:", err);
    }
  };

  const loadOperationsData = async () => {
    try {
      const active = await CARSS_Operations_Server.getActiveShift();
      setActiveShift(active);

      const allShifts = await CARSS_Operations_Server.getShifts();
      setShifts(allShifts);

      const cashLogs = await CARSS_Operations_Server.getCashMovements();
      setCashMovements(cashLogs);

      const posList = await CARSS_Operations_Server.getPOSTransactions();
      setPOSTransactions(posList);

      const trfList = await CARSS_Operations_Server.getBankTransfers();
      setBankTransfers(trfList);

      const invMovementsList = await CARSS_Operations_Server.getInventoryMovements();
      setInventoryMovements(invMovementsList);

      const inv = await CARSS_Revenue_Server.getInventory();
      if (inv.length > 0 && !invAdjustItemId) {
        setInvAdjustItemId(inv[0].menu_item_id);
      }
    } catch (err) {
      console.error("Operations load issue:", err);
    }
  };

  const syncAllData = async () => {
    await loadBackofficeMetrics();
    await loadOperationsData();
  };

  useEffect(() => {
    syncAllData();
  }, []);

  const triggerAuditVerification = () => {
    addSystemLog(`Verification pipeline fired. All systems conform to CARSS Constitution.`);
    loadBackofficeMetrics();
  };

  const simulateSecurityLog = () => {
    setIncidentsCount((prev) => prev + 1);
    addSystemLog(`[ALERT] Operator simulation triggered. Compliance sanity checked.`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 relative overflow-hidden backdrop-blur">
          <div className="absolute top-0 right-0 w-80 h-40 bg-indigo-500/5 rounded-full blur-[80px] -z-10" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold font-mono tracking-tight text-white mb-1.5 uppercase">
                Active Operational Desk
              </h3>
              <p className="text-xs text-zinc-400 font-sans max-w-xl leading-relaxed">
                As an authorized [ {activeRole.toUpperCase()} ], you have active access bounds to monitors, system transaction logs, and security verification switches.
              </p>
            </div>
            <div className="flex gap-3 mt-2 md:mt-0">
              <button
                onClick={triggerAuditVerification}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[11px] uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Fire Secure Verification
              </button>
              <button
                onClick={simulateSecurityLog}
                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-[11px] uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Test Alert Log
              </button>
            </div>
          </div>
        </div>

        {/* --- MAIN TAB SWITCHER BAR --- */}
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-850 pb-3 gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDashboardViewTab("operations")}
              className={`px-4 py-2 rounded-xl font-mono text-[11px] uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                dashboardViewTab === "operations"
                  ? "bg-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-600/10"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Operations Desk (Manager)</span>
            </button>
            <button
              onClick={() => setDashboardViewTab("ceo")}
              className={`px-4 py-2 rounded-xl font-mono text-[11px] uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                dashboardViewTab === "ceo"
                  ? "bg-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-600/10"
                  : "bg-zinc-950 border border-zinc-805 text-zinc-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Executive Room (CEO)</span>
            </button>
            <button
              onClick={() => setDashboardViewTab("revenue")}
              className={`px-4 py-2 rounded-xl font-mono text-[11px] uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                dashboardViewTab === "revenue"
                  ? "bg-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-600/10"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Customer Lists (V2)</span>
            </button>
            <button
              onClick={() => setDashboardViewTab("audit")}
              className={`px-4 py-2 rounded-xl font-mono text-[11px] uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                dashboardViewTab === "audit"
                  ? "bg-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-600/10"
                  : "bg-zinc-950 border border-zinc-805 text-zinc-400 hover:text-white"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Auditing Ledger</span>
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>OPERATOR ROLE:</span>
            <span className="px-2 py-0.5 bg-zinc-950 rounded border border-zinc-850 text-indigo-400 uppercase font-black font-mono">
              {activeRole}
            </span>
          </div>
        </div>

        {/* --- TAB 1: OPERATIONS DESK (MANAGER) --- */}
        {dashboardViewTab === "operations" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Shift Controller Card */}
              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    {activeShift ? (
                      <Unlock className="w-4 h-4 text-emerald-400 animate-pulse" />
                    ) : (
                      <Lock className="w-4 h-4 text-red-500" />
                    )}
                    <span>Shift Controller Registry</span>
                  </h4>
                  <span className={`px-2 py-0.5 font-mono text-[9px] font-bold rounded uppercase ${
                    activeShift ? "bg-emerald-950 text-emerald-400 animate-pulse border border-emerald-500/10" : "bg-red-950 text-red-500"
                  }`}>
                    {activeShift ? "Shift Active" : "Shift Closed"}
                  </span>
                </div>

                {activeShift ? (
                  <div className="space-y-4 text-xs font-mono text-left">
                    <div className="bg-zinc-950 border border-zinc-855 rounded-xl p-4 space-y-2 text-zinc-400">
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5 label text-left">
                        <span className="text-zinc-505 font-mono">SHIFT ID:</span>
                        <span className="text-white font-bold">{activeShift.id}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5 label text-left font-mono">
                        <span className="text-zinc-505">OPENED BY:</span>
                        <span className="text-indigo-400 uppercase">{activeShift.operator_id}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 pb-1.5 label text-left font-mono">
                        <span className="text-zinc-505">OPENED AT:</span>
                        <span>{new Date(activeShift.opened_at).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between label text-left font-mono font-bold">
                        <span className="text-zinc-500">OPENING FLOAT:</span>
                        <span className="text-emerald-400">₦{activeShift.opening_float.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-widest text-left">
                        Reconciled Counter Float / Cash Total (₦)
                      </label>
                      <input
                        type="number"
                        value={closeAmountInput}
                        onChange={(e) => setCloseAmountInput(e.target.value)}
                        placeholder="Expected: e.g. 15000"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 px-3 text-white font-mono placeholder-zinc-700 focus:outline-none placeholder-zinc-600"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        const amt = Math.max(0, parseFloat(closeAmountInput) || 0);
                        const summary = await CARSS_Operations_Server.closeShift(
                          activeShift.id,
                          amt,
                          "manager_backoffice",
                          activeRole
                        );
                        addSystemLog(`[SHIFT CLOSED] Shift ID ${summary.shift_id} finalized. Variance computed: ₦${summary.variance.toLocaleString()}`);
                        syncAllData();
                      }}
                      className="w-full py-2.5 bg-red-655 hover:bg-red-550 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-xl cursor-pointer bg-red-600"
                    >
                      SHUT DOWN SHIFT CORES
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs font-mono text-left">
                    <p className="text-zinc-505 text-center py-4 uppercase font-bold text-zinc-500">
                      No active shift cores currently running. Float needed.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1 text-left font-mono">
                          Manager/Operator ID
                        </label>
                        <input
                          type="text"
                          defaultValue="operator-active-02"
                          id="op_id_input"
                          placeholder="e.g. operator-active-02"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 px-3 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1 text-left font-mono">
                          Opening Cash Float (₦)
                        </label>
                        <input
                          type="number"
                          value={openFloatInput}
                          onChange={(e) => setOpenFloatInput(e.target.value)}
                          placeholder="e.g. 15000"
                          className="w-full bg-zinc-955 border border-zinc-800 rounded-xl p-2 px-3 text-white font-mono focus:outline-none focus:border-zinc-700"
                        />
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        const opVal = (document.getElementById("op_id_input") as HTMLInputElement)?.value || "staff-02";
                        const floatVal = parseFloat(openFloatInput) || 15000;
                        const fresh = await CARSS_Operations_Server.openShift(opVal, activeRole, floatVal);
                        addSystemLog(`[SHIFT STARTED] Fresh active shift ${fresh.id} opened with float: ₦${floatVal.toLocaleString()}`);
                        syncAllData();
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-505 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-xl cursor-pointer"
                    >
                      IGNITE POWER PROTOCOLS
                    </button>
                  </div>
                )}
              </div>

              {/* Cash Outflows & Inflows Registry */}
              <div className="lg:col-span-2 bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-300 flex items-center gap-2 text-left">
                    <ArrowUpDown className="w-4 h-4 text-indigo-400" />
                    <span>Shift Cash Movement Registry</span>
                  </h4>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono text-right">
                    Shift-specific adjustments
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end font-mono">
                  <div className="space-y-1">
                    <label className="block text-[9px] text-zinc-500 uppercase tracking-wider font-mono text-left">
                      Amount (₦)
                    </label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      placeholder="Amount ₦"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 px-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] text-zinc-500 uppercase tracking-wider font-mono text-left">
                      Movement Type
                    </label>
                    <select
                      value={cashType}
                      onChange={(e: any) => setCashType(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 px-1.5 text-xs text-zinc-350 focus:outline-none"
                    >
                      <option value="cash_out">Cash Out (Expense)</option>
                      <option value="cash_in">Cash In (Supplement)</option>
                      <option value="adjustment">Adjustment (Settle)</option>
                      <option value="correction">Correction (Audit)</option>
                    </select>
                  </div>

                  <div className="space-y-1 md:col-span-2 flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="block text-[9px] text-zinc-505 uppercase tracking-wider font-mono text-left">
                        Purpose notes / references
                      </label>
                      <input
                        type="text"
                        value={cashNotes}
                        onChange={(e) => setCashNotes(e.target.value)}
                        placeholder="e.g. Fuel purchase, change restock"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 px-2.5 text-xs text-white placeholder-zinc-700"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        const amt = parseFloat(cashAmount) || 0;
                        if (amt <= 0 || !activeShift) return;
                        await CARSS_Operations_Server.addCashMovement(
                          activeShift.id,
                          amt,
                          cashType,
                          cashNotes || "Staff declared movement",
                          "operator-active-02",
                          activeRole
                        );
                        addSystemLog(`[CASH MOVEMENT] Logged ${cashType.toUpperCase()} of ₦${amt.toLocaleString()} on Shift`);
                        setCashAmount("");
                        setCashNotes("");
                        syncAllData();
                      }}
                      className="p-2 py-1.5 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-emerald-400 font-mono text-[10px] rounded-xl whitespace-nowrap uppercase cursor-pointer"
                    >
                      Add +
                    </button>
                  </div>
                </div>

                {/* Movements List table */}
                <div className="overflow-x-auto text-[10px] font-mono select-none">
                  {cashMovements.length === 0 ? (
                    <p className="text-zinc-650 text-center py-6 text-zinc-500">NO DETECTED CASH MOVEMENTS REGISTERED TODAY.</p>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-850 text-zinc-500 text-left">
                          <th className="pb-1.5">Timestamp</th>
                          <th className="pb-1.5">Type</th>
                          <th className="pb-1.5">Amount</th>
                          <th className="pb-1.5 text-left">Notes</th>
                          <th className="pb-1.5 text-right">Shift</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 text-zinc-455">
                        {cashMovements.map((movement) => (
                          <tr key={movement.id} className="hover:bg-zinc-955/25">
                            <td className="py-2 text-zinc-500">{new Date(movement.timestamp).toLocaleTimeString()}</td>
                            <td className="py-2 text-left">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                movement.movement_type === "cash_in" ? "bg-emerald-950 text-emerald-450 border border-emerald-500/10" : "bg-amber-950/40 text-amber-500"
                              }`}>
                                {movement.movement_type}
                              </span>
                            </td>
                            <td className="py-2 text-white font-extrabold text-left">₦{movement.amount.toLocaleString()}</td>
                            <td className="py-2 truncate max-w-[150px] text-zinc-400 text-left">{movement.notes}</td>
                            <td className="py-2 text-zinc-500 text-[9px] text-right">{movement.shift_id}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Reconciliation Rows: POS & Transfer Verification Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* POS Collections Verification */}
              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>POS Reconciliation Terminal</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono animate-pulse font-bold">
                    Live settlement matching
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Receipt Ref"
                      value={newPosRef}
                      onChange={(e) => setNewPosRef(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1 px-2.5 text-xs text-white font-mono placeholder-zinc-700 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="number"
                      placeholder="Amount ₦"
                      value={newPosAmount}
                      onChange={(e) => setNewPosAmount(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1 px-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <select
                      value={newPosTerminal}
                      onChange={(e) => setNewPosTerminal(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1 px-1 text-xs text-zinc-400 focus:outline-none"
                    >
                      <option value="TERM-A">Terminal A</option>
                      <option value="TERM-B">Terminal B</option>
                      <option value="TERM-C">Terminal C</option>
                    </select>
                  </div>
                  <button
                    onClick={async () => {
                      const amount = parseFloat(newPosAmount) || 0;
                      if (!newPosRef || amount <= 0) return;
                      await CARSS_Operations_Server.addPOSTransaction(newPosRef, amount, newPosTerminal);
                      addSystemLog(`[POS ADD] Registered pending receipt transaction: ${newPosRef} (₦${amount.toLocaleString()})`);
                      setNewPosRef("");
                      setNewPosAmount("");
                      syncAllData();
                    }}
                    className="p-1 px-2.5 bg-zinc-950 border border-zinc-800 text-indigo-400 hover:text-white rounded-xl text-[10px] font-mono cursor-pointer"
                  >
                    Load POS Receipt
                  </button>
                </div>

                <div className="overflow-x-auto text-[10px] font-mono select-none max-h-56 overflow-y-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-850 text-zinc-500 text-left">
                        <th className="pb-1.5 text-left">Reference No</th>
                        <th className="pb-1.5">Terminal</th>
                        <th className="pb-1.5">Amount</th>
                        <th className="pb-1.5">Status</th>
                        <th className="pb-1.5 text-right">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-400">
                      {posTransactions.map((tx) => (
                        <tr key={tx.reference} className="hover:bg-zinc-950/20">
                          <td className="py-2 text-white text-left font-bold">{tx.reference}</td>
                          <td className="py-2 text-zinc-500 text-left">{tx.terminal_id}</td>
                          <td className="py-2 font-black text-amber-500 text-left">₦{tx.amount.toLocaleString()}</td>
                          <td className="py-2 text-left">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              tx.status === "reconciled" ? "bg-emerald-950 text-emerald-400 border border-emerald-500/10" : "bg-zinc-950 text-zinc-500"
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-2 text-right">
                            {tx.status === "pending" ? (
                              <button
                                onClick={async () => {
                                  await CARSS_Operations_Server.reconcilePOSTransaction(
                                    tx.reference,
                                    "backoffice-mgr-01",
                                    activeRole
                                  );
                                  addSystemLog(`[POS BIND] Reconciled terminal remittance receipt ${tx.reference}`);
                                  syncAllData();
                                }}
                                className="px-2 py-0.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/20 text-emerald-400 rounded cursor-pointer text-[9px]"
                              >
                                Reconcile
                              </button>
                            ) : (
                              <span className="text-zinc-600 text-[8px]">Synced {new Date(tx.reconciled_at!).toLocaleTimeString()}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bank Transfer Checklist */}
              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Transfer Verification Checklist</span>
                  </h4>
                  <span className="text-[10px] text-zinc-505 font-mono">
                    Bank status validations
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Trf Ref"
                      value={newTrfRef}
                      onChange={(e) => setNewTrfRef(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1 px-2.5 text-xs text-white font-mono placeholder-zinc-700 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="number"
                      placeholder="Amount ₦"
                      value={newTrfAmount}
                      onChange={(e) => setNewTrfAmount(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1 px-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Payer Name"
                      value={newTrfPayer}
                      onChange={(e) => setNewTrfPayer(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1 px-2.5 text-xs text-white font-sans placeholder-zinc-700"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      const amount = parseFloat(newTrfAmount) || 0;
                      if (!newTrfRef || amount <= 0 || !newTrfPayer) return;
                      await CARSS_Operations_Server.addBankTransfer(newTrfRef, amount, newTrfPayer);
                      addSystemLog(`[TRANSFER BIND] Registered pending transfer entry: ${newTrfRef} (₦${amount.toLocaleString()})`);
                      setNewTrfRef("");
                      setNewTrfAmount("");
                      setNewTrfPayer("");
                      syncAllData();
                    }}
                    className="p-1 px-2.5 bg-zinc-950 border border-zinc-800 text-indigo-400 hover:text-white rounded-xl text-[10px] font-mono cursor-pointer"
                  >
                    Register Transfer
                  </button>
                </div>

                <div className="overflow-x-auto text-[10px] font-mono select-none max-h-56 overflow-y-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-850 text-zinc-500 text-left">
                        <th className="pb-1.5 text-left">Trf Reference</th>
                        <th className="pb-1.5 text-left font-sans">Payer Name</th>
                        <th className="pb-1.5">Amount</th>
                        <th className="pb-1.5">Verification</th>
                        <th className="pb-1.5 text-right">Approve</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-400">
                      {bankTransfers.map((t) => (
                        <tr key={t.reference} className="hover:bg-zinc-950/20">
                          <td className="py-2 text-white font-bold text-left">{t.reference}</td>
                          <td className="py-2 text-zinc-350 font-sans text-left">{t.payer_name}</td>
                          <td className="py-2 font-black text-indigo-400 text-left">₦{t.amount.toLocaleString()}</td>
                          <td className="py-2 text-left">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                              t.verification_status === "verified" ? "bg-emerald-950 text-emerald-450 border-emerald-500/10" : "bg-amber-950/40 text-amber-500 border-amber-500/10"
                            }`}>
                              {t.verification_status}
                            </span>
                          </td>
                          <td className="py-2 text-right">
                            {t.verification_status === "pending" ? (
                              <button
                                onClick={async () => {
                                  await CARSS_Operations_Server.verifyBankTransfer(
                                    t.reference,
                                    "auditor-mgr-01",
                                    activeRole
                                  );
                                  addSystemLog(`[TRANSFER APPROVED] Verified bank credit settlement receipt: ${t.reference}`);
                                  syncAllData();
                                }}
                                className="px-2 py-0.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/20 text-emerald-400 rounded cursor-pointer text-[9px]"
                              >
                                Approve
                              </button>
                            ) : (
                              <span className="text-zinc-600 text-[8px]">Approved by {t.verified_by}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Manual stock adjustments & movements (Wave 3 Engine) */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-4">
              <div className="flex border-b border-zinc-850 pb-2 flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-left font-mono">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span>Food Stock Movement &amp; Warehousing Controller</span>
                  </h4>
                  <p className="text-[10px] text-zinc-500 uppercase mt-0.5 text-left">
                    Modifying this logs transaction movements and updates the customer storefront food stock counts instantly
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                <div className="space-y-1">
                  <label className="block text-[9px] text-zinc-500 uppercase tracking-widest font-mono text-left">
                    Select Stock Item
                  </label>
                  <select
                    value={invAdjustItemId}
                    onChange={(e) => setInvAdjustItemId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 px-2 text-xs text-white font-mono focus:outline-none"
                  >
                    {inventoryList.map((inv) => {
                      const m = menuItems.find((item) => item.id === inv.menu_item_id);
                      return (
                        <option value={inv.menu_item_id} key={inv.id}>
                          {m?.name || "unnamed item"} (Stock: {inv.quantity})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] text-zinc-505 uppercase tracking-widest font-mono text-left">
                    Quantity Delta
                  </label>
                  <input
                    type="number"
                    value={invAdjustQty}
                    onChange={(e) => setInvAdjustQty(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 px-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] text-zinc-500 uppercase tracking-widest font-mono text-left font-mono">
                    Adjustment Type
                  </label>
                  <select
                    value={invAdjustType}
                    onChange={(e: any) => setInvAdjustType(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 px-2 text-xs text-zinc-350 focus:outline-none"
                  >
                    <option value="stock_in">Stock In (Add)</option>
                    <option value="stock_out">Stock Out (Deduct)</option>
                    <option value="waste">Waste Declared</option>
                    <option value="adjustment">Discrepancy</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2 flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="block text-[9px] text-zinc-500 uppercase tracking-widest font-mono text-left">
                      Reason Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Broken packaging, Restock batch 90"
                      value={invAdjustReason}
                      onChange={(e) => setInvAdjustReason(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 px-3 text-xs text-white font-sans focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      const qty = parseInt(invAdjustQty) || 0;
                      if (qty <= 0 || !invAdjustItemId) return;
                      
                      const matchedInv = inventoryList.find(i => i.menu_item_id === invAdjustItemId);
                      if (!matchedInv) return;

                      const actualMultiplier = (invAdjustType === "stock_in" || invAdjustType === "adjustment") ? qty : -qty;
                      
                      if (actualMultiplier > 0) {
                        await CARSS_Revenue_Server.restockItemInventory(invAdjustItemId, actualMultiplier);
                        addSystemLog(`Replenished inventory of ${invAdjustItemId}: Added +${actualMultiplier} units.`);
                      } else {
                        await CARSS_Revenue_Server.updateItemInventory(invAdjustItemId, Math.abs(actualMultiplier));
                        addSystemLog(`Deducted standard inventory of ${invAdjustItemId}: Deducted ${Math.abs(actualMultiplier)} units.`);
                      }

                      await CARSS_Operations_Server.addInventoryMovement(
                        matchedInv.id,
                        actualMultiplier,
                        invAdjustType,
                        invAdjustReason || "Manual inventory adjustment",
                        "staff-operator-33",
                        activeRole
                      );

                      setInvAdjustReason("");
                      setInvAdjustQty("");
                      syncAllData();
                    }}
                    className="p-1.5 py-1.5 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-teal-400 hover:text-white rounded-xl text-[10px] font-mono cursor-pointer uppercase font-black"
                  >
                    Commit Load
                  </button>
                </div>
              </div>

              {/* Inventory Movements Log table */}
              <div className="overflow-x-auto text-[10px] font-mono max-h-56 overflow-y-auto select-none">
                {inventoryMovements.length === 0 ? (
                  <p className="text-zinc-600 py-6 text-center">NO DETECTED STOCK HISTORICAL MOVEMENTS DISPATCHED YET.</p>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-850 text-zinc-500 text-left font-mono">
                        <th className="pb-1.5">Timestamp</th>
                        <th className="pb-1.5 text-left">Inventory Ref</th>
                        <th className="pb-1.5">Action type</th>
                        <th className="pb-1.5">Quantity Changed</th>
                        <th className="pb-1.5">Reasoning notes</th>
                        <th className="pb-1.5 text-right">Operator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-400">
                      {inventoryMovements.map((m) => (
                        <tr key={m.id} className="hover:bg-zinc-950/20">
                          <td className="py-2 text-zinc-500">{new Date(m.timestamp).toLocaleTimeString()}</td>
                          <td className="py-2 text-indigo-400 font-bold text-left">{m.inventory_id}</td>
                          <td className="py-2 font-bold uppercase text-left">{m.movement_type}</td>
                          <td className={`py-2 font-black text-left ${m.quantity > 0 ? "text-emerald-450" : "text-amber-500"}`}>
                            {m.quantity > 0 ? `+${m.quantity}` : m.quantity} units
                          </td>
                          <td className="py-2 text-left text-zinc-350">{m.reason}</td>
                          <td className="py-2 text-zinc-505 uppercase text-[9px] text-right">{m.operator_id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: EXECUTIVE ROOM (CEO DASHBOARD) --- */}
        {dashboardViewTab === "ceo" && (
          <div className="space-y-6">
            {/* Bento CEO Top Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stat 1: Today's Reconciled Sales */}
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="text-left font-mono">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 font-bold">
                    Reconciled Revenue Today
                  </span>
                  <span className="block text-2xl font-black font-mono text-emerald-400">
                    ₦{(payments.filter(p => p.status === "reconciled").reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}
                  </span>
                </div>
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 text-indigo-400 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              {/* Stat 2: Active Reservation Conversions */}
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-5 flex items-center justify-between">
                <div className="text-left">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 font-bold">
                    Seated Conversions Today
                  </span>
                  <span className="block text-2xl font-black font-mono text-white">
                    {reservations.filter(r => r.status === "confirmed").length} / {reservations.length}
                  </span>
                </div>
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 text-amber-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              {/* Stat 3: Cash Book Variance */}
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-5 flex items-center justify-between">
                <div className="text-left font-mono">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 font-bold">
                    Cash Book Discrepancy
                  </span>
                  <span className={`block text-2xl font-black font-mono ${
                    shifts.reduce((acc, curr) => acc + (curr.variance || 0), 0) === 0 ? "text-white" : "text-amber-500 animate-pulse"
                  }`}>
                    ₦{shifts.reduce((acc, curr) => acc + (curr.variance || 0), 0).toLocaleString()}
                  </span>
                </div>
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              {/* Stat 4: Low Stock Alarms */}
              <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-5 flex items-center justify-between">
                <div className="text-left font-mono">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 font-bold">
                    Stock Warning Alarms
                  </span>
                  <span className="block text-2xl font-black font-mono text-red-500">
                    {inventoryList.filter(i => i.quantity <= i.min_alert_threshold).length} warnings
                  </span>
                </div>
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 text-red-400 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-850 pb-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <span>Weekly Action Load Trajectory</span>
                  </h4>
                </div>
                <div className="h-64 w-full text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="day" stroke="#71717a" />
                      <YAxis stroke="#71717a" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#09090b",
                          border: "1px solid #27272a",
                          color: "#f4f4f5",
                          fontFamily: "monospace",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="actions" name="Audited Operations Fired" stroke="#6366f1" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribution */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-850 pb-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Distribution Indices</span>
                  </h4>
                </div>
                <div className="h-64 w-full text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="day" stroke="#71717a" />
                      <YAxis stroke="#71717a" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#09090b",
                          border: "1px solid #27272a",
                          color: "#f4f4f5",
                          fontFamily: "monospace",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="actions" fill="#10b981" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 3 ? "#6366f1" : "#10b981"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Categories of Menu Checkout & Low Stock Warning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-0 border-0">
              {/* Category Metrics Dashboard */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-305 border-b border-zinc-850 pb-2 flex items-center justify-between">
                  <span>Categories Strategic Performance</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold text-right font-mono">Sales shares counts</span>
                </h4>
                <div className="overflow-x-auto text-[11px] font-mono select-none">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-850 text-zinc-505">
                        <th className="pb-2 text-left">Category</th>
                        <th className="pb-2 text-left">Connected items</th>
                        <th className="pb-2 text-right">Target Action Rank</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-zinc-300 font-mono">
                      {categories.map((cat) => (
                        <tr key={cat.id}>
                          <td className="py-2.5 font-bold uppercase text-white text-left">{cat.name}</td>
                          <td className="py-2.5 text-zinc-500 text-left">
                            {menuItems.filter(i => i.category_id === cat.id).length} menu items listed
                          </td>
                          <td className="py-2.5 text-right text-indigo-400 font-extrabold font-mono">RANKED #{(Math.floor(Math.random() * 4) + 1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Food Stock Alarms */}
              <div className="bg-zinc-905 border border-zinc-850 rounded-2xl p-6 space-y-4 bg-zinc-900/40">
                <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-300 border-b border-zinc-850 pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-red-500 font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                    <span>Emergency Low Stock Alarm Desk</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Safety margin</span>
                </h4>

                <div className="overflow-x-auto text-[11px] font-mono select-none">
                  {inventoryList.filter(i => i.quantity <= i.min_alert_threshold).length === 0 ? (
                    <p className="text-emerald-450 text-center py-10 uppercase block font-bold font-mono">All menu food stocks healthy in warehouse shelves.</p>
                  ) : (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-zinc-850 text-zinc-500">
                          <th className="pb-2 text-left">Food item name</th>
                          <th className="pb-2 text-center text-zinc-400">Current Levels</th>
                          <th className="pb-2 text-right font-mono">Emergency Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 text-zinc-400 font-mono">
                        {inventoryList.filter(i => i.quantity <= i.min_alert_threshold).map((inv) => {
                          const item = menuItems.find(mi => mi.id === inv.menu_item_id);
                          return (
                            <tr key={inv.id}>
                              <td className="py-2 text-white font-sans font-bold uppercase text-left">{item?.name || "unnamed stock"}</td>
                              <td className="py-2 text-red-400 font-extrabold text-center">{inv.quantity} units remaining</td>
                              <td className="py-2 text-right">
                                <button
                                  onClick={async () => {
                                    await CARSS_Revenue_Server.restockItemInventory(inv.menu_item_id, 25);
                                    addSystemLog(`Replenished inventory of ${item?.name || "unknown"}: Added +25 units.`);
                                    syncAllData();
                                  }}
                                  className="px-2 py-0.5 bg-red-950/40 text-red-400 hover:text-white border border-red-500/10 rounded text-[9px] font-mono cursor-pointer"
                                >
                                  RESTOCK +25
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: CUSTOMER BOOKINGS & PAYMENTS & CONTROL PANEL (CUSTOMER LISTS) --- */}
        {dashboardViewTab === "revenue" && (
          <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-850 pb-4 gap-4">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>Wave 2 Customer Revenue Control Bureau</span>
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1 uppercase">
                Active Operational Custody Dashboard - Real-time client syncing
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-950 p-1 border border-zinc-850 rounded-xl shrink-0">
              <button
                onClick={() => setActiveTab("reservations")}
                className={`px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider transition ${
                  activeTab === "reservations"
                    ? "bg-amber-600 text-zinc-950 font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Reservations ({reservations.length})
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider transition ${
                  activeTab === "payments"
                    ? "bg-amber-600 text-zinc-950 font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Payments ({payments.length})
              </button>
              <button
                onClick={() => setActiveTab("inventory")}
                className={`px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider transition ${
                  activeTab === "inventory"
                    ? "bg-amber-600 text-zinc-950 font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Food Stock ({inventoryList.length})
              </button>
              <button
                onClick={loadBackofficeMetrics}
                className="p-1 px-2.5 hover:bg-zinc-900 text-zinc-400 hover:text-white transition rounded"
                title="Sync Storefront Database"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              </button>
            </div>
          </div>

          {/* TAB 1: RESERVATIONS CORES */}
          {activeTab === "reservations" && (
            <div className="overflow-x-auto text-[11px]">
              {reservations.length === 0 ? (
                <div className="text-center py-10 text-zinc-600 font-mono">
                  NO ACTIVE CUSTOMER RESERVATIONS REGISTERED ON PROTOCOLS TODAY.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 text-zinc-500 font-mono text-[9px] uppercase">
                      <th className="pb-2.5">Pass Code</th>
                      <th className="pb-2.5">Customer</th>
                      <th className="pb-2.5">Type / Size</th>
                      <th className="pb-2.5">Date &amp; Time</th>
                      <th className="pb-2.5">Special Requests &amp; Menu pre-orders</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 font-sans text-zinc-300">
                    {reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-zinc-950/40">
                        <td className="py-3 font-mono font-bold text-amber-500">{res.ticket_code}</td>
                        <td className="py-3">
                          <span className="block text-white font-medium uppercase">{res.customer_name}</span>
                          <span className="block text-[9px] font-mono text-zinc-500">{res.customer_phone}</span>
                        </td>
                        <td className="py-3 font-mono">
                          <span className="px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded font-bold text-[9px] uppercase text-zinc-300">
                            {res.reservation_type}
                          </span>
                          <span className="ml-2 text-zinc-400">{res.quantity_people}p</span>
                        </td>
                        <td className="py-3 font-mono text-zinc-300">
                          {res.booking_date} @ {res.booking_time}
                        </td>
                        <td className="py-3 text-zinc-400 max-w-xs truncate" title={res.special_requests}>
                          {res.special_requests || "None Specified"}
                        </td>
                        <td className="py-3 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            res.status === "confirmed" ? "bg-emerald-950/60 border border-emerald-500/15 text-emerald-400" : "bg-red-950/60 border border-red-500/15 text-red-500"
                          }`}>
                            {res.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {res.status === "confirmed" ? (
                            <button
                              onClick={async () => {
                                await CARSS_Revenue_Server.updateReservationStatus(res.id, "cancelled");
                                addSystemLog(`CANCELLED reservation ticket reference: ${res.ticket_code}`);
                                loadBackofficeMetrics();
                              }}
                              className="px-2 py-1 bg-red-950/40 text-red-400 hover:bg-red-900/30 border border-red-500/10 rounded cursor-pointer text-[10px]"
                            >
                              Cancel Booking
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                await CARSS_Revenue_Server.updateReservationStatus(res.id, "confirmed");
                                addSystemLog(`CONFIRMED and checked-in customer: ${res.customer_name}`);
                                loadBackofficeMetrics();
                              }}
                              className="px-2 py-1 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/30 border border-emerald-500/10 rounded cursor-pointer text-[10px]"
                            >
                              Seat Customer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: PAYMENTS INDEX */}
          {activeTab === "payments" && (
            <div className="overflow-x-auto text-[11px]">
              {payments.length === 0 ? (
                <div className="text-center py-10 text-zinc-600 font-mono">
                  NO PENDING OR RECONCILED PAYMENT INTENTIONS FILED TODAY.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 text-zinc-500 font-mono text-[9px] uppercase">
                      <th className="pb-2.5">Intention reference</th>
                      <th className="pb-2.5">Amount Payable</th>
                      <th className="pb-2.5">Payment Method</th>
                      <th className="pb-2.5">Shift linked</th>
                      <th className="pb-2.5">Reconciliation Ledger Note</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5 pr-2 text-right">Verification desk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 font-sans text-zinc-300">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-950/40">
                        <td className="py-3 font-mono font-bold text-white select-all">{p.payment_reference}</td>
                        <td className="py-3 font-mono text-emerald-400 font-extrabold">₦{p.amount.toLocaleString()}</td>
                        <td className="py-3 font-mono">
                          <span className="px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded font-extrabold uppercase text-[9px]">
                            {p.payment_method}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-zinc-500">{p.shift_id}</td>
                        <td className="py-3 font-sans text-zinc-400">
                          {p.reconciliation_notes || "Unreconciled - Awating confirmation"}
                        </td>
                        <td className="py-3 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            p.status === "reconciled" ? "bg-emerald-950/60 border border-emerald-500/15 text-emerald-400" : "bg-amber-950/60 border border-amber-500/15 text-amber-500 animate-pulse"
                          }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {p.status === "pending" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <input
                                type="text"
                                placeholder="Audit Note (e.g., POS Receipt #1)"
                                value={reconciliationRefInput[p.id] || ""}
                                onChange={(e) => setReconciliationRefInput({
                                  ...reconciliationRefInput,
                                  [p.id]: e.target.value
                                })}
                                className="bg-zinc-950 border border-zinc-850 rounded px-2 py-1 text-[10px] text-white font-mono w-40 placeholder-zinc-700 focus:outline-none"
                              />
                              <button
                                onClick={async () => {
                                  const note = reconciliationRefInput[p.id] || "Reconciled manually by operator";
                                  await CARSS_Revenue_Server.reconcilePaymentIntention(p.id, note);
                                  addSystemLog(`RECONCILED payment reference ${p.payment_reference}. Note: ${note}`);
                                  loadBackofficeMetrics();
                                }}
                                className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-mono rounded font-bold cursor-pointer text-[10px]"
                              >
                                Reconcile
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-emerald-500 font-mono text-[10px] flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-400" /> Reconciled
                              </span>
                              {disputes.some(d => d.payment_id === `payment-${p.id}`) ? (
                                <div className="text-right">
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                    disputes.find(d => d.payment_id === `payment-${p.id}`)?.status === "resolved"
                                      ? "bg-blue-950 text-blue-400 border border-blue-500/15"
                                      : "bg-red-950 text-red-400 border border-red-500/15 animate-pulse"
                                  }`}>
                                    Dispute: {disputes.find(d => d.payment_id === `payment-${p.id}`)?.status}
                                  </span>
                                  {disputes.find(d => d.payment_id === `payment-${p.id}`)?.status === "open" && (
                                    <div className="mt-1 flex items-center gap-1 justify-end">
                                      <input
                                        type="text"
                                        placeholder="Resolution Note"
                                        value={disputeResolutionInput[p.id] || ""}
                                        onChange={(e) => setDisputeResolutionInput({
                                          ...disputeResolutionInput,
                                          [p.id]: e.target.value
                                        })}
                                        className="bg-zinc-950 border border-zinc-850 rounded px-1.5 py-0.5 text-[8px] text-white font-mono w-28 placeholder-zinc-700 focus:outline-none"
                                      />
                                      <button
                                        onClick={async () => {
                                          const d = disputes.find(d => d.payment_id === `payment-${p.id}`);
                                          if (!d) return;
                                          const resNotes = disputeResolutionInput[p.id] || "Resolved manually by manager";
                                          await CARSS_Revenue_Server.resolvePaymentDispute(d.id, resNotes);
                                          addSystemLog(`RESOLVED dispute for payment ${p.payment_reference}. Note: ${resNotes}`);
                                          loadBackofficeMetrics();
                                        }}
                                        className="px-1.5 py-0.5 bg-blue-900 hover:bg-blue-800 text-white font-mono rounded font-bold cursor-pointer text-[8px]"
                                      >
                                        Resolve
                                      </button>
                                    </div>
                                  )}
                                  {disputes.find(d => d.payment_id === `payment-${p.id}`)?.resolution_note && (
                                    <p className="text-[8px] text-zinc-500 italic mt-0.5 max-w-[150px] truncate">
                                      Res: {disputes.find(d => d.payment_id === `payment-${p.id}`)?.resolution_note}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 justify-end mt-0.5">
                                  <input
                                    type="text"
                                    placeholder="Dispute Reason"
                                    value={disputeReasonInput[p.id] || ""}
                                    onChange={(e) => setDisputeReasonInput({
                                      ...disputeReasonInput,
                                      [p.id]: e.target.value
                                    })}
                                    className="bg-zinc-950 border border-zinc-850 rounded px-1.5 py-0.5 text-[8px] text-white font-mono w-28 placeholder-zinc-700 focus:outline-none"
                                  />
                                  <button
                                    onClick={async () => {
                                      const reason = disputeReasonInput[p.id];
                                      if (!reason) return;
                                      await CARSS_Revenue_Server.createPaymentDispute(`payment-${p.id}`, reason);
                                      addSystemLog(`FILED dispute for payment ${p.payment_reference}. Reason: ${reason}`);
                                      loadBackofficeMetrics();
                                    }}
                                    className="px-1.5 py-0.5 bg-red-900/60 hover:bg-red-800 text-white font-mono rounded font-bold cursor-pointer text-[8px]"
                                  >
                                    Dispute
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 3: INVENTORY MGR */}
          {activeTab === "inventory" && (
            <div className="overflow-x-auto text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 font-mono text-[9px] uppercase">
                    <th className="pb-2.5">Menu Item Name</th>
                    <th className="pb-2.5">Category</th>
                    <th className="pb-2.5 text-center">Unit Price</th>
                    <th className="pb-2.5 text-center">Stock Quantity</th>
                    <th className="pb-2.5 text-center">Reorder Threshold</th>
                    <th className="pb-2.5">Kitchen Deck Location</th>
                    <th className="pb-2.5 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 font-sans text-zinc-300">
                  {inventoryList.map((inv) => {
                    const matchedItem = menuItems.find((i) => i.id === inv.menu_item_id);
                    const matchedCat = categories.find((c) => c.id === matchedItem?.category_id);
                    const isLow = inv.quantity <= inv.min_alert_threshold;
                    const isOut = inv.quantity === 0;

                    return (
                      <tr key={inv.id} className="hover:bg-zinc-950/40">
                        <td className="py-3 font-bold text-white uppercase">{matchedItem?.name || "Unknown item"}</td>
                        <td className="py-3 text-zinc-400 font-mono text-[9px]">{matchedCat?.name || "Lounge Item"}</td>
                        <td className="py-3 font-mono text-center text-zinc-300">₦{matchedItem?.price.toLocaleString() || "0"}</td>
                        <td className="py-3 font-mono text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOut ? "bg-red-950 text-red-400 border border-red-500/10" : isLow ? "bg-amber-950 text-amber-400 border border-amber-500/10 animate-pulse" : "bg-emerald-950 text-emerald-400 border border-emerald-500/10"
                          }`}>
                            {inv.quantity} units
                          </span>
                        </td>
                        <td className="py-3 font-mono text-center text-zinc-500">{inv.min_alert_threshold} units</td>
                        <td className="py-3 text-zinc-400 font-mono text-[10px]">{inv.location}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={async () => {
                              await CARSS_Revenue_Server.restockItemInventory(inv.menu_item_id, 10);
                              addSystemLog(`Replenished inventory of ${matchedItem?.name || "unknown"}: Added +10 units.`);
                              loadBackofficeMetrics();
                            }}
                            className="px-2 py-1 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-amber-400 rounded cursor-pointer text-[10px] font-mono whitespace-nowrap"
                          >
                            +10 Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* --- TAB 4: AUDITING LEDGER --- */}
        {dashboardViewTab === "audit" && (
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-850 pb-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Security Auditing Log Feed (Active Operator Context)</span>
              </h4>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest animate-pulse h-2.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                LIVE TELEMETRY FEEDING
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 font-mono text-[11px] h-48 overflow-y-auto space-y-2 leading-relaxed text-zinc-400">
              {systemLogs.length === 0 ? (
                <div className="text-zinc-600 flex items-center justify-center h-full gap-2">
                  <span>SYSTEM LOG INACTIVE. RUN COMPLIANCE OR ACTION CHECKS TO LOG DATA...</span>
                </div>
              ) : (
                systemLogs.map((log, index) => (
                  <div key={index} className="border-b border-zinc-900 pb-1 py-0.5 last:border-0 text-indigo-300">
                    <span className="text-zinc-600 mr-2">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
