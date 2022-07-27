import { TokenId } from "@hashgraph/sdk";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTokenStore = defineStore("wallet", () => {
  const token = ref<TokenId | null>(null);

  return { token };
});
