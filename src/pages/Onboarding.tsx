/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Upload, FileText, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { useRoleStore } from "../state/Contexts";

interface OnboardedDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  onboardedAt: string;
}

export default function Onboarding() {
  const { addSystemLog } = useRoleStore();
  const [dragActive, setDragActive] = useState(false);
  const [documents, setDocuments] = useState<OnboardedDocument[]>([
    {
      id: "doc-1",
      name: "CARSS_Charter_Compliance_v4.pdf",
      size: "2.4 MB",
      type: "application/pdf",
      onboardedAt: new Date(Date.now() - 43200 * 1000).toLocaleDateString(),
    },
  ]);
  const [onboardingSuccess, setOnboardingSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const newDoc: OnboardedDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type || "unknown/binary",
      onboardedAt: new Date().toLocaleDateString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addSystemLog(`Trust credential file onboarded: ${file.name} (${newDoc.size})`);
    setOnboardingSuccess(`Document "${file.name}" onboarded into secure custody successfully.`);
    setTimeout(() => setOnboardingSuccess(""), 5000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerManualBrowse = () => {
    fileInputRef.current?.click();
  };

  const removeDoc = (id: string, name: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    addSystemLog(`Trust document revoked from custody: ${name}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Intro */}
        <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 relative overflow-hidden backdrop-blur">
          <div className="absolute top-0 right-0 w-80 h-40 bg-indigo-505/5 rounded-full blur-[85px] -z-10" />
          <h3 className="text-xl font-bold font-mono tracking-tight text-white mb-2 uppercase">
            Trust Credential Onboarding
          </h3>
          <p className="text-xs text-zinc-400 font-sans max-w-xl leading-relaxed">
            The Constitution commands absolute documentation verification. Use this interface to upload compliance charters, certificates, or operational security profiles.
          </p>
        </div>

        {onboardingSuccess && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-400 font-mono text-xs flex gap-3 items-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{onboardingSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel - File Upload Zone */}
          <div className="md:col-span-2 space-y-6">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-64 transition ${
                dragActive
                  ? "border-indigo-500 bg-indigo-950/5"
                  : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.json,.csv,.txt,.png"
              />

              <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
                <Upload className="w-5 h-5" />
              </div>

              <h4 className="font-mono text-xs text-white uppercase tracking-wider mb-2">
                Drag Custody File Here
              </h4>
              <p className="text-[11px] text-zinc-500 max-w-xs mb-6 font-sans">
                Drag and drop your compliance charter, or click below to select a file manually. Supports JSON, PDF, CSV and Text up to 25MB.
              </p>

              <button
                onClick={triggerManualBrowse}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[11px] uppercase tracking-wider font-semibold rounded-xl transition cursor-pointer"
              >
                Browse Systems Directory
              </button>
            </div>
          </div>

          {/* Right Panel - Decal & Assets under Active Custody */}
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between">
            <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-200 border-b border-zinc-850 pb-3 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Current Assets In Custody</span>
            </h4>

            {documents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 py-12 text-center text-xs font-mono">
                <AlertCircle className="w-8 h-8 text-zinc-700 mb-2" />
                <span>NO RECORD IN DEPOSIT</span>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto max-h-72 pr-1">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-between gap-3 shadow-inner"
                  >
                    <div className="overflow-hidden min-w-0 flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-950/40 border border-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate min-w-0">
                        <span className="block font-mono text-[11px] text-zinc-200 truncate uppercase">
                          {doc.name}
                        </span>
                        <span className="block text-[9px] font-mono text-zinc-500 font-medium">
                          {doc.size} • ONBOARDED ON {doc.onboardedAt}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDoc(doc.id, doc.name)}
                      className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition cursor-pointer"
                      title="Revoke and wipe document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
