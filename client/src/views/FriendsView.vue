<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUsersStore } from '../stores/users'
import { useActivitiesStore } from '../stores/activities'
import type { User } from '../../../server/types'

const authStore = useAuthStore()
const usersStore = useUsersStore()
const activitiesStore = useActivitiesStore()

onMounted(async () => {
  if (authStore.isAdmin) {
    await usersStore.loadAll()
  }
  await activitiesStore.loadFriendsActivities()
})

const friends = computed(() => {
  if (!authStore.currentUser) return []
  const result: User[] = []
  for (const id of authStore.currentUser.friendIds) {
    const user = usersStore.getUserById(id)
    if (user) result.push(user)
  }
  return result
})

const friendActivities = computed(() => {
  if (!authStore.currentUser) return []
  const ids = authStore.currentUser.friendIds
  const all = ids.flatMap((id) => activitiesStore.getByUser(id))
  return all.sort((a, b) => b.date.localeCompare(a.date))
})

function getUserName(userId: number) {
  return usersStore.getUserById(userId)?.name ?? 'Unknown'
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
      <h1 class="title">Friends Feed</h1>
      <p class="subtitle">See what your friends have been up to</p>

      <div class="columns">
        <div class="column is-3">
          <div class="box">
            <h3 class="title is-5">
              <span class="icon has-text-info"><i class="fas fa-users"></i></span>
              Your Friends
            </h3>

            <div v-if="friends.length === 0" class="has-text-grey is-size-7">
              No friends added yet.
            </div>

            <div v-else>
              <div class="media mb-3" v-for="friend in friends" :key="friend.id">
                <div class="media-left">
                  <span class="icon has-text-info">
                    <i class="fas fa-user-circle fa-lg"></i>
                  </span>
                </div>
                <div class="media-content">
                  <p class="has-text-weight-semibold">{{ friend.name }}</p>
                  <p class="is-size-7 has-text-grey">{{ friend.email }}</p>
                  <span class="tag is-small" :class="friend.role === 'admin' ? 'is-danger' : 'is-info'">
                    {{ friend.role }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div v-if="friendActivities.length === 0" class="notification is-light">
            Your friends haven't logged any activities yet.
          </div>

          <div class="box mb-3" v-for="activity in friendActivities" :key="activity.id">
            <div class="media">
              <div class="media-left">
                <span class="icon is-large has-text-info">
                  <i class="fas fa-2x" :class="activityIcon(activity.type)"></i>
                </span>
              </div>
              <div class="media-content">
                <p class="title is-5 mb-1">{{ activity.title }}</p>
                <p class="subtitle is-6 mb-2">
                  <strong>{{ getUserName(activity.userId) }}</strong>
                  &bull; {{ activity.type }} &bull; {{ activity.date }}
                </p>
                <div class="tags">
                  <span class="tag is-info is-light">{{ activity.duration }} min</span>
                  <span class="tag is-success is-light" v-if="activity.distance">
                    {{ activity.distance }} km
                  </span>
                  <span class="tag is-danger is-light" v-if="activity.calories">
                    {{ activity.calories }} kcal
                  </span>
                </div>
                <p class="is-size-7 has-text-grey mt-1" v-if="activity.notes">
                  "{{ activity.notes }}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
