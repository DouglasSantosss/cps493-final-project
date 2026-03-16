<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useActivitiesStore } from '../stores/activities'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

const myActivities = computed(() => {
  if (!authStore.currentUser) return []
  return activitiesStore.getByUser(authStore.currentUser.id)
})

const totalDuration = computed(() => myActivities.value.reduce((sum, a) => sum + a.duration, 0))
const totalCalories = computed(() =>
  myActivities.value.reduce((sum, a) => sum + (a.calories ?? 0), 0),
)
const totalDistance = computed(() =>
  myActivities.value.reduce((sum, a) => sum + (a.distance ?? 0), 0),
)

const recentActivities = computed(() => {
  return [...myActivities.value].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)
})

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
      <h1 class="title">Welcome back, {{ authStore.currentUser?.name }}!</h1>
      <h2 class="subtitle">Here's a quick look at your fitness activity</h2>

      <div class="columns">
        <div class="column">
          <div class="box has-text-centered">
            <p class="heading">Total Activities</p>
            <p class="title has-text-info">{{ myActivities.length }}</p>
          </div>
        </div>
        <div class="column">
          <div class="box has-text-centered">
            <p class="heading">Total Time</p>
            <p class="title has-text-success">{{ totalDuration }} <span class="is-size-6">min</span></p>
          </div>
        </div>
        <div class="column">
          <div class="box has-text-centered">
            <p class="heading">Total Distance</p>
            <p class="title has-text-warning">
              {{ totalDistance.toFixed(1) }} <span class="is-size-6">km</span>
            </p>
          </div>
        </div>
        <div class="column">
          <div class="box has-text-centered">
            <p class="heading">Calories Burned</p>
            <p class="title has-text-danger">{{ totalCalories }} <span class="is-size-6">kcal</span></p>
          </div>
        </div>
      </div>

      <div class="level mt-4">
        <div class="level-left">
          <h3 class="title is-4 level-item">Recent Activities</h3>
        </div>
        <div class="level-right">
          <RouterLink to="/activities" class="button is-info is-light level-item">
            View All
          </RouterLink>
        </div>
      </div>

      <div v-if="myActivities.length === 0" class="notification is-light">
        You haven't logged any activities yet.
        <RouterLink to="/activities">Add your first one!</RouterLink>
      </div>

      <div class="columns is-multiline" v-else>
        <div class="column is-half" v-for="activity in recentActivities" :key="activity.id">
          <div class="box">
            <div class="media">
              <div class="media-left">
                <span class="icon is-large has-text-info">
                  <i class="fas fa-2x" :class="activityIcon(activity.type)"></i>
                </span>
              </div>
              <div class="media-content">
                <p class="title is-5 mb-1">{{ activity.title }}</p>
                <p class="subtitle is-6 mb-2">{{ activity.type }} &bull; {{ activity.date }}</p>
                <div class="tags">
                  <span class="tag is-info is-light">{{ activity.duration }} min</span>
                  <span class="tag is-success is-light" v-if="activity.distance">
                    {{ activity.distance }} km
                  </span>
                  <span class="tag is-danger is-light" v-if="activity.calories">
                    {{ activity.calories }} kcal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
