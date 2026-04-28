import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, DataEnvelope, DataListEnvelope } from '../../../server/types'
import { api } from '../services/myfetch'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])

  async function loadAll() {
    const response = await api<DataListEnvelope<User>>('users')
    users.value = response.data
  }

  async function addUser(data: Omit<User, 'id'>) {
    const response = await api<DataEnvelope<User>>('users/create', data)
    users.value.push(response.data)
  }

  async function updateUser(id: number, data: Partial<Omit<User, 'id'>>) {
    const response = await api<DataEnvelope<User>>(`users/${id}`, data, { method: 'PATCH' })
    const idx = users.value.findIndex((u) => u.id === id)
    if (idx !== -1) {
      users.value[idx] = response.data
    }
  }

  async function deleteUser(id: number) {
    await api<DataEnvelope<User>>(`users/${id}`, undefined, { method: 'DELETE' })
    users.value = users.value.filter((u) => u.id !== id)
  }

  function getUserById(id: number): User | undefined {
    return users.value.find((u) => u.id === id)
  }

  return { users, loadAll, addUser, updateUser, deleteUser, getUserById }
})
