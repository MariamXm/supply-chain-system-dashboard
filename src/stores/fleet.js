import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CONTAINERS } from '@/config/env'
import { getFleetSummaries } from '@/services/fleetService'

/** One-line health summary per container, for the fleet overview. */
export const useFleetStore = defineStore('fleet', () => {
  const items = ref(Object.fromEntries(CONTAINERS.map((id) => [id, { id, state: 'loading' }])))

  async function load() {
    const summaries = await getFleetSummaries()
    for (const s of summaries) {
      // keep the last good data if a refresh fails
      if (s.state === 'ready' || items.value[s.id]?.state !== 'ready') items.value[s.id] = s
    }
  }

  return { items, load }
})
