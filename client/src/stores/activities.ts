import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Activity, DataEnvelope, DataListEnvelope } from '../../../server/types'
import { api } from '../services/myfetch'

export const useActivitiesStore = defineStore('activities', () => {
  const activities = ref<Activity[]>([])

  async function loadMyActivities() {
    const response = await api<DataListEnvelope<Activity>>('activities/me')
    activities.value = response.data
  }

  async function loadFriendsActivities() {
    const response = await api<DataListEnvelope<Activity>>('activities/friends')
    // add friends activities without wiping out my own
    for (const activity of response.data) {
      if (!activities.value.find((a) => a.id === activity.id)) {
        activities.value.push(activity)
      }
    }
  }

  function getByUser(userId: number): Activity[] {
    return activities.value.filter((a) => a.userId === userId)
  }

  async function addActivity(data: Omit<Activity, 'id'>) {
    const response = await api<DataEnvelope<Activity>>('activities', data)
    activities.value.push(response.data)
  }

  async function updateActivity(id: number, data: Partial<Omit<Activity, 'id'>>) {
    const response = await api<DataEnvelope<Activity>>(`activities/${id}`, data, { method: 'PATCH' })
    const idx = activities.value.findIndex((a) => a.id === id)
    if (idx !== -1) {
      activities.value[idx] = response.data
    }
  }

  async function deleteActivity(id: number) {
    await api<DataEnvelope<Activity>>(`activities/${id}`, undefined, { method: 'DELETE' })
    activities.value = activities.value.filter((a) => a.id !== id)
  }

  return { activities, loadMyActivities, loadFriendsActivities, getByUser, addActivity, updateActivity, deleteActivity }
})
