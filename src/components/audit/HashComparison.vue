<script setup>
import { computed } from 'vue'

const props = defineProps({
  computedHash: { type: String, default: '' },
  onChainHash: { type: String, default: '' },
})

/** Splits a hash into 8-character groups, flagging each character that differs from `other`. */
function groups(hash, other) {
  const chars = [...hash].map((char, i) => ({ char, diff: char !== other[i] }))
  const out = []
  for (let i = 0; i < chars.length; i += 8) out.push(chars.slice(i, i + 8))
  return out
}

const rows = computed(() => [
  { label: 'Recomputed from the IPFS payload', groups: groups(props.computedHash, props.onChainHash) },
  { label: 'Anchored on Sepolia', groups: groups(props.onChainHash, props.computedHash) },
])
const mismatches = computed(() => [...props.computedHash].filter((c, i) => c !== props.onChainHash[i]).length)
</script>

<template>
  <div class="space-y-2 rounded-md bg-frost p-3">
    <div v-for="row in rows" :key="row.label">
      <div class="text-xs text-ink-soft">{{ row.label }}</div>
      <div class="mt-0.5 flex flex-wrap gap-x-2 font-mono text-[12px] leading-5">
        <span v-for="(g, gi) in row.groups" :key="gi">
          <span v-for="(c, ci) in g" :key="ci" :class="c.diff ? 'rounded-sm bg-alert px-px font-bold text-white' : 'text-ink'">{{ c.char }}</span>
        </span>
      </div>
    </div>
    <p class="pt-1 text-xs font-medium" :class="mismatches ? 'text-alert' : 'text-safe'">
      {{ mismatches ? `${mismatches} of 64 characters differ: the stored data no longer matches what was anchored.` : 'All 64 characters match: the data is unchanged since it was anchored.' }}
    </p>
  </div>
</template>
