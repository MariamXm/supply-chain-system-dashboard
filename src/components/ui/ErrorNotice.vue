<script setup>
defineProps({ message: { type: String, required: true } })
defineEmits(['retry'])
</script>

<template>
  <div role="alert" class="mx-auto max-w-xl space-y-3 rounded-lg border border-alert/30 bg-alert-soft p-6">
    <h2 class="font-semibold text-alert">Couldn't load the audit</h2>
    <p class="text-sm text-ink">{{ message }}</p>
    <button class="rounded-md bg-alert px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-ink" @click="$emit('retry')">
      Try again
    </button>
  </div>
</template>
