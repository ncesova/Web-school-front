<script setup lang="ts">
interface Props {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

defineProps<Props>();
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    class="p-2 rounded-lg bg-main-green text-white cursor-pointer hover:bg-main-green/90 duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-fit">
    <slot></slot>
  </button>
</template>
<style lang="scss"></style>
