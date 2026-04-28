import type { ExerciseType } from "../types"
import { getDb } from "./supabase"

function toExerciseType(row: any): ExerciseType {
    return {
        id: row.id,
        name: row.name,
        category: row.category,
        caloriesPerMinute: row.calories_per_minute,
        icon: row.icon,
    }
}

export async function getAll() {
    const { data, error } = await getDb().from("exercise_types").select("*").order("name")
    if (error) throw { status: 500, message: error.message }
    const list = (data || []).map(toExerciseType)
    return { list, count: list.length }
}

export async function get(id: number) {
    const { data, error } = await getDb().from("exercise_types").select("*").eq("id", id).single()
    if (error || !data) throw { status: 404, message: "Exercise type not found" }
    return toExerciseType(data)
}

export async function getByName(name: string) {
    const { data } = await getDb().from("exercise_types").select("*").eq("name", name).single()
    return data ? toExerciseType(data) : null
}

export async function create(typeData: Omit<ExerciseType, "id">) {
    const existing = await getByName(typeData.name)
    if (existing) throw { status: 400, message: "Exercise type already exists" }

    const { data, error } = await getDb()
        .from("exercise_types")
        .insert({
            name: typeData.name,
            category: typeData.category,
            calories_per_minute: typeData.caloriesPerMinute,
            icon: typeData.icon,
        })
        .select()
        .single()
    if (error) throw { status: 500, message: error.message }
    return toExerciseType(data)
}

export async function update(id: number, updateData: Partial<Omit<ExerciseType, "id">>) {
    const row: Record<string, unknown> = {}
    if (updateData.name !== undefined) row.name = updateData.name
    if (updateData.category !== undefined) row.category = updateData.category
    if (updateData.caloriesPerMinute !== undefined) row.calories_per_minute = updateData.caloriesPerMinute
    if (updateData.icon !== undefined) row.icon = updateData.icon

    const { data, error } = await getDb().from("exercise_types").update(row).eq("id", id).select().single()
    if (error || !data) throw { status: 404, message: "Exercise type not found" }
    return toExerciseType(data)
}

export async function remove(id: number) {
    const item = await get(id)
    const { error } = await getDb().from("exercise_types").delete().eq("id", id)
    if (error) throw { status: 500, message: error.message }
    return item
}

export async function calculateCalories(typeName: string, duration: number): Promise<number> {
    const type = await getByName(typeName)
    const rate = type?.caloriesPerMinute ?? 5
    return Math.round(rate * duration)
}
