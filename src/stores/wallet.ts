import { defineStore } from "pinia";
import { ref } from "vue";
import { Wallet } from "../ledger/wallet";

export const useWalletStore = defineStore("wallet", () => {
  const wallet = ref<Wallet | null>(null);

  return { wallet };
});
