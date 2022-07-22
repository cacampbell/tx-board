<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <button
    type="button"
    class="mx-2 my-2 w-72 rounded border bg-transparent px-4 py-4 text-lg hover:border-transparent hover:text-white"
  >
    {{ label }}
  </button>
</template>
