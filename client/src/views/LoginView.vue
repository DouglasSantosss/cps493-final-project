<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUsersStore } from '../stores/users'

const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()

const selectedUserId = ref<number | null>(null)

function handleLogin() {
  if (selectedUserId.value === null) return
  authStore.loginAs(selectedUserId.value)
  router.push('/')
}
</script>

<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-4">
        <div class="box mt-5">
          <h1 class="title is-3 has-text-centered">
            <span class="icon has-text-info"><i class="fas fa-dumbbell"></i></span>
            FitTrack
          </h1>
          <p class="subtitle has-text-centered">Select a user to log in</p>

          <div class="field">
            <label class="label">User</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="selectedUserId">
                  <option :value="null" disabled>-- Pick a user --</option>
                  <option v-for="user in usersStore.users" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.role }})
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="field mt-4">
            <button
              class="button is-info is-fullwidth"
              @click="handleLogin"
              :disabled="selectedUserId === null"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
