import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/src/lib/env";
import type { Database } from "./database.types";

export function createClient() {

    return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);

}
