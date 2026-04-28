<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsersStore } from '../stores/users'
import { useAuthStore } from '../stores/auth'
import type { User } from '../../../server/types'
import UserModal from '../components/UserModal.vue'

const usersStore = useUsersStore()
const authStore = useAuthStore()

onMounted(async () => {
  await usersStore.loadAll()
})

const showModal = ref(false)
const editingUser = ref<User | null>(null)

function openAdd() {
  editingUser.value = null
  showModal.value = true
}

function openEdit(user: User) {
  editingUser.value = { ...user }
  showModal.value = true
}

async function handleDelete(id: number) {
  if (id === authStore.currentUser?.id) {
    alert("You can't delete your own account!")
    return
  }
  if (confirm('Are you sure you want to delete this user?')) {
    await usersStore.deleteUser(id)
  }
}

async function handleSave(data: Omit<User, 'id'>) {
  if (editingUser.value) {
    await usersStore.updateUser(editingUser.value.id, data)
  } else {
    await usersStore.addUser(data)
  }
  showModal.value = false
}

function getFriendNames(friendIds: number[]) {
  return friendIds
    .map((id) => usersStore.getUserById(id)?.name)
    .filter(Boolean)
    .join(', ') || '—'
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <h1 class="title level-item">User Management</h1>
        </div>
        <div class="level-right">
          <button class="button is-info level-item" @click="openAdd">
            <span class="icon"><i class="fas fa-user-plus"></i></span>
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div class="notification is-info is-light">
        <span class="icon"><i class="fas fa-shield-alt"></i></span>
        Admin area — manage all user accounts here.
      </div>

      <div class="table-container">
        <table class="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Friends</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersStore.users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>
                {{ user.name }}
                <span v-if="user.id === authStore.currentUser?.id" class="tag is-warning is-light ml-1">you</span>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="tag" :class="user.role === 'admin' ? 'is-danger' : 'is-info'">{{ user.role }}</span>
              </td>
              <td class="is-size-7">{{ getFriendNames(user.friendIds) }}</td>
              <td>
                <div class="buttons">
                  <button class="button is-small is-warning is-light" @click="openEdit(user)">
                    <span class="icon"><i class="fas fa-edit"></i></span>
                  </button>
                  <button class="button is-small is-danger is-light" @click="handleDelete(user.id)" :disabled="user.id === authStore.currentUser?.id">
                    <span class="icon"><i class="fas fa-trash"></i></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <UserModal :show="showModal" :user="editingUser" @close="showModal = false" @save="handleSave" />
    </div>
  </section>
</template>
