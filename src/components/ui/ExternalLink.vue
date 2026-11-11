<script setup>
defineProps({
  href: { type: String, default: '' },
  label: { type: String, required: true },
  envVar: { type: String, default: '' }, // shown as a hint in dev when the link isn't configured
})
const isDev = import.meta.env.DEV
</script>

<template>
  <a
    v-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1.5 text-sm font-medium text-glacier underline-offset-2 hover:underline"
  >
    {{ label }}
    <svg viewBox="0 0 16 16" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span class="sr-only">(opens in a new tab)</span>
  </a>
  <span v-else-if="isDev && envVar" class="block text-xs text-ink-soft">Set {{ envVar }} to link {{ label }}</span>
</template>
