import { createClient } from "@supabase/supabase-js";

// Placeholder fallbacks let the module load at build time.
// At runtime, real values from .env.local are required.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
);
