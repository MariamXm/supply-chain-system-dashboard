<script setup>
import { computed } from 'vue'
import { GOOGLE_MAPS_KEY } from '@/config/links'
import { googleMapsEmbedUrl, googleMapsUrl, parseGps } from '@/utils/geo'
import ExternalLink from '@/components/ui/ExternalLink.vue'

const props = defineProps({ record: { type: Object, required: true } })

const gps = computed(() => parseGps(props.record.telemetry.gpsLocation))
const src = computed(() => (gps.value ? googleMapsEmbedUrl(gps.value, GOOGLE_MAPS_KEY) : ''))
</script>

<template>
  <section class="flex min-h-72 flex-col rounded-lg border border-line bg-surface p-4 md:p-5">
    <div class="mb-3 flex items-baseline justify-between gap-2">
      <h2 class="font-semibold">Where it was recorded</h2>
      <span class="text-sm text-ink-soft">Packet {{ record.sequence }}</span>
    </div>

    <template v-if="gps">
      <iframe
        :key="src"
        :src="src"
        title="Google Map showing where the selected packet was recorded"
        class="min-h-48 w-full flex-1 rounded-md border border-line"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      ></iframe>
      <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span class="font-mono text-sm">{{ record.telemetry.gpsLocation }}</span>
        <ExternalLink :href="googleMapsUrl(gps)" label="Open in Google Maps" />
      </div>
    </template>
    <p v-else class="grid flex-1 place-items-center rounded-md border border-dashed border-line p-6 text-center text-sm text-ink-soft">
      This packet has no GPS coordinates.
    </p>
  </section>
</template>
