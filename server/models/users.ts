import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import type { User } from "../types"
import { getDb } from "./supabase"

function toUser(row: any): User {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        friendIds: row.friend_ids || [],
    }
}

function sanitize(user: User): Omit<User, "password"> {
    const { password: _pw, ...rest } = user
    return rest
}

export async function getAll() {
    const { data, error } = await getDb().from("users").select("*")
    if (error) throw { status: 500, message: error.message }
    const list = (data || []).map(toUser).map(sanitize)
    return { list, count: list.length }
}

export async function get(id: number) {
    const { data, error } = await getDb().from("users").select("*").eq("id", id).single()
    if (error || !data) throw { status: 404, message: "User not found" }
    return sanitize(toUser(data))
}
  
export async function create(userData: Omit<User, "id">) {
    const { data: existing } = await getDb().from("users").select("id").eq("email", userData.email).single()
    if (existing) throw { status: 400, message: "Email already exists" }

    const hashedPassword = await bcrypt.hash(userData.password || "password", 10)
    const { data, error } = await getDb()
        .from("users")
        .insert({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || "user",
            friend_ids: userData.friendIds || [],
        } as any)
        .select()
        .single()
    if (error) throw { status: 500, message: error.message }
    return sanitize(toUser(data))
}

export async function update(id: number, updateData: Partial<Omit<User, "id">>) {
    const row: Record<string, unknown> = {}
    if (updateData.name !== undefined) row.name = updateData.name
    if (updateData.email !== undefined) row.email = updateData.email
    if (updateData.role !== undefined) row.role = updateData.role
    if (updateData.friendIds !== undefined) row.friend_ids = updateData.friendIds
    if (updateData.password) row.password = await bcrypt.hash(updateData.password, 10)

    const { data, error } = await getDb().from("users").update(row).eq("id", id).select().single()
    if (error || !data) throw { status: 404, message: "User not found" }
    return sanitize(toUser(data))
}

export async function remove(id: number) {
    const user = await get(id)
    const { error } = await getDb().from("users").delete().eq("id", id)
    if (error) throw { status: 500, message: error.message }
    return user
}

export async function verifyPassword(email: string, password: string) {
    const { data, error } = await getDb().from("users").select("*").eq("email", email).single()
    if (error || !data) return null
    const user = toUser(data)
    const isValid = await bcrypt.compare(password, user.password || "")
    if (!isValid) return null
    return sanitize(user)
}

export async function search(query: string) {
    const { data, error } = await getDb().from("users").select("*").or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    if (error) throw { status: 500, message: error.message }
    return (data || []).map(toUser).map(sanitize)
}

export async function login(email: string, password: string) {
    const user = await verifyPassword(email, password)
    if (!user) throw { status: 401, message: "Invalid email or password" }
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "your-secret-key-change-in-production",
        { expiresIn: "24h" },
    )
    return { token, user }
}