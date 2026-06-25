/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { AlertTriangle, Bell, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";
import { useRoleStore } from "../state/Contexts";

interface SystemNotification {
  id: string;
  source: string;
  message: string;
  severity: "low" | "medium" | "high";
  triggeredAt: string;
}

export default function Notifications() {
  const { addSystemLog } = useRoleStore();
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: "notif-1",
      source: "REPLICATED_FSM",
      message: "Constitutional guard state transit initialized successfully.",
      severity: "low",
      triggeredAt: new Date(Date.now() - 3600 * 1000).toLocaleTimeString(),
    },
    {
      id: "notif-2",
      source: "SYSTEMS_INTEGRITY",
      message: "Daily auditing check completed. Compliance metric is 100%.",
      severity: "low",
      triggeredAt: new Date(Date.now() - 7200 * 1000).toLocaleTimeString(),
    },
  ]);
  const [customNotifyText, setCustomNotifyText] = useState("");

  const submitAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNotifyText.trim()) return;

    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      source: "MANUAL_DISPATCH",
      message: customNotifyText.trim(),
      severity: "medium",
      triggeredAt: new Date().toLocaleTimeString(),
    };

    setNotifications((prev) => [newNotif, ...prev]);
    addSystemLog(`Integrity Alert Dispatched: "${customNotifyText.trim()}"`);
    setCustomNotifyText("");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    addSystemLog("All dispatched alerts acknowledged and cleared by the operator.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Intro */}
        <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 relative overflow-hidden backdrop-blur">
          <div className="absolute top-0 right-0 w-80 h-40 bg-zinc-500/5 rounded-full blur-[90px] -z-10" />
          <h3 className="text-xl font-bold font-mono tracking-tight text-white mb-2 uppercase">
            Alert Dispatch Desk
          </h3>
          <p className="text-xs text-zinc-400 font-sans max-w-xl leading-relaxed">
            Monitor real-time compliance notifications and fire custom operational notices across authorized departments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dispatcher Form */}
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 h-fit space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-200 border-b border-zinc-850 pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Broadcast Dispatcher</span>
            </h4>

            <form onSubmit={submitAlert} className="space-y-4">
              <div>
                <label className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">
                  Notice Content Message
                </label>
                <textarea
                  value={customNotifyText}
                  onChange={(e) => setCustomNotifyText(e.target.value)}
                  placeholder="Enter notice parameters or warnings..."
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[11px] uppercase tracking-wider font-semibold rounded-xl transition cursor-pointer"
              >
                Broadcast Alert Log
              </button>
            </form>
          </div>

          {/* Alert Log Grid */}
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>Notice Dispatch Records</span>
              </h4>
              <button
                onClick={clearAllNotifications}
                className="text-[10px] font-mono text-zinc-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                CLEAR LOGS
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 py-16 text-center text-xs font-mono">
                <ShieldCheck className="w-10 h-10 text-zinc-800 mb-2.5" />
                <span>NO OUTSTANDING DISPATCH LOGS</span>
              </div>
            ) : (
              <div className="flex-1 space-y-3 max-h-96 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl flex gap-3.5 items-start shadow-inner"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                        notif.severity === "high"
                          ? "bg-red-950/20 border-red-500/10 text-red-400"
                          : notif.severity === "medium"
                          ? "bg-amber-950/20 border-amber-500/10 text-amber-500"
                          : "bg-indigo-950/20 border-indigo-505/10 text-indigo-400"
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2 font-mono text-[9px] font-semibold">
                        <span className="text-zinc-400 uppercase">{notif.source}</span>
                        <span className="text-zinc-600 font-medium">•</span>
                        <span className="text-zinc-500 uppercase">{notif.triggeredAt}</span>
                      </div>
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
