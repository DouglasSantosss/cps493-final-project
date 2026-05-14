<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useAuthStore } from '../stores/auth'
import { useActivitiesStore } from '../stores/activities'
import type { Activity } from '../../../server/types'
import { api } from '../services/myfetch'
import ActivityModal from '../components/ActivityModal.vue'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

const items = ref<Activity[]>([])
const page = ref(1)
const pageSize = 20
const total = ref(0)
const isLoading = ref(false)
const allLoaded = ref(false)

const scrollContainer = ref<HTMLElement | null>(null)

async function loadMore() {
  if (isLoading.value || allLoaded.value) return
  isLoading.value = true

  try {
    const response = await api<{
      data: Activity[]
      isSuccess: boolean
      total: number
      page: number
      pageSize: number
    }>(`activities/me/page?page=${page.value}&pageSize=${pageSize}`)

    if (response.isSuccess) {
      items.value.push(...response.data)
      total.value = response.total

      if (items.value.length >= response.total) {
        allLoaded.value = true
      } else {
        page.value++
      }
    }
  } catch (err) {
    console.error('Failed to load activities:', err)
  } finally {
    isLoading.value = false
  }
}

useInfiniteScroll(
  scrollContainer,
  () => { loadMore() },
  { distance: 200 },
)

onMounted(async () => {
  await loadMore()
})

const showModal = ref(false)
const editingActivity = ref<Activity | null>(null)

function openAdd() {
  editingActivity.value = null
  showModal.value = true
}

function openEdit(activity: Activity) {
  editingActivity.value = { ...activity }
  showModal.value = true
}

async function handleDelete(id: number) {
  if (confirm('Are you sure you want to delete this activity?')) {
    await activitiesStore.deleteActivity(id)
    items.value = items.value.filter((a) => a.id !== id)
    total.value--
  }
}

async function handleSave(data: Omit<Activity, 'id' | 'userId'>) {
  if (!authStore.currentUser) return

  if (editingActivity.value) {
    await activitiesStore.updateActivity(editingActivity.value.id, data)
    const idx = items.value.findIndex((a) => a.id === editingActivity.value!.id)
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...data }
    }
  } else {
    await activitiesStore.addActivity({ ...data, userId: authStore.currentUser.id })
    items.value = []
    page.value = 1
    allLoaded.value = false
    await loadMore()
  }

  showModal.value = false
}

function activityIcon(type: string) {
  const icons: Record<string, string> = {
    Running: 'fa-running',
    Cycling: 'fa-bicycle',
    Swimming: 'fa-swimmer',
    Weightlifting: 'fa-dumbbell',
    Yoga: 'fa-spa',
    Walking: 'fa-walking',
    Hiking: 'fa-mountain',
    Other: 'fa-heartbeat',
  }
  return icons[type] ?? 'fa-heartbeat'
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <h1 class="title level-item">My Activities</h1>
        </div>
        <div class="level-right">
          <span class="tag is-info is-light level-item mr-3" v-if="total > 0">
            Showing {{ items.length }} of {{ total }}
          </span>
          <button class="button is-info level-item" @click="openAdd">
            <span class="icon"><i class="fas fa-plus"></i></span>
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      <div v-if="items.length === 0 && !isLoading" class="notification is-light">
        No activities logged yet. Click <strong>Add Activity</strong> to get started!
      </div>

      <div ref="scrollContainer" style="max-height: 70vh; overflow-y: auto;">
        <table class="table is-striped is-hoverable is-fullwidth" v-if="items.length > 0">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Distance</th>
              <th>Calories</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in items" :key="activity.id">
              <td>
                <span class="icon has-text-info">
                  <i class="fas" :class="activityIcon(activity.type)"></i>
                </span>
                {{ activity.type }}
              </td>
              <td>{{ activity.title }}</td>
              <td>{{ activity.date }}</td>
              <td>{{ activity.duration }} min</td>
              <td>{{ activity.distance ? activity.distance + ' km' : '—' }}</td>
              <td>{{ activity.calories ? activity.calories + ' kcal' : '—' }}</td>
              <td class="is-size-7">{{ activity.notes || '—' }}</td>
              <td>
                <div class="buttons">
                  <button class="button is-small is-warning is-light" @click="openEdit(activity)">
                    <span class="icon"><i class="fas fa-edit"></i></span>
                  </button>
                  <button class="button is-small is-danger is-light" @click="handleDelete(activity.id)">
                    <span class="icon"><i class="fas fa-trash"></i></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

       
        <div v-if="isLoading" class="p-4">
          <div class="is-skeleton mb-3" style="height: 2rem; width: 100%;"></div>
          <div class="is-skeleton mb-3" style="height: 2rem; width: 100%;"></div>
          <div class="is-skeleton mb-3" style="height: 2rem; width: 100%;"></div>
        </div>

        <div v-if="allLoaded && items.length > 0" class="has-text-centered has-text-grey p-4">
          All activities loaded
        </div>
      </div>

      <ActivityModal
        :show="showModal"
        :activity="editingActivity"
        @close="showModal = false"
        @save="handleSave"
      />
    </div>
  </section>
</template>

<style scoped>
.mr-3 { margin-right: 0.75rem; }
.p-4 { padding: 1rem; }
.mb-3 { margin-bottom: 0.75rem; }
</style>
