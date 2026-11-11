<script setup>
import { formatHumidity, formatTemp, formatTimestamp, shortHash } from '@/utils/format'
import StatusPill from '@/components/ui/StatusPill.vue'

defineProps({
  records: { type: Array, required: true },
  selectedId: { type: String, default: null },
})
defineEmits(['select'])
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-line bg-surface">
    <table class="w-full min-w-[720px] text-left text-sm">
      <caption class="sr-only">Packets recorded for this container. Select one to trace it through the pipeline.</caption>
      <thead class="border-b border-line bg-frost text-ink-soft">
        <tr>
          <th scope="col" class="px-4 py-2.5 font-medium">Packet</th>
          <th scope="col" class="px-4 py-2.5 font-medium">Time</th>
          <th scope="col" class="px-4 py-2.5 font-medium">Temperature</th>
          <th scope="col" class="px-4 py-2.5 font-medium">Humidity</th>
          <th scope="col" class="px-4 py-2.5 font-medium">Rule check</th>
          <th scope="col" class="px-4 py-2.5 font-medium">IPFS content ID</th>
          <th scope="col" class="px-4 py-2.5 font-medium">On-chain hash</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line">
        <tr
          v-for="r in records"
          :key="r.id"
          class="cursor-pointer hover:bg-frost"
          :class="r.id === selectedId ? 'bg-frost' : ''"
          :aria-current="r.id === selectedId ? 'true' : undefined"
          @click="$emit('select', r.id)"
        >
          <td class="border-l-4 px-4 py-2.5" :class="r.id === selectedId ? 'border-glacier' : 'border-transparent'">
            <button class="font-semibold text-glacier hover:underline" @click.stop="$emit('select', r.id)">#{{ r.sequence }}</button>
          </td>
          <td class="whitespace-nowrap px-4 py-2.5">{{ formatTimestamp(r.timestamp) }}</td>
          <td class="px-4 py-2.5 font-mono font-semibold" :class="r.isCompliant ? 'text-safe' : 'text-alert'">{{ formatTemp(r.telemetry.temperature) }}</td>
          <td class="px-4 py-2.5 font-mono">{{ formatHumidity(r.telemetry.humidity) }}</td>
          <td class="px-4 py-2.5"><StatusPill :tone="r.isCompliant ? 'safe' : 'alert'" :label="r.isCompliant ? 'Safe' : 'Warning'" /></td>
          <td class="px-4 py-2.5 font-mono text-xs" :title="r.cid">{{ shortHash(r.cid, 8, 6) }}</td>
          <td class="px-4 py-2.5"><StatusPill :tone="r.isVerified ? 'safe' : 'alert'" :label="r.isVerified ? 'Verified' : 'Mismatch'" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
