<script setup>
defineProps({ title: String, description: String })
</script>

<template>
  <div class="mx-auto max-w-xl space-y-4 rounded-lg border border-dashed border-line bg-surface px-6 py-14 text-center">
    <h2 class="text-lg font-semibold">{{ title }}</h2>
    <p v-if="description" class="text-sm text-ink-soft">{{ description }}</p>
    <slot />
  </div>
</template>
