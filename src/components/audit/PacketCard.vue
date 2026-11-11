<script setup>
import { computed } from 'vue'
import { SAFE_MAX_TEMP_C, ipfsUrl } from '@/config/env'
import { formatHumidity, formatTemp, formatTimestamp, shortHash } from '@/utils/format'
import { osmUrl, parseGps } from '@/utils/geo'
import PacketStage from './PacketStage.vue'
import HashComparison from './HashComparison.vue'
import StatusPill from '@/components/ui/StatusPill.vue'

const props = defineProps({
  record: { type: Object, required: true },
  demoMode: Boolean,
})
defineEmits(['toggle-tamper'])

const gps = computed(() => parseGps(props.record.telemetry.gpsLocation))
const overLimit = computed(() => props.record.telemetry.temperature > SAFE_MAX_TEMP_C)
</script>

<template>
  <article
    class="space-y-4 rounded-lg border border-line border-l-4 bg-surface p-4 md:p-5"
    :class="record.isVerified ? 'border-l-safe' : 'border-l-alert'"
  >
    <header class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-baseline gap-3">
        <h3 class="font-semibold">Packet {{ record.sequence }}</h3>
        <time class="text-sm text-ink-soft">{{ formatTimestamp(record.timestamp) }}</time>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-if="demoMode"
          class="rounded-md border border-line px-2.5 py-1 text-xs font-medium hover:border-alert hover:text-alert"
          @click="$emit('toggle-tamper')"
        >
          {{ record.isTampered ? 'Restore data' : 'Tamper with this packet' }}
        </button>
        <StatusPill :tone="record.isCompliant ? 'safe' : 'alert'" :label="record.isCompliant ? 'Temperature safe' : 'Temperature warning'" />
        <StatusPill :tone="record.isVerified ? 'safe' : 'alert'" :label="record.isVerified ? 'Verified on-chain' : 'Hash mismatch'" />
      </div>
    </header>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-4">
      <PacketStage :index="1" title="Sensor reading">
        <dl class="space-y-1">
          <div class="flex justify-between gap-2">
            <dt class="text-ink-soft">Temperature</dt>
            <dd class="font-mono font-semibold" :class="overLimit ? 'text-alert' : 'text-safe'">{{ formatTemp(record.telemetry.temperature) }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-ink-soft">Humidity</dt>
            <dd class="font-mono">{{ formatHumidity(record.telemetry.humidity) }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-ink-soft">Location</dt>
            <dd class="truncate font-mono">
              <a v-if="gps" :href="osmUrl(gps)" target="_blank" rel="noopener" class="text-glacier underline-offset-2 hover:underline">{{ record.telemetry.gpsLocation }}</a>
              <span v-else>{{ record.telemetry.gpsLocation || 'N/A' }}</span>
            </dd>
          </div>
        </dl>
      </PacketStage>

      <PacketStage :index="2" title="Cloud validation" :state="record.isCompliant ? 'ok' : 'fail'">
        <p class="text-ink-soft">Rule: temperature at or below −18 °C</p>
        <p class="font-semibold" :class="record.isCompliant ? 'text-safe' : 'text-alert'">
          {{ record.isCompliant ? 'Passed' : 'Failed' }}
        </p>
      </PacketStage>

      <PacketStage :index="3" title="IPFS storage">
        <p class="text-ink-soft">Content ID</p>
        <a :href="ipfsUrl(record.cid)" target="_blank" rel="noopener" :title="record.cid" class="block break-all font-mono text-xs text-glacier underline-offset-2 hover:underline">
          {{ shortHash(record.cid, 10, 8) }}
        </a>
        <p class="text-xs text-ink-soft">Opens the raw payload</p>
      </PacketStage>

      <PacketStage :index="4" title="Sepolia record" :state="record.isVerified ? 'ok' : 'fail'" last>
        <p class="text-ink-soft">Anchored hash</p>
        <p class="font-mono text-xs" :title="record.blockchainHash">{{ shortHash(record.blockchainHash, 10, 8) }}</p>
        <p class="font-semibold" :class="record.isVerified ? 'text-safe' : 'text-alert'">
          {{ record.isVerified ? 'Matches the stored data' : 'Does not match' }}
        </p>
      </PacketStage>
    </div>

    <!-- <HashComparison :computed-hash="record.computedHash" :on-chain-hash="record.blockchainHash" /> -->
    <details :open="!record.isVerified">
      <summary class="w-fit cursor-pointer text-sm font-medium text-glacier hover:underline">
        {{ record.isVerified ? 'Compare hashes' : 'Compare hashes (mismatch found)' }}
      </summary>
      <div class="mt-2">
        <HashComparison :computed-hash="record.computedHash" :on-chain-hash="record.blockchainHash" />
      </div>
    </details>
  </article>
</template>
