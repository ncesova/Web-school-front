<script setup lang="ts">
import {useRouter, useRoute} from "vue-router";

const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.go(-1);
};

// Add computed property to check if button should be hidden
const shouldShowButton = () => {
  return route.path !== "/teacher-cabinet";
};
</script>

<template>
  <button
    v-if="shouldShowButton()"
    @click="goBack"
    class="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-900">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span class="ml-2">Назад</span>
  </button>
</template>
