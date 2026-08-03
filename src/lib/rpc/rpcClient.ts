import { supabase } from '../supabase/client';
export const rpcClient = { call: async (method: string, params: any) => { const { data, error } = await supabase.rpc(method, params); if (error) throw error; return data; } };
