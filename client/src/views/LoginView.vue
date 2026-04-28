<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/')
  }
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
          <p class="subtitle has-text-centered">Log in to continue</p>

          <form @submit.prevent="handleLogin">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input class="input" type="email" v-model="email" placeholder="email@example.com" required />
              </div>
            </div>

            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input class="input" type="password" v-model="password" placeholder="Password" required />
              </div>
            </div>

            <div v-if="authStore.error" class="notification is-danger is-light">
              {{ authStore.error }}
            </div>

            <div class="field mt-4">
              <button
                class="button is-info is-fullwidth"
                type="submit"
                :class="{ 'is-loading': authStore.loading }"
                :disabled="authStore.loading"
              >
                Log In
              </button>
            </div>
          </form>

          <hr />
          <div class="content is-small">
            <p><strong>Demo Accounts:</strong></p>
            <p>Admin: admin@fit.com / admin123</p>
            <p>User: alice@fit.com / alice123</p>
            <p>User: bob@fit.com / bob123</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
