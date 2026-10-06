
function required(name:string, value:string | undefined): string {

    if (!value){
        throw new Error("The ${name} enviroment variable is missing, please check your .env.local");
    }

    return value;
}

export const env = {

    supabaseUrl: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),

}