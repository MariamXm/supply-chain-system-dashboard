<script setup>
import { computed } from 'vue'
import { ipfsUrl } from '@/config/env'
import { CONTRACT_ADDRESS, LINKS, etherscanAddressUrl, etherscanEventsUrl } from '@/config/links'
import { formatTemp, formatTimestamp, shortHash } from '@/utils/format'
import PacketStage from './PacketStage.vue'
import HashComparison from './HashComparison.vue'
import ExternalLink from '@/components/ui/ExternalLink.vue'

const props = defineProps({
  record: { type: Object, required: true },
  following: Boolean,
  demoMode: Boolean,
})
defineEmits(['toggle-tamper', 'follow-latest'])

const payloadJson = computed(() => JSON.stringify(props.record.payload ?? {}, null, 2))
</script>

<template>
  <section id="pipeline-trace" class="scroll-mt-4 rounded-lg border border-line bg-surface p-5 md:p-6" aria-label="Pipeline trace">
    <header class="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold">Packet {{ record.sequence }} through the pipeline</h2>
        <p class="text-sm text-ink-soft">
          Recorded {{ formatTimestamp(record.timestamp) }}{{ following ? ', the latest packet' : '' }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-if="!following"
          class="rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:border-glacier"
          @click="$emit('follow-latest')"
        >
          Follow latest packet
        </button>
        <button
          v-if="demoMode"
          class="rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:border-alert hover:text-alert"
          @click="$emit('toggle-tamper')"
        >
          {{ record.isTampered ? 'Restore data' : 'Tamper with this packet' }}
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-5">
      <PacketStage :index="1" title="AWS IoT Core">
        <p class="text-ink-soft">The ESP32 publishes this reading</p>
        <pre class="overflow-x-auto rounded bg-frost p-2 font-mono text-[11px] leading-4">{{ payloadJson }}</pre>
        <ExternalLink :href="LINKS.iotCore" label="Open IoT Core" env-var="VITE_IOT_CORE_URL" />
      </PacketStage>

      <PacketStage :index="2" title="AWS Lambda" :state="record.isCompliant ? 'ok' : 'fail'">
        <p class="text-ink-soft">Checks the −18 °C rule, then hashes the payload</p>
        <p>
          {{ formatTemp(record.telemetry.temperature) }}:
          <strong :class="record.isCompliant ? 'text-safe' : 'text-alert'">{{ record.isCompliant ? 'rule passed' : 'rule failed' }}</strong>
        </p>
        <p class="text-ink-soft">SHA-256 of the payload</p>
        <p class="break-all font-mono text-xs" :title="record.computedHash">{{ shortHash(record.computedHash, 12, 8) }}</p>
        <ExternalLink :href="LINKS.lambda" label="Open Lambda function" env-var="VITE_LAMBDA_URL" />
        <ExternalLink :href="LINKS.lambdaLogs" label="Open execution logs" env-var="VITE_LAMBDA_LOGS_URL" />
      </PacketStage>

      <PacketStage :index="3" title="Pinata IPFS">
        <p class="text-ink-soft">The raw payload is pinned. Its content ID is its address</p>
        <p class="break-all font-mono text-xs" :title="record.cid">{{ shortHash(record.cid, 12, 8) }}</p>
        <ExternalLink :href="ipfsUrl(record.cid)" label="Open this record on IPFS" />
        <ExternalLink :href="LINKS.pinata" label="Open Pinata files" env-var="VITE_PINATA_URL" />
      </PacketStage>

      <PacketStage :index="4" title="Sepolia contract" :state="record.isVerified ? 'ok' : 'fail'" last>
        <p class="text-ink-soft">Stores the content ID and hash permanently</p>
        <p v-if="CONTRACT_ADDRESS" class="font-mono text-xs" :title="CONTRACT_ADDRESS">{{ shortHash(CONTRACT_ADDRESS, 8, 6) }}</p>
        <p class="text-ink-soft">Anchored hash</p>
        <p class="break-all font-mono text-xs" :title="record.blockchainHash">{{ shortHash(record.blockchainHash, 12, 8) }}</p>
        <p class="font-semibold" :class="record.isVerified ? 'text-safe' : 'text-alert'">
          {{ record.isVerified ? 'Matches the recomputed hash' : 'Does not match' }}
        </p>
        <ExternalLink :href="etherscanAddressUrl()" label="View contract on Etherscan" env-var="VITE_CONTRACT_ADDRESS" />
        <ExternalLink :href="etherscanEventsUrl()" label="View contract events" />
      </PacketStage>
    </div>

    <details class="mt-6" :open="!record.isVerified">
      <summary class="w-fit cursor-pointer text-sm font-medium text-glacier hover:underline">
        {{ record.isVerified ? 'Compare the two hashes' : 'Compare the two hashes (mismatch found)' }}
      </summary>
      <div class="mt-2">
        <HashComparison :computed-hash="record.computedHash" :on-chain-hash="record.blockchainHash" />
      </div>
    </details>
  </section>
</template>
