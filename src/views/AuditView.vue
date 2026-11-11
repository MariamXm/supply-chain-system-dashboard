<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { CONTAINERS } from '@/config/env'
import { useAuditStore } from '@/stores/audit'
import { useFleetStore } from '@/stores/fleet'
import { useRecentContainers } from '@/composables/useRecentContainers'
import { downloadFile, recordsToCsv } from '@/utils/export'
import FleetStrip from '@/components/audit/FleetStrip.vue'
import VerdictBanner from '@/components/audit/VerdictBanner.vue'
import PipelineTrace from '@/components/audit/PipelineTrace.vue'
import KpiStrip from '@/components/audit/KpiStrip.vue'
import TemperatureTrace from '@/components/audit/TemperatureTrace.vue'
import LocationMap from '@/components/audit/LocationMap.vue'
import AuditToolbar from '@/components/audit/AuditToolbar.vue'
import PacketTable from '@/components/audit/PacketTable.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorNotice from '@/components/ui/ErrorNotice.vue'
import SkeletonPacket from '@/components/ui/SkeletonPacket.vue'

const props = defineProps({ containerID: { type: String, default: '' } })

const store = useAuditStore()
const fleet = useFleetStore()
const router = useRouter()
const { recent, remember } = useRecentContainers()

const PAGE_SIZE = 10
const visibleCount = ref(PAGE_SIZE)

onMounted(() => CONTAINERS.length && fleet.load())

const fleetItems = computed(() =>
  CONTAINERS.map((id) => {
    const item = fleet.items[id]
    if (id !== store.activeContainer || store.status !== 'success') return item

    const latest = store.records.at(-1)
    return {
      id,
      state: 'ready',
      total: store.summary.total,
      verified: store.summary.verified,
      compliant: store.summary.compliant,
      latestTemp: latest?.telemetry.temperature ?? null,
      latestAt: latest?.timestamp ?? null,
    }
  }),
)

watch(
  () => props.containerID,
  (id) => {
    visibleCount.value = PAGE_SIZE
    if (id) {
      remember(id)
      store.audit(id)
    } else {
      store.reset()
    }
  },
  { immediate: true },
)
watch(() => [store.statusFilter, store.sortOrder], () => (visibleCount.value = PAGE_SIZE))

const shown = computed(() => store.visibleRecords.slice(0, visibleCount.value))
const open = (id) => router.push({ name: 'audit', params: { containerID: id } })

function select(id) {
  store.selectPacket(id)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById('pipeline-trace')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

function exportAs(kind) {
  const name = `${store.activeContainer}-audit`
  const list = store.visibleRecords
  if (kind === 'csv') downloadFile(`${name}.csv`, recordsToCsv(list), 'text/csv')
  else downloadFile(`${name}.json`, JSON.stringify(list, null, 2), 'application/json')
}
</script>

<template>
  <div class="space-y-6">
    <FleetStrip v-if="CONTAINERS.length > 1" :items="fleetItems" :active-id="containerID" @select="open" />

    <!-- Idle -->
    <EmptyState
      v-if="store.status === 'idle'"
      title="Follow a container through the pipeline"
      description="Enter a container ID to trace its sensor readings from the ESP32 to the Sepolia contract."
    >
      <div v-if="recent.length" class="flex flex-wrap items-center justify-center gap-2">
        <span class="text-sm text-ink-soft">Recent:</span>
        <button
          v-for="id in recent"
          :key="id"
          class="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-sm hover:border-glacier"
          @click="open(id)"
        >
          {{ id }}
        </button>
      </div>
    </EmptyState>

    <!-- Loading -->
    <div v-else-if="store.status === 'loading'" class="space-y-4" aria-busy="true" aria-live="polite">
      <p class="text-sm text-ink-soft">Reading {{ store.activeContainer }} from the ledger…</p>
      <SkeletonPacket v-for="n in 3" :key="n" />
    </div>

    <!-- Error -->
    <ErrorNotice
      v-else-if="store.status === 'error'"
      :message="store.error"
      @retry="store.audit(store.activeContainer, { force: true })"
    />

    <!-- No data -->
    <EmptyState
      v-else-if="store.records.length === 0"
      :title="`No records for ${store.activeContainer}`"
      description="Check the container ID, or wait for the device to publish its first packet."
    />

    <!-- Dashboard -->
    <template v-else>
      <VerdictBanner :summary="store.summary" />
      <KpiStrip :container-id="store.activeContainer" :summary="store.summary" />

      <div class="grid gap-6 lg:grid-cols-3">
        <TemperatureTrace
          class="lg:col-span-2"
          :records="store.records"
          :selected-id="store.selectedRecord?.id"
          @select="select"
        />
        <LocationMap v-if="store.selectedRecord" :record="store.selectedRecord" />
      </div>

      <PipelineTrace
        v-if="store.selectedRecord"
        :record="store.selectedRecord"
        :following="store.following"
        :demo-mode="store.demoMode"
        @toggle-tamper="store.toggleTamper(store.selectedRecord.id)"
        @follow-latest="store.followLatest"
      />

      <section class="space-y-4" aria-label="Packets">
        <AuditToolbar
          v-model:filter="store.statusFilter"
          v-model:sort="store.sortOrder"
          :demo-mode="store.demoMode"
          :counts="store.counts"
          @update:demo-mode="store.setDemoMode"
          @export="exportAs"
        />

        <p v-if="shown.length === 0" class="rounded-md border border-dashed border-line p-8 text-center text-sm text-ink-soft">
          No packets match this filter.
        </p>
        <PacketTable v-else :records="shown" :selected-id="store.selectedRecord?.id" @select="select" />

        <button
          v-if="store.visibleRecords.length > visibleCount"
          class="w-full rounded-md border border-line bg-surface py-2.5 text-sm font-medium hover:border-glacier"
          @click="visibleCount += PAGE_SIZE"
        >
          Show {{ Math.min(PAGE_SIZE, store.visibleRecords.length - visibleCount) }} more
          ({{ store.visibleRecords.length - visibleCount }} remaining)
        </button>
      </section>
    </template>
  </div>
</template>
