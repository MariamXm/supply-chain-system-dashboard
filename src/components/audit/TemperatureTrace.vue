<script setup>
import { computed } from 'vue'
import { SAFE_MAX_TEMP_C } from '@/config/env'
import { formatTemp, formatTimestamp } from '@/utils/format'

const props = defineProps({
  records: { type: Array, required: true },
  selectedId: { type: String, default: null },
})
const emit = defineEmits(['select'])

const W = 800
const H = 220
const PAD = { l: 48, r: 16, t: 14, b: 30 }

const chart = computed(() => {
  const recs = props.records.filter((r) => Number.isFinite(r.telemetry.temperature))
  if (!recs.length) return null

  const temps = recs.map((r) => r.telemetry.temperature)
  const lo = Math.min(...temps, SAFE_MAX_TEMP_C) - 3
  const hi = Math.max(...temps, SAFE_MAX_TEMP_C) + 3
  const t0 = recs[0].timestamp
  const span = recs.at(-1).timestamp - t0 || 1
  const innerW = W - PAD.l - PAD.r
  const y = (v) => PAD.t + ((hi - v) / (hi - lo)) * (H - PAD.t - PAD.b)
  const x = (ts) => (recs.length === 1 ? PAD.l + innerW / 2 : PAD.l + ((ts - t0) / span) * innerW)

  const points = recs.map((r) => ({
    id: r.id,
    x: x(r.timestamp),
    y: y(r.telemetry.temperature),
    ok: r.isCompliant,
    label: `Packet ${r.sequence}: ${formatTemp(r.telemetry.temperature)} at ${formatTimestamp(r.timestamp)}`,
  }))

  const ticks = Array.from({ length: 4 }, (_, i) => {
    const v = Math.round(lo + ((hi - lo) * i) / 3)
    return { v, y: y(v) }
  })

  return {
    points,
    line: points.map((p) => `${p.x},${p.y}`).join(' '),
    thresholdY: y(SAFE_MAX_TEMP_C),
    ticks,
    from: formatTimestamp(recs[0].timestamp, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    to: formatTimestamp(recs.at(-1).timestamp, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  }
})
</script>

<template>
  <section v-if="chart" class="rounded-lg border border-line bg-surface p-4 md:p-5">
    <div class="mb-2 flex flex-wrap items-baseline justify-between gap-2">
      <h2 class="font-semibold">Temperature over time</h2>
      <p class="text-sm text-ink-soft">Readings above the dashed line (−18 °C) breach the cold-chain limit. Select a point to trace that packet.</p>
    </div>

    <svg :viewBox="`0 0 ${W} ${H}`" class="h-auto w-full" role="img" aria-label="Line chart of container temperature per packet">
      <!-- breach zone -->
      <rect :x="PAD.l" :y="PAD.t" :width="W - PAD.l - PAD.r" :height="Math.max(chart.thresholdY - PAD.t, 0)" class="fill-alert-soft" />
      <g v-for="t in chart.ticks" :key="t.v">
        <line :x1="PAD.l" :x2="W - PAD.r" :y1="t.y" :y2="t.y" class="stroke-line" stroke-width="1" />
        <text :x="PAD.l - 8" :y="t.y + 4" text-anchor="end" class="fill-ink-soft text-[11px]">{{ t.v }}°</text>
      </g>
      <line :x1="PAD.l" :x2="W - PAD.r" :y1="chart.thresholdY" :y2="chart.thresholdY" class="stroke-alert" stroke-width="1.5" stroke-dasharray="5 4" />
      <polyline :points="chart.line" fill="none" class="stroke-glacier" stroke-width="2" stroke-linejoin="round" />
      <circle
        v-for="p in chart.points"
        :key="p.id"
        :cx="p.x"
        :cy="p.y"
        :r="p.id === selectedId ? 7 : 4.5"
        stroke-width="2"
        tabindex="0"
        role="button"
        :aria-label="p.label"
        class="cursor-pointer stroke-surface"
        :class="[p.ok ? 'fill-safe' : 'fill-alert', p.id === selectedId ? 'stroke-ink' : '']"
        @click="emit('select', p.id)"
        @keydown.enter="emit('select', p.id)"
      >
        <title>{{ p.label }}</title>
      </circle>
      <text :x="PAD.l" :y="H - 8" class="fill-ink-soft text-[11px]">{{ chart.from }}</text>
      <text :x="W - PAD.r" :y="H - 8" text-anchor="end" class="fill-ink-soft text-[11px]">{{ chart.to }}</text>
    </svg>
  </section>
</template>
