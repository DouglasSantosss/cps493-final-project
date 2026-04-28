import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, DataEnvelope, LoginResponse } from '../../../server/types'
import { api } from '../services/myfetch'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const error = ref<string | null>(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const response = await api<DataEnvelope<LoginResponse>>('users/login', { email, password })
      if (response.isSuccess && response.data) {
        currentUser.value = response.data.user as User
        token.value = response.data.token
        localStorage.setItem('token', response.data.token)
        return true
      }
      return false
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    currentUser.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  async function fetchCurrentUser(): Promise<boolean> {
    if (!token.value) return false
    try {
      const response = await api<DataEnvelope<User>>('users/me')
      if (response.isSuccess && response.data) {
        currentUser.value = response.data
        return true
      }
      logout()
      return false
    } catch (_e) {
      logout()
      return false
    }
  }

  return { currentUser, token, error, loading, isLoggedIn, isAdmin, login, logout, fetchCurrentUser }
})
