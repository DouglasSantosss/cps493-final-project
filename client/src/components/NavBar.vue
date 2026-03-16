<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isActive = ref(false)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar is-info" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <RouterLink to="/" class="navbar-item has-text-white has-text-weight-bold is-size-5">
          <span class="icon mr-1"><i class="fas fa-dumbbell"></i></span>
          FitTrack
        </RouterLink>

        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': isActive }"
          @click="isActive = !isActive"
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isActive }">
        <div class="navbar-start" v-if="authStore.isLoggedIn">
          <RouterLink to="/" class="navbar-item" active-class="is-active" exact-active-class="is-active">
            <span class="icon"><i class="fas fa-home"></i></span>
            <span>Dashboard</span>
          </RouterLink>

          <RouterLink to="/activities" class="navbar-item" active-class="is-active">
            <span class="icon"><i class="fas fa-running"></i></span>
            <span>Activities</span>
          </RouterLink>

          <RouterLink to="/friends" class="navbar-item" active-class="is-active">
            <span class="icon"><i class="fas fa-users"></i></span>
            <span>Friends</span>
          </RouterLink>

          <RouterLink to="/stats" class="navbar-item" active-class="is-active">
            <span class="icon"><i class="fas fa-chart-bar"></i></span>
            <span>Stats</span>
          </RouterLink>

          <RouterLink v-if="authStore.isAdmin" to="/admin" class="navbar-item" active-class="is-active">
            <span class="icon"><i class="fas fa-shield-alt"></i></span>
            <span>Admin</span>
          </RouterLink>
        </div>

        <div class="navbar-end">
          <div class="navbar-item" v-if="authStore.isLoggedIn">
            <div class="buttons">
              <span class="button is-light is-static">
                <span class="icon"><i class="fas fa-user"></i></span>
                <span>{{ authStore.currentUser?.name }}</span>
              </span>
              <button class="button is-danger is-light" @click="handleLogout">
                <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div class="navbar-item" v-else>
            <RouterLink to="/login" class="button is-primary">
              Log In
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
