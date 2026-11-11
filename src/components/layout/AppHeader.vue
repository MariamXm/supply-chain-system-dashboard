<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuditStore } from '@/stores/audit'

const route = useRoute()
const router = useRouter()
const store = useAuditStore()

const current = computed(() => route.params.containerID ?? '')
const draft = ref(current.value)
watch(current, (id) => (draft.value = id))

function submit() {
  const id = draft.value.trim()
  if (!id) return
  // Same ID again = re-audit; a new ID navigates (the URL stays shareable).
  if (id === current.value) store.audit(id, { force: true })
  else router.push({ name: 'audit', params: { containerID: id } })
}
</script>

<template>
  <header class="bg-ink text-white">
    <div class="mx-auto max-w-7xl px-4 py-5 md:px-6">
      <div class="border-b border-white/15 pb-4">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-glacier-bright">Project</p>
        <h1 class="mt-1 text-xl font-bold tracking-tight md:text-2xl">
          Supply Chain Management - TraceChain
        </h1>
        <div class="mt-2 flex flex-col gap-1 text-sm text-white/70 sm:flex-row sm:gap-5">
          <p><span class="font-medium text-white/90">Members:</span> Mariam Mahmood, Minahil Fatima</p>
          <p><span class="font-medium text-white/90">Supervisor:</span> Dr. Muhammad Babar Ali</p>
        </div>
      </div>

      <div class="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Cold-Chain Ledger Audit</h2>
          <p class="mt-1 text-sm text-white/70">
            ESP32 sensor → AWS Lambda → Pinata IPFS → Sepolia, verified end to end.
          </p>
        </div>

        <form class="flex w-full gap-2 md:w-auto" role="search" @submit.prevent="submit">
          <label for="container-id" class="sr-only">Container ID</label>
          <input
            id="container-id"
            v-model="draft"
            type="text"
            autocomplete="off"
            placeholder="Container ID, e.g. CONT-001"
            class="w-full rounded-md border border-white/25 bg-white/10 px-3.5 py-2 text-sm text-white placeholder-white/50 md:w-72"
          />
          <button
            type="submit"
            :disabled="!draft.trim() || store.status === 'loading'"
            class="whitespace-nowrap rounded-md bg-glacier-bright px-4 py-2 text-sm font-semibold text-ink hover:bg-white disabled:opacity-50"
          >
            {{ store.status === 'loading' ? 'Auditing…' : 'Audit' }}
          </button>
        </form>
      </div>
    </div>
  </header>
</template>
