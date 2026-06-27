/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";

// Fetching Supabase environment variables safely
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || "https://placeholder-project-id.supabase.co";
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key-abc123xyz";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function toUUID(str: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) {
    return str;
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  const part2 = str.length.toString(16).padStart(4, "0");
  const part3 = "4000";
  const part4 = "8000";
  const part5 = hex.split("").reverse().join("").padEnd(12, "0");
  return `${hex}-${part2}-${part3}-${part4}-${part5}`;
}

export function isSupabaseConfigured(): boolean {
  const env = (import.meta as any).env || {};
  return (
    !!env.VITE_SUPABASE_URL &&
    !!env.VITE_SUPABASE_ANON_KEY &&
    env.VITE_SUPABASE_URL !== "https://placeholder-project-id.supabase.co"
  );
}
