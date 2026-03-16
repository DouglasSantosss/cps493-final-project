<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User, UserRole } from '../types'
import { useUsersStore } from '../stores/users'

const props = defineProps<{
  show: boolean
  user: User | null
}>()

const emit = defineEmits<{
  close: []
  save: [data: Omit<User, 'id'>]
}>()

const usersStore = useUsersStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'user' as UserRole,
  friendIds: [] as number[],
})

watch(
  () => props.show,
  (val) => {
    if (!val) return
    if (props.user) {
      form.value = {
        name: props.user.name,
        email: props.user.email,
        password: props.user.password,
        role: props.user.role,
        friendIds: [...props.user.friendIds],
      }
    } else {
      form.value = { name: '', email: '', password: '', role: 'user', friendIds: [] }
    }
  },
)

function handleSubmit() {
  emit('save', { ...form.value })
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background" @click="emit('close')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ user ? 'Edit User' : 'Add User' }}</p>
        <button class="delete" aria-label="close" @click="emit('close')"></button>
      </header>

      <section class="modal-card-body">
        <div class="field">
          <label class="label">Full Name</label>
          <div class="control">
            <input class="input" type="text" v-model="form.name" placeholder="Full name" required />
          </div>
        </div>

        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input
              class="input"
              type="email"
              v-model="form.email"
              placeholder="email@example.com"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="text" v-model="form.password" placeholder="Password" required />
          </div>
        </div>

        <div class="field">
          <label class="label">Role</label>
          <div class="control">
            <div class="select">
              <select v-model="form.role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Friends</label>
          <div class="control">
            <div
              v-for="u in usersStore.users"
              :key="u.id"
              class="mb-1"
            >
              <label class="checkbox" v-if="u.id !== (props.user?.id ?? -1)">
                <input type="checkbox" :value="u.id" v-model="form.friendIds" />
                {{ u.name }}
                <span class="tag is-small ml-1" :class="u.role === 'admin' ? 'is-danger' : 'is-info'">
                  {{ u.role }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-info" @click="handleSubmit">
            {{ user ? 'Save Changes' : 'Add User' }}
          </button>
          <button class="button" @click="emit('close')">Cancel</button>
        </div>
      </footer>
    </div>
  </div>
</template>
