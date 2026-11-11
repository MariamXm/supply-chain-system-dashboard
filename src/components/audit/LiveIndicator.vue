<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  enabled: Boolean,
  lastUpdated: { type: Number, default: null },
  failed: Boolean,
})
defineEmits(['update:enabled'])

const now = ref(Date.now())
let timer
onMounted(() => (timer = setInterval(() => (now.value = Date.now()), 1000)))
onUnmounted(() => clearInterval(timer))

const ago = computed(() =>
  props.lastUpdated ? Math.max(0, Math.round((now.value - props.lastUpdated) / 1000)) : null,
)
</script>

<template>
  <div class="flex items-center justify-end gap-3 text-sm text-ink-soft">
    <span v-if="enabled" class="flex items-center gap-2" role="status">
      <span class="relative flex h-2 w-2" aria-hidden="true">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" :class="failed ? 'bg-alert' : 'bg-safe'"></span>
        <span class="relative inline-flex h-2 w-2 rounded-full" :class="failed ? 'bg-alert' : 'bg-safe'"></span>
      </span>
      {{ failed ? 'Connection lost, retrying' : 'Live' }}<template v-if="ago !== null">, updated {{ ago }} s ago</template>
    </span>
    <span v-else>Live updates paused</span>
    <button
      class="rounded-md border border-line bg-surface px-3 py-1 hover:border-glacier"
      @click="$emit('update:enabled', !enabled)"
    >
      {{ enabled ? 'Pause' : 'Resume' }}
    </button>
  </div>
</template>
