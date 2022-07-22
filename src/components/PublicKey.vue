<script setup lang="ts">
import { ref, watch } from "vue";
import { useWalletStore } from "../stores/wallet";

const publicKey = ref("");
const walletStore = useWalletStore();
watch(
  () => walletStore.wallet,
  async (newWallet) => {
    if (newWallet != null) {
      const key = await newWallet.getPublicKey(0);
      publicKey.value = key?.toStringRaw() ?? "";
    }
  }
);
</script>

<template>
  <div class="text-lg">{{ publicKey }}</div>
</template>
