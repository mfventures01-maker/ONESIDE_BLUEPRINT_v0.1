/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        // We are allowed to update password
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      navigate("/auth/ceo");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 font-sans relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-505/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-md w-full">
        <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-500/20 via-indigo-500 to-indigo-500/20" />

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-mono text-white uppercase tracking-tight">
              Constitutional Password Reset
            </h2>
          </div>

          {error && (
            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-red-400 font-mono text-[11px] flex gap-2 items-start mb-6">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-emerald-400 font-mono text-[11px] flex gap-2 items-start mb-6">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Password updated successfully. Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-xl transition shadow-lg shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
