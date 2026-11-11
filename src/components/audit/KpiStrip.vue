<script setup>
import { computed } from 'vue'
import { formatTemp, formatTimestamp } from '@/utils/format'

const props = defineProps({
  containerId: { type: String, required: true },
  summary: { type: Object, required: true },
})

const intact = computed(() => props.summary.verified === props.summary.total)
const inRange = computed(() => props.summary.compliant === props.summary.total)
const pct = computed(() => (props.summary.total ? (props.summary.verified / props.summary.total) * 100 : 0))
</script>

<template>
  <dl class="grid grid-cols-2 divide-x divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface lg:grid-cols-4 lg:divide-y-0">
    <div class="p-4">
      <dt class="text-sm text-ink-soft">Container</dt>
      <dd class="mt-1 truncate font-mono text-xl font-bold">{{ containerId }}</dd>
      <dd class="mt-1 text-sm text-ink-soft">{{ summary.total }} packets on record</dd>
    </div>

    <div class="p-4">
      <dt class="text-sm text-ink-soft">Hashes matching the chain</dt>
      <dd class="mt-1 text-xl font-bold" :class="intact ? 'text-safe' : 'text-alert'">
        {{ summary.verified }} of {{ summary.total }}
      </dd>
      <dd class="mt-2 h-1.5 overflow-hidden rounded-full bg-frost" role="img" :aria-label="`${Math.round(pct)} percent verified`">
        <span class="block h-full rounded-full transition-all" :class="intact ? 'bg-safe' : 'bg-alert'" :style="{ width: pct + '%' }"></span>
      </dd>
    </div>

    <div class="p-4">
      <dt class="text-sm text-ink-soft">Readings at or below −18 °C</dt>
      <dd class="mt-1 text-xl font-bold" :class="inRange ? 'text-safe' : 'text-alert'">
        {{ summary.compliant }} of {{ summary.total }}
      </dd>
      <dd class="mt-1 text-sm text-ink-soft">
        {{ inRange ? 'No temperature excursions' : `${summary.total - summary.compliant} excursion(s)` }}
      </dd>
    </div>

    <div class="p-4">
      <dt class="text-sm text-ink-soft">Latest reading</dt>
      <dd class="mt-1 text-xl font-bold">{{ formatTemp(summary.latest?.telemetry.temperature) }}</dd>
      <dd class="mt-1 text-sm text-ink-soft">{{ formatTimestamp(summary.latest?.timestamp) }}</dd>
    </div>
  </dl>
</template>
