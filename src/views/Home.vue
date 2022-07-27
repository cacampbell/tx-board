<script setup lang="ts">
import { useClockStore } from "../stores/clock";

const clockStore = useClockStore();
</script>

<template>
  <div
    class="flex flex-1 flex-col items-center justify-center gap-x-5 bg-grisaille font-semibold text-center-stage"
  >
    <h3 class="pt-10 text-5xl">Transaction Board</h3>

    <div>Public Key</div>
    <PublicKey class="rounded border p-2" />

    <div>Account ID</div>
    <div class="rounded border p-2">0.0.47729388</div>

    <div>Network</div>
    <div class="rounded border p-2">Testnet</div>

    <Transactions class="pt-5" />

    <div class="absolute left-0 right-0 top-2 text-center text-base opacity-70">
      {{ $d(clockStore.now, "datetime") }}
    </div>
  </div>
</template>
