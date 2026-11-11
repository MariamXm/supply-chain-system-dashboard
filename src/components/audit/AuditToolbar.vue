<script setup>
import { computed } from 'vue'

const props = defineProps({
  filter: { type: String, required: true },
  sort: { type: String, required: true },
  counts: { type: Object, required: true },
  demoMode: Boolean,
})
const emit = defineEmits(['update:filter', 'update:sort', 'update:demoMode', 'export'])

const filters = computed(() => [
  { key: 'all', label: 'All' },
  { key: 'compliant', label: 'In range' },
  { key: 'warning', label: 'Excursions' },
  { key: 'mismatch', label: 'Hash mismatch' },
])
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="inline-flex overflow-hidden rounded-md border border-line bg-surface" role="group" aria-label="Filter packets">
      <button
        v-for="f in filters"
        :key="f.key"
        class="border-r border-line px-3 py-1.5 text-sm last:border-r-0"
        :class="props.filter === f.key ? 'bg-ink font-semibold text-white' : 'hover:bg-frost'"
        :aria-pressed="props.filter === f.key"
        @click="emit('update:filter', f.key)"
      >
        {{ f.label }} <span class="font-mono text-xs opacity-70">{{ counts[f.key] }}</span>
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2 text-sm">
      <button
        class="rounded-md border border-line bg-surface px-3 py-1.5 hover:border-glacier"
        @click="emit('update:sort', sort === 'newest' ? 'oldest' : 'newest')"
      >
        {{ sort === 'newest' ? 'Newest first' : 'Oldest first' }}
      </button>
      <button class="rounded-md border border-line bg-surface px-3 py-1.5 hover:border-glacier" @click="emit('export', 'csv')">Export CSV</button>
      <button class="rounded-md border border-line bg-surface px-3 py-1.5 hover:border-glacier" @click="emit('export', 'json')">Export JSON</button>

      <button
        role="switch"
        :aria-checked="demoMode"
        class="flex items-center gap-2 rounded-md border px-3 py-1.5"
        :class="demoMode ? 'border-alert bg-alert-soft text-alert' : 'border-line bg-surface hover:border-glacier'"
        @click="emit('update:demoMode', !demoMode)"
      >
        <span class="relative h-4 w-7 rounded-full transition-colors" :class="demoMode ? 'bg-alert' : 'bg-line'">
          <span class="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all" :class="demoMode ? 'left-3.5' : 'left-0.5'"></span>
        </span>
        Tamper demo
      </button>
    </div>
  </div>
</template>
