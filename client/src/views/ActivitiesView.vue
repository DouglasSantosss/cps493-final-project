<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useActivitiesStore } from '../stores/activities'
import type { Activity } from '../types'
import ActivityModal from '../components/ActivityModal.vue'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

const myActivities = computed(() => {
  if (!authStore.currentUser) return []
  return [...activitiesStore.getByUser(authStore.currentUser.id)].sort((a, b) =>
    b.date.localeCompare(a.date),
  )
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

function handleDelete(id: number) {
  if (confirm('Are you sure you want to delete this activity?')) {
    activitiesStore.deleteActivity(id)
  }
}

function handleSave(data: Omit<Activity, 'id' | 'userId'>) {
  if (!authStore.currentUser) return

  if (editingActivity.value) {
    activitiesStore.updateActivity(editingActivity.value.id, data)
  } else {
    activitiesStore.addActivity({ ...data, userId: authStore.currentUser.id })
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
          <button class="button is-info level-item" @click="openAdd">
            <span class="icon"><i class="fas fa-plus"></i></span>
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      <div v-if="myActivities.length === 0" class="notification is-light">
        No activities logged yet. Click <strong>Add Activity</strong> to get started!
      </div>

      <div class="table-container" v-else>
        <table class="table is-striped is-hoverable is-fullwidth">
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
            <tr v-for="activity in myActivities" :key="activity.id">
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
                  <button
                    class="button is-small is-danger is-light"
                    @click="handleDelete(activity.id)"
                  >
                    <span class="icon"><i class="fas fa-trash"></i></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
