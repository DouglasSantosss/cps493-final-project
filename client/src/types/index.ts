export type UserRole = 'admin' | 'user'

export type User = {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
  friendIds: number[]
}

export type ActivityType =
  | 'Running'
  | 'Cycling'
  | 'Swimming'
  | 'Weightlifting'
  | 'Yoga'
  | 'Walking'
  | 'Hiking'
  | 'Other'

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
