<script setup>
defineProps({
  tone: { type: String, default: 'neutral', validator: (v) => ['safe', 'alert', 'neutral'].includes(v) },
  label: { type: String, required: true },
})
const tones = { safe: 'bg-safe-soft text-safe', alert: 'bg-alert-soft text-alert', neutral: 'bg-frost text-ink-soft' }
const dots = { safe: 'bg-safe', alert: 'bg-alert', neutral: 'bg-ink-soft' }
</script>

<template>
  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="tones[tone]">
    <span class="h-1.5 w-1.5 rounded-full" :class="dots[tone]" aria-hidden="true"></span>
    {{ label }}
  </span>
</template>
