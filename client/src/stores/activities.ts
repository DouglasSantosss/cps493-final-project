import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Activity } from '../types'

const initialActivities: Activity[] = [
  {
    id: 1,
    userId: 2,
    type: 'Running',
    title: 'Morning Run',
    duration: 30,
    distance: 5,
    calories: 300,
    date: '2026-03-10',
    notes: 'Felt really good today',
  },
  { id: 2, userId: 2, type: 'Yoga', title: 'Evening Yoga', duration: 45, calories: 150, date: '2026-03-11' },
  {
    id: 3,
    userId: 2,
    type: 'Cycling',
    title: 'Weekend Ride',
    duration: 60,
    distance: 20,
    calories: 450,
    date: '2026-03-08',
  },
  {
    id: 4,
    userId: 2,
    type: 'Running',
    title: 'Interval Training',
    duration: 25,
    distance: 4,
    calories: 280,
    date: '2026-03-12',
  },
  {
    id: 5,
    userId: 2,
    type: 'Swimming',
    title: 'Lap Swimming',
    duration: 40,
    distance: 1.5,
    calories: 350,
    date: '2026-03-07',
  },
  {
    id: 6,
    userId: 3,
    type: 'Weightlifting',
    title: 'Upper Body Day',
    duration: 50,
    calories: 250,
    date: '2026-03-10',
  },
  {
    id: 7,
    userId: 3,
    type: 'Running',
    title: 'Easy 5K',
    duration: 28,
    distance: 5,
    calories: 290,
    date: '2026-03-09',
  },
  {
    id: 8,
    userId: 3,
    type: 'Hiking',
    title: 'Trail Hike',
    duration: 120,
    distance: 8,
    calories: 600,
    date: '2026-03-08',
    notes: 'Beautiful views at the top',
  },
  {
    id: 9,
    userId: 3,
    type: 'Weightlifting',
    title: 'Leg Day',
    duration: 45,
    calories: 220,
    date: '2026-03-12',
  },
  {
    id: 10,
    userId: 4,
    type: 'Walking',
    title: 'Evening Walk',
    duration: 30,
    distance: 2.5,
    calories: 120,
    date: '2026-03-11',
  },
  { id: 11, userId: 4, type: 'Yoga', title: 'Morning Flow', duration: 60, calories: 180, date: '2026-03-10' },
  {
    id: 12,
    userId: 4,
    type: 'Cycling',
    title: 'Spin Class',
    duration: 45,
    calories: 400,
    date: '2026-03-09',
  },
  {
    id: 13,
    userId: 4,
    type: 'Running',
    title: 'Park Run',
    duration: 35,
    distance: 5,
    calories: 320,
    date: '2026-03-13',
  },
  {
    id: 14,
    userId: 1,
    type: 'Running',
    title: 'Quick Lunch Run',
    duration: 20,
    distance: 3,
    calories: 200,
    date: '2026-03-11',
  },
  {
    id: 15,
    userId: 1,
    type: 'Weightlifting',
    title: 'Gym Session',
    duration: 60,
    calories: 300,
    date: '2026-03-13',
  },
]

export const useActivitiesStore = defineStore('activities', () => {
  const activities = ref<Activity[]>(initialActivities)

  function getByUser(userId: number): Activity[] {
    return activities.value.filter((a) => a.userId === userId)
  }

  function addActivity(data: Omit<Activity, 'id'>) {
    const newId = activities.value.length > 0 ? Math.max(...activities.value.map((a) => a.id)) + 1 : 1
    activities.value.push({ ...data, id: newId })
  }

  function updateActivity(id: number, data: Partial<Omit<Activity, 'id'>>) {
    const idx = activities.value.findIndex((a) => a.id === id)
    if (idx !== -1) {
      activities.value[idx] = { ...activities.value[idx], ...data } as Activity
    }
  }

  function deleteActivity(id: number) {
    activities.value = activities.value.filter((a) => a.id !== id)
  }

  return { activities, getByUser, addActivity, updateActivity, deleteActivity }
})
