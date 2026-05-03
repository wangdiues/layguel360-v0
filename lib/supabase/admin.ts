import { createClient } from "@supabase/supabase-js";

/**
 * Admin client using the service role key.
 * Bypasses RLS — use only in server actions and server-side code.
 * NEVER import this in client components.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
