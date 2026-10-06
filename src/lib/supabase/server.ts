import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/src/lib/env";
import type { Database } from "./database.types";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {

        cookies: {
            getAll(){   return cookieStore.getAll()   },
            setAll(cookiesToSet){
                try{

                    cookiesToSet.forEach(({ name, value, options }) =>

                        cookieStore.set(name, value, options)
                    );
                }catch{

                }
            },
        },
    });
}