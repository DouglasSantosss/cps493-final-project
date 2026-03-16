import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUsersStore } from './users'

export const useAuthStore = defineStore('auth', () => {
  const currentUserId = ref<number | null>(null)
  const usersStore = useUsersStore()

  const currentUser = computed(() => {
    if (currentUserId.value === null) return null
    return usersStore.users.find((u) => u.id === currentUserId.value) ?? null
  })

  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function loginAs(userId: number) {
    currentUserId.value = userId
  }

  function logout() {
    currentUserId.value = null
  }

  return { currentUser, isLoggedIn, isAdmin, loginAs, logout }
})
