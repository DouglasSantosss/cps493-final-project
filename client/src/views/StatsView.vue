<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useActivitiesStore } from '../stores/activities'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

const myActivities = computed(() => {
  if (!authStore.currentUser) return []
  return activitiesStore.getByUser(authStore.currentUser.id)
})

const totalActivities = computed(() => myActivities.value.length)

const totalDuration = computed(() =>
  myActivities.value.reduce((sum, a) => sum + a.duration, 0),
)

const totalCalories = computed(() =>
  myActivities.value.reduce((sum, a) => sum + (a.calories ?? 0), 0),
)

const totalDistance = computed(() =>
  myActivities.value.reduce((sum, a) => sum + (a.distance ?? 0), 0),
)

const avgDuration = computed(() =>
  totalActivities.value > 0 ? Math.round(totalDuration.value / totalActivities.value) : 0,
)

const avgDistance = computed(() =>
  totalActivities.value > 0
    ? (totalDistance.value / totalActivities.value).toFixed(1)
    : '0.0',
)

const typeCounts = computed(() => {
  const counts: Record<string, number> = {}
  myActivities.value.forEach((a) => {
    counts[a.type] = (counts[a.type] ?? 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
})

const mostCommonType = computed(() => typeCounts.value[0]?.[0] ?? 'N/A')

const weeklyData = computed(() => {
  const result: { label: string; count: number }[] = []
  const now = new Date()

  for (let i = 3; i >= 0; i--) {
    const start = new Date(now)
    start.setDate(now.getDate() - (i + 1) * 7)

    const end = new Date(now)
    end.setDate(now.getDate() - i * 7)

    const count = myActivities.value.filter((a) => {
      const d = new Date(a.date)
      return d >= start && d < end
    }).length

    result.push({ label: `Week ${4 - i}`, count })
  }
  return result
})

const maxWeekCount = computed(() => Math.max(...weeklyData.value.map((w) => w.count), 1))

const maxTypeCount = computed(() =>
  typeCounts.value.length > 0 ? typeCounts.value[0][1] : 1,
)
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title">My Stats</h1>
      <p class="subtitle">Your fitness activity summary</p>

      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Total Activities</p>
            <p class="title is-2 has-text-info">{{ totalActivities }}</p>
          </div>
        </div>
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Total Duration</p>
            <p class="title is-2 has-text-success">
              {{ totalDuration }}<span class="is-size-5 ml-1">min</span>
            </p>
          </div>
        </div>
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Total Distance</p>
            <p class="title is-2 has-text-warning">
              {{ totalDistance.toFixed(1) }}<span class="is-size-5 ml-1">km</span>
            </p>
          </div>
        </div>
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Calories Burned</p>
            <p class="title is-2 has-text-danger">
              {{ totalCalories }}<span class="is-size-5 ml-1">kcal</span>
            </p>
          </div>
        </div>
      </div>

      <div class="columns mt-2">
        <div class="column is-half">
          <div class="box">
            <h3 class="title is-5">Activity Breakdown</h3>
            <div v-if="typeCounts.length === 0" class="has-text-grey">
              No data yet. Start logging activities!
            </div>
            <div v-else>
              <div v-for="[type, count] in typeCounts" :key="type" class="mb-3">
                <div class="level is-mobile mb-1">
                  <div class="level-left">
                    <span class="level-item">{{ type }}</span>
                  </div>
                  <div class="level-right">
                    <span class="tag is-info level-item">{{ count }}</span>
                  </div>
                </div>
                <progress
                  class="progress is-info"
                  :value="count"
                  :max="maxTypeCount"
                ></progress>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="box">
            <h3 class="title is-5">Last 4 Weeks</h3>
            <div v-if="totalActivities === 0" class="has-text-grey">No data yet.</div>
            <div v-else>
              <div v-for="week in weeklyData" :key="week.label" class="mb-3">
                <div class="level is-mobile mb-1">
                  <div class="level-left">
                    <span class="level-item">{{ week.label }}</span>
                  </div>
                  <div class="level-right">
                    <span class="tag is-success level-item">{{ week.count }}</span>
                  </div>
                </div>
                <progress
                  class="progress is-success"
                  :value="week.count"
                  :max="maxWeekCount"
                ></progress>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="box">
        <h3 class="title is-5">Averages</h3>
        <div class="columns">
          <div class="column">
            <p>
              <span class="icon has-text-info"><i class="fas fa-clock"></i></span>
              <strong>Avg. session duration:</strong> {{ avgDuration }} min
            </p>
          </div>
          <div class="column">
            <p>
              <span class="icon has-text-warning"><i class="fas fa-road"></i></span>
              <strong>Avg. distance:</strong> {{ avgDistance }} km
            </p>
          </div>
          <div class="column">
            <p>
              <span class="icon has-text-success"><i class="fas fa-star"></i></span>
              <strong>Favorite activity:</strong> {{ mostCommonType }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
