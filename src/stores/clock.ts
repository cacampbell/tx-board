import { defineStore } from "pinia";
import { ref } from "vue";

let clockInterval: NodeJS.Timer;

export const useClockStore = defineStore("clock", () => {
  const now = ref(Date.now());

  // when the store is reset (logout), clear the existing interval, if any
  clearInterval(clockInterval);

  // setup an interval to update our now value, every 250ms
  clockInterval = setInterval(() => {
    now.value = Date.now();
  }, 250);

  return { now };
});
