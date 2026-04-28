import { config } from "dotenv"
config()

import bcrypt from "bcrypt"
import { connect } from "./models/supabase"

async function seed() {
    try {
        const db = connect()
        console.log("Seeding database...")

        await db.from("activities").delete().neq("id", 0)
        await db.from("users").delete().neq("id", 0)
        console.log("✓ Cleared existing data")

        const users = [
            { name: "Admin User", email: "admin@fit.com", password: await bcrypt.hash("admin123", 10), role: "admin", friend_ids: [] as number[] },
            { name: "Alice Brown", email: "alice@fit.com", password: await bcrypt.hash("alice123", 10), role: "user", friend_ids: [] as number[] },
            { name: "Bob Smith", email: "bob@fit.com", password: await bcrypt.hash("bob123", 10), role: "user", friend_ids: [] as number[] },
            { name: "Carol Davis", email: "carol@fit.com", password: await bcrypt.hash("carol123", 10), role: "user", friend_ids: [] as number[] },
        ]

        const { data: insertedUsers, error: userError } = await db.from("users").insert(users).select()
        if (userError) throw userError
        console.log("✓ Users seeded")

        const ids = insertedUsers!.map((u: any) => u.id)
        await db.from("users").update({ friend_ids: [ids[1], ids[2]] }).eq("id", ids[0])
        await db.from("users").update({ friend_ids: [ids[2], ids[3]] }).eq("id", ids[1])
        await db.from("users").update({ friend_ids: [ids[1], ids[3]] }).eq("id", ids[2])
        await db.from("users").update({ friend_ids: [ids[1], ids[2]] }).eq("id", ids[3])
        console.log("✓ Friend relationships set")

        const activities = [
            { user_id: ids[1], type: "Running", title: "Morning Run", duration: 30, distance: 5, calories: 300, date: "2026-03-10", notes: "Felt really good today" },
            { user_id: ids[1], type: "Yoga", title: "Evening Yoga", duration: 45, calories: 150, date: "2026-03-11" },
            { user_id: ids[1], type: "Cycling", title: "Weekend Ride", duration: 60, distance: 20, calories: 450, date: "2026-03-08" },
            { user_id: ids[1], type: "Running", title: "Interval Training", duration: 25, distance: 4, calories: 280, date: "2026-03-12" },
            { user_id: ids[1], type: "Swimming", title: "Lap Swimming", duration: 40, distance: 1.5, calories: 350, date: "2026-03-07" },
            { user_id: ids[2], type: "Weightlifting", title: "Upper Body Day", duration: 50, calories: 250, date: "2026-03-10" },
            { user_id: ids[2], type: "Running", title: "Easy 5K", duration: 28, distance: 5, calories: 290, date: "2026-03-09" },
            { user_id: ids[2], type: "Hiking", title: "Trail Hike", duration: 120, distance: 8, calories: 600, date: "2026-03-08", notes: "Beautiful views at the top" },
            { user_id: ids[2], type: "Weightlifting", title: "Leg Day", duration: 45, calories: 220, date: "2026-03-12" },
            { user_id: ids[3], type: "Walking", title: "Evening Walk", duration: 30, distance: 2.5, calories: 120, date: "2026-03-11" },
            { user_id: ids[3], type: "Yoga", title: "Morning Flow", duration: 60, calories: 180, date: "2026-03-10" },
            { user_id: ids[3], type: "Cycling", title: "Spin Class", duration: 45, calories: 400, date: "2026-03-09" },
            { user_id: ids[3], type: "Running", title: "Park Run", duration: 35, distance: 5, calories: 320, date: "2026-03-13" },
            { user_id: ids[0], type: "Running", title: "Quick Lunch Run", duration: 20, distance: 3, calories: 200, date: "2026-03-11" },
            { user_id: ids[0], type: "Weightlifting", title: "Gym Session", duration: 60, calories: 300, date: "2026-03-13" },
        ]

        const { error: actError } = await db.from("activities").insert(activities)
        if (actError) throw actError
        console.log("✓ Activities seeded")

        console.log("\n Database seeded successfully!")
        console.log("\nDemo accounts:")
        console.log("  Admin: admin@fit.com / admin123")
        console.log("  User:  alice@fit.com / alice123")
        console.log("  User:  bob@fit.com / bob123")
        console.log("  User:  carol@fit.com / carol123")

        process.exit(0)
    } catch (error) {
        console.error("Seed error:", error)
        process.exit(1)
    }
}

seed()
