export { DataEnvelope, DataListEnvelope } from "./dataEnvelopes"

export type UserRole = "admin" | "user"

export type User = {
    id: number
    name: string
    email: string
    password: string
    role: UserRole
    friendIds: number[]
}

export type ActivityType =
    | "Running"
    | "Cycling"
    | "Swimming"
    | "Weightlifting"
    | "Yoga"
    | "Walking"
    | "Hiking"
    | "Other"

export type Activity = {
    id: number
    userId: number
    type: ActivityType
    title: string
    duration: number
    distance?: number
    calories?: number
    date: string
    notes?: string
}

export type ExerciseType = {
    id: number
    name: string
    category: string
    caloriesPerMinute: number
    icon: string
}

export type LoginResponse = {
    user: Omit<User, "password">
    token: string
}
