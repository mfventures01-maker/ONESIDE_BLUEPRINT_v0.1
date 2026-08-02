import { supabase } from '../supabase/client';

export interface RpcResponse<T = any> {
  data: T | null;
  error: any;
}

export const rpcClient = {
  async call<T = any>(method: string, params?: Record<string, any>): Promise<RpcResponse<T>> {
    const { data, error } = await supabase.rpc(method, params);
    if (error) {
      console.error(`[RPC Error - ${method}]:`, error);
    }
    return { data, error };
  }
};
