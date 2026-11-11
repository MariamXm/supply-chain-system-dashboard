<script setup>
import { computed } from 'vue'

const props = defineProps({
  index: { type: Number, required: true },
  title: { type: String, required: true },
  state: { type: String, default: 'neutral', validator: (v) => ['neutral', 'ok', 'fail'].includes(v) },
  last: Boolean,
})
const node = computed(() => ({ neutral: 'bg-glacier', ok: 'bg-safe', fail: 'bg-alert' })[props.state])
</script>

<template>
  <div class="min-w-0">
    <div class="flex items-center gap-2">
      <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white" :class="node">{{ index }}</span>
      <h4 class="shrink-0 text-sm font-semibold">{{ title }}</h4>
      <span v-if="!last" class="hidden h-px flex-1 bg-line md:block" aria-hidden="true"></span>
    </div>
    <div class="mt-3 space-y-1.5 text-sm"><slot /></div>
  </div>
</template>
