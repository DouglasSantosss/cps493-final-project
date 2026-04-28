import { createClient } from "@supabase/supabase-js"

let db: ReturnType<typeof createClient>

export function connect() {
    const supabaseUrl = process.env.SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SECRET_KEY!
    db = createClient(supabaseUrl, supabaseKey)
    console.log("Connected to Supabase")
    return db
}

export function getDb() {
    if (!db) {
        return connect()
    }
    return db
}

export { db }
