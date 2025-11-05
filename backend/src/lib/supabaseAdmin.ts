import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const _supabaseUrl = process.env.SUPABASE_URL!;
const _supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!_supabaseUrl || !_supabaseServiceRoleKey) {
  throw new Error(
    "Supabase admin not initialized. Add 'SUPABASE_URL' and 'SUPABASE_SERVICE_ROLE_KEY' to your environment variables"
  );
}

export const supabaseAdmin = createClient(
  _supabaseUrl,
  _supabaseServiceRoleKey
);
