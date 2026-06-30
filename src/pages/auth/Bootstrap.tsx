/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Activity,
  Database,
  LockKeyhole,
  Info,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { carssApi } from "../../services/carssApi";

export default function Bootstrap() {
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI interactions
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password strength calculation helper
  const getStrengthInfo = (pwd: string) => {
    if (!pwd) return { score: 0, text: "Weak", color: "text-rose-500", barColor: "bg-slate-100" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) {
      return { score, text: "Weak", color: "text-rose-500", barColor: "bg-rose-500" };
    } else if (score === 3) {
      return { score, text: "Medium", color: "text-amber-500", barColor: "bg-amber-500" };
    } else {
      return { score, text: "Strong", color: "text-emerald-500", barColor: "bg-emerald-500" };
    }
  };

  const strength = getStrengthInfo(password);

  const handleBootstrapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validations
    if (!fullName.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await carssApi.bootstrap({
        fullName,
        email,
        password,
        confirmPassword,
      });

      if (response.success) {
        setSuccess(true);
        // Automatically route to compliance overview dashboard after a small delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(response.error || "An unexpected system-level error occurred during bootstrap.");
      }
    } catch (err: any) {
      setError(err.message || "A network or validation error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-x-hidden selection:bg-indigo-100">
      {/* Decorative ambient background blur vectors */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* LEFT PANEL: Branding & Info Columns */}
        <div className="lg:col-span-5 space-y-8 py-4 lg:py-8">
          
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Shield className="w-5.5 h-5.5 fill-current" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-slate-950 tracking-tight">CARSS</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 font-medium uppercase tracking-wider">
                Commercial AR System Suite
              </p>
            </div>
          </div>

          {/* Heading and Lead */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              <span className="text-indigo-600 block">SuperAdmin</span>
              <span>Bootstrap</span>
            </h1>
            <p className="text-slate-500 font-medium text-base max-w-sm">
              Securely initialize the CARSS platform by creating the SuperAdmin account.
            </p>
          </div>

          {/* Feature Badge Box */}
          <div className="flex items-start gap-3 bg-white border border-slate-100 p-4 rounded-xl shadow-sm max-w-md">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              This account will have full system access and can manage all organizations and settings.
            </p>
          </div>

          {/* Benefit List */}
          <div className="space-y-4 max-w-md">
            {/* Point 1 */}
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-indigo-50 border border-indigo-100/40 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                <LockKeyhole className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Secure by Design</h4>
                <p className="text-xs text-slate-500 font-medium">Built with enterprise-grade security and encryption</p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-indigo-50 border border-indigo-100/40 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                <Database className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Direct to Supabase</h4>
                <p className="text-xs text-slate-500 font-medium">Account is created and synced directly to Supabase</p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-indigo-50 border border-indigo-100/40 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                <User className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Role: SuperAdmin</h4>
                <p className="text-xs text-slate-500 font-medium">Full platform access and authority by default</p>
              </div>
            </div>

            {/* Point 4 */}
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-indigo-50 border border-indigo-100/40 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Audit Ready</h4>
                <p className="text-xs text-slate-500 font-medium">All actions are logged and traceable</p>
              </div>
            </div>
          </div>

          {/* Left Footer copyright */}
          <div className="pt-4 border-t border-slate-200/50 max-w-sm">
            <p className="text-xs text-slate-400 font-medium font-mono">
              © 2025 CARSS. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: SuperAdmin Onboarding Form */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative">
            
            {/* In-tab switch header layout */}
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                className="flex-1 py-4 flex items-center justify-center gap-2 font-medium text-xs text-slate-400 uppercase tracking-wider bg-slate-50/50 opacity-60 border-r border-slate-100 cursor-not-allowed"
                disabled
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
              <button
                type="button"
                className="flex-1 py-4 flex items-center justify-center gap-2 font-bold text-xs text-indigo-600 uppercase tracking-wider border-b-2 border-indigo-600"
              >
                <User className="w-3.5 h-3.5" />
                <span>Create SuperAdmin</span>
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              
              {/* Informational Alert Badge */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-100/50 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700/95 font-medium leading-relaxed">
                  Create the initial SuperAdmin account. This will be the primary administrator of the CARSS platform.
                </p>
              </div>

              {/* Dynamic Error & Success Panel */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-rose-700 text-xs font-semibold"
                  >
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs font-semibold"
                  >
                    <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5 animate-bounce" />
                    <div>
                      <p className="font-bold text-emerald-950">Bootstrap Initialized Successfully!</p>
                      <p className="text-emerald-700 font-medium text-[11px] mt-0.5">Redirecting to system command desk...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bootstrap Form */}
              <form onSubmit={handleBootstrapSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Full Name
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading || success}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-300 pointer-events-none">
                      <div className="w-3.5 h-3.5 rounded bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500 select-none">···</div>
                    </span>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Email Address
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading || success}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                {/* Create Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Create Password
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading || success}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading || success}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 grid grid-cols-5 gap-1">
                        <div className={`h-1.5 rounded-full transition-colors duration-300 ${password.length > 0 ? strength.barColor : "bg-slate-100"}`} />
                        <div className={`h-1.5 rounded-full transition-colors duration-300 ${password.length >= 8 && strength.score >= 2 ? strength.barColor : "bg-slate-100"}`} />
                        <div className={`h-1.5 rounded-full transition-colors duration-300 ${password.length >= 8 && strength.score >= 3 ? strength.barColor : "bg-slate-100"}`} />
                        <div className={`h-1.5 rounded-full transition-colors duration-300 ${password.length >= 8 && strength.score >= 4 ? strength.barColor : "bg-slate-100"}`} />
                        <div className={`h-1.5 rounded-full transition-colors duration-300 ${password.length >= 10 && strength.score >= 4 ? strength.barColor : "bg-slate-100"}`} />
                      </div>
                      <span className={`text-[10px] font-bold font-mono tracking-wide w-12 text-right ${strength.color}`}>
                        {strength.text}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Use 8+ characters with a mix of letters, numbers & symbols
                    </p>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 group-focus-within:text-indigo-600 transition">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading || success}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading || success}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Account Sync Card */}
                <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-xl p-4 flex items-center justify-between gap-4 mt-2">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[11px] font-bold text-indigo-950">Account Sync</h5>
                      <p className="text-[10px] text-indigo-700/80 font-medium leading-normal mt-0.5">
                        This SuperAdmin account will be created and synced directly with your Supabase authentication and profiles table.
                      </p>
                    </div>
                  </div>
                  {/* Supabase Styled Logo with neon green bolt */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 shrink-0 select-none shadow-sm">
                    <svg className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.362 9.354H12.93L17.587.429a.386.386 0 00-.54-.483L4.852 9.418a.386.386 0 00.314.654h8.432l-4.657 8.925a.386.386 0 00.54.483l12.195-9.472a.386.386 0 00-.314-.654z" />
                    </svg>
                    <span className="text-[10px] font-extrabold font-sans text-slate-800 tracking-tight">supabase</span>
                  </div>
                </div>

                {/* Action Submit Button */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 cursor-pointer select-none transition active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4.5 h-4.5" />
                      <span>Create SuperAdmin Account</span>
                    </>
                  )}
                </button>

                {/* Secure footer message */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium font-mono pt-1">
                  <Lock className="w-3 h-3" />
                  <span>Your information is encrypted and secure</span>
                </div>

              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
