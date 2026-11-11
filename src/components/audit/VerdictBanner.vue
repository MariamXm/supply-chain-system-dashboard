<script setup>
import { computed } from 'vue'

const props = defineProps({ summary: { type: Object, required: true } })

const failed = computed(() => props.summary.total - props.summary.verified)
const excursions = computed(() => props.summary.total - props.summary.compliant)
const intact = computed(() => failed.value === 0)
</script>

<template>
  <div
    role="status"
    class="flex flex-wrap items-center justify-between gap-3 rounded-lg px-5 py-4"
    :class="intact ? 'bg-safe-soft' : 'bg-alert-soft'"
  >
    <div>
      <p class="text-lg font-bold" :class="intact ? 'text-safe' : 'text-alert'">
        {{ intact ? 'Data integrity confirmed' : `${failed} ${failed === 1 ? 'packet' : 'packets'} failed verification` }}
      </p>
      <p class="text-sm text-ink">
        {{ intact ? 'Every packet matches the hash anchored on Sepolia.' : 'Stored data no longer matches what was anchored on-chain.' }}
      </p>
    </div>
    <p v-if="excursions" class="text-sm font-semibold text-alert">
      {{ excursions }} temperature {{ excursions === 1 ? 'excursion' : 'excursions' }}
    </p>
  </div>
</template>
