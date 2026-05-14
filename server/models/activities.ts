import type { Activity } from "../types"
import { getDb } from "./supabase"

function toActivity(row: any): Activity {
    return {
        id: row.id,
        userId: row.user_id,
        type: row.type,
        title: row.title,
        duration: row.duration,
        distance: row.distance ?? undefined,
        calories: row.calories ?? undefined,
        date: row.date,
        notes: row.notes ?? undefined,
    }
}

function toRow(activity: Partial<Omit<Activity, "id">>) {
    const row: Record<string, unknown> = {}
    if (activity.userId !== undefined) row.user_id = activity.userId
    if (activity.type !== undefined) row.type = activity.type
    if (activity.title !== undefined) row.title = activity.title
    if (activity.duration !== undefined) row.duration = activity.duration
    if (activity.distance !== undefined) row.distance = activity.distance
    if (activity.calories !== undefined) row.calories = activity.calories
    if (activity.date !== undefined) row.date = activity.date
    if (activity.notes !== undefined) row.notes = activity.notes
    return row
}

export async function getAll() {
    const { data, error } = await getDb().from("activities").select("*").order("date", { ascending: false })
    if (error) throw { status: 500, message: error.message }
    const list = (data || []).map(toActivity)
    return { list, count: list.length }
}

export async function get(id: number) {
    const { data, error } = await getDb().from("activities").select("*").eq("id", id).single()
    if (error || !data) throw { status: 404, message: "Activity not found" }
    return toActivity(data)
}

export async function getByUserId(userId: number) {
    const { data, error } = await getDb().from("activities").select("*").eq("user_id", userId).order("date", { ascending: false })
    if (error) throw { status: 500, message: error.message }
    const list = (data || []).map(toActivity)
    return { list, count: list.length }
}

export async function getByUserIds(userIds: number[]) {
    const { data, error } = await getDb().from("activities").select("*").in("user_id", userIds).order("date", { ascending: false })
    if (error) throw { status: 500, message: error.message }
    return (data || []).map(toActivity)
}

export async function create(activity: Omit<Activity, "id">) {
    const { data, error } = await getDb().from("activities").insert(toRow(activity) as any).select().single()
    if (error) throw { status: 500, message: error.message }
    return toActivity(data)
}

export async function update(id: number, updateData: Partial<Omit<Activity, "id">>) {
    const { data, error } = await getDb().from("activities").update(toRow(updateData)).eq("id", id).select().single()
    if (error || !data) throw { status: 404, message: "Activity not found" }
    return toActivity(data)
}

export async function remove(id: number) {
    const activity = await get(id)
    const { error } = await getDb().from("activities").delete().eq("id", id)
    if (error) throw { status: 500, message: error.message }
    return activity
}

export async function removeByUserId(userId: number) {
    const { data, error } = await getDb().from("activities").delete().eq("user_id", userId).select()
    if (error) throw { status: 500, message: error.message }
    return (data || []).length
}


export async function getByUserIdPaginated(userId: number, page: number, pageSize: number) {
    const offset = (page - 1) * pageSize

    const { count, error: countError } = await getDb()
        .from("activities")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

    if (countError) throw { status: 500, message: countError.message }

    const { data, error } = await getDb()
        .from("activities")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .range(offset, offset + pageSize - 1)

    if (error) throw { status: 500, message: error.message }
    const list = (data || []).map(toActivity)
    return { list, total: count || 0, page, pageSize }
}

