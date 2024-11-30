<script setup lang="ts">
import { Routing } from "./pages/index.ts";
</script>

<template>
  <Routing />
</template>

<style>
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

html {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

.ant-btn-primary {
  background: #1677ff !important;
}

.ant-btn-background-ghost {
  background: transparent !important;
}
</style>
