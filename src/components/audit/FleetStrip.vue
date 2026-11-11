<script setup>
import { formatTemp, timeAgo } from '@/utils/format'

defineProps({
  items: { type: Array, required: true },
  activeId: { type: String, default: '' },
})
defineEmits(['select'])

const issues = (c) => (c.total - c.verified) + (c.total - c.compliant)
const healthy = (c) => c.state === 'ready' && issues(c) === 0
const hashStatus = (c) =>
  c.total === c.verified
    ? 'Hashes verified'
    : `${c.total - c.verified} hash issue${c.total - c.verified === 1 ? '' : 's'}`
const temperatureStatus = (c) => {
  const count = c.total - c.compliant
  return `${count} temperature issue${count === 1 ? '' : 's'}`
}
</script>

<template>
  <section aria-label="Containers">
    <ul class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      <li v-for="c in items" :key="c.id">
        <button
          class="h-full w-full rounded-lg border border-l-4 bg-surface p-3 text-left hover:border-glacier"
          :class="[
            c.state !== 'ready' ? 'border-l-line' : healthy(c) ? 'border-l-safe' : 'border-l-alert',
            c.id === activeId ? 'border-glacier bg-frost' : 'border-line',
          ]"
          :aria-pressed="c.id === activeId"
          @click="$emit('select', c.id)"
        >
          <span class="block truncate font-mono text-sm font-bold">{{ c.id }}</span>
          <template v-if="c.state === 'ready'">
            <span class="mt-1 block text-xl font-bold">{{ formatTemp(c.latestTemp) }}</span>
            <span class="block text-sm" :class="healthy(c) ? 'text-safe' : 'text-alert'">
              {{ healthy(c) ? 'All clear' : `${hashStatus(c)}, ${temperatureStatus(c)}` }}
            </span>
            <span class="block text-xs text-ink-soft">{{ c.total }} packets, last {{ timeAgo(c.latestAt) }}</span>
          </template>
          <span v-else-if="c.state === 'loading'" class="mt-1 block text-sm text-ink-soft">Loading…</span>
          <span v-else class="mt-1 block text-sm text-ink-soft">Unavailable</span>
        </button>
      </li>
    </ul>
  </section>
</template>
