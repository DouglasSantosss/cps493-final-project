<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Activity, ActivityType } from '../types'

const props = defineProps<{
  show: boolean
  activity: Activity | null
}>()

const emit = defineEmits<{
  close: []
  save: [data: Omit<Activity, 'id' | 'userId'>]
}>()

const activityTypes: ActivityType[] = [
  'Running',
  'Cycling',
  'Swimming',
  'Weightlifting',
  'Yoga',
  'Walking',
  'Hiking',
  'Other',
]

const today = new Date().toISOString().split('T')[0] ?? ''

const form = ref({
  type: 'Running' as ActivityType,
  title: '',
  duration: 30,
  distanceStr: '',
  caloriesStr: '',
  date: today,
  notes: '',
})

watch(
  () => props.show,
  (val) => {
    if (!val) return
    if (props.activity) {
      form.value = {
        type: props.activity.type,
        title: props.activity.title,
        duration: props.activity.duration,
        distanceStr: props.activity.distance?.toString() ?? '',
        caloriesStr: props.activity.calories?.toString() ?? '',
        date: props.activity.date,
        notes: props.activity.notes ?? '',
      }
    } else {
      form.value = {
        type: 'Running',
        title: '',
        duration: 30,
        distanceStr: '',
        caloriesStr: '',
        date: today,
        notes: '',
      }
    }
  },
)

function handleSubmit() {
  const distance = form.value.distanceStr ? parseFloat(form.value.distanceStr) : undefined
  const calories = form.value.caloriesStr ? parseInt(form.value.caloriesStr) : undefined

  emit('save', {
    type: form.value.type,
    title: form.value.title,
    duration: form.value.duration,
    distance,
    calories,
    date: form.value.date,
    notes: form.value.notes || undefined,
  })
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': show }">
    <div class="modal-background" @click="emit('close')"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ activity ? 'Edit Activity' : 'Add Activity' }}</p>
        <button class="delete" aria-label="close" @click="emit('close')"></button>
      </header>

      <section class="modal-card-body">
        <div class="field">
          <label class="label">Activity Type</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="form.type">
                <option v-for="t in activityTypes" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Title</label>
          <div class="control">
            <input
              class="input"
              type="text"
              v-model="form.title"
              placeholder="e.g. Morning Run"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Date</label>
          <div class="control">
            <input class="input" type="date" v-model="form.date" required />
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Duration (minutes)</label>
              <div class="control">
                <input class="input" type="number" v-model.number="form.duration" min="1" required />
              </div>
            </div>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">
                Distance (km) <span class="has-text-grey is-size-7">optional</span>
              </label>
              <div class="control">
                <input class="input" type="number" v-model="form.distanceStr" step="0.1" min="0" />
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">
            Calories Burned <span class="has-text-grey is-size-7">optional</span>
          </label>
          <div class="control">
            <input class="input" type="number" v-model="form.caloriesStr" min="0" />
          </div>
        </div>

        <div class="field">
          <label class="label">
            Notes <span class="has-text-grey is-size-7">optional</span>
          </label>
          <div class="control">
            <textarea class="textarea" v-model="form.notes" placeholder="How did it go?"></textarea>
          </div>
        </div>
      </section>

      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-info" @click="handleSubmit">
            {{ activity ? 'Save Changes' : 'Add Activity' }}
          </button>
          <button class="button" @click="emit('close')">Cancel</button>
        </div>
      </footer>
    </div>
  </div>
</template>
