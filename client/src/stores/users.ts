import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types'

const initialUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@fit.com',
    password: 'admin123',
    role: 'admin',
    friendIds: [2, 3],
  },
  {
    id: 2,
    name: 'Alice Brown',
    email: 'alice@fit.com',
    password: 'alice123',
    role: 'user',
    friendIds: [3, 4],
  },
  {
    id: 3,
    name: 'Bob Smith',
    email: 'bob@fit.com',
    password: 'bob123',
    role: 'user',
    friendIds: [2, 4],
  },
  {
    id: 4,
    name: 'Carol Davis',
    email: 'carol@fit.com',
    password: 'carol123',
    role: 'user',
    friendIds: [2, 3],
  },
]

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>(initialUsers)

  function addUser(data: Omit<User, 'id'>) {
    const newId = users.value.length > 0 ? Math.max(...users.value.map((u) => u.id)) + 1 : 1
    users.value.push({ ...data, id: newId })
  }

  function updateUser(id: number, data: Partial<Omit<User, 'id'>>) {
    const idx = users.value.findIndex((u) => u.id === id)
    if (idx !== -1) {
      users.value[idx] = { ...users.value[idx], ...data }
    }
  }

  function deleteUser(id: number) {
    users.value = users.value.filter((u) => u.id !== id)
  }

  function getUserById(id: number): User | undefined {
    return users.value.find((u) => u.id === id)
  }

  return { users, addUser, updateUser, deleteUser, getUserById }
})
