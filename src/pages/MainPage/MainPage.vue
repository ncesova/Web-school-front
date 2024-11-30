<script setup lang="ts">
import Header from "../../components/Header.vue";
import Search from "../../components/Search.vue";
import {ref, onMounted} from "vue";

const texts = ref<string[]>(["Frontend", "Backend", "Тестирование", "GameDev"]);
const displayedText = ref("");
const cursorVisible = ref(true);
const index = ref(0);
const textIndex = ref(0);
const deleting = ref(false);

const typingSpeed = 150;
const deletingSpeed = 50;

const toggleCursor = () => {
  setInterval(() => {
    cursorVisible.value = !cursorVisible.value;
  }, 500);
};

const typeText = () => {
  setInterval(
    () => {
      const currentText = texts.value[textIndex.value];

      if (!deleting.value && index.value < currentText.length) {
        displayedText.value += currentText[index.value];
        index.value++;
      } else if (deleting.value && index.value > 0) {
        displayedText.value = displayedText.value.slice(0, -1);
        index.value--;
      } else if (index.value === 0) {
        deleting.value = false;
        textIndex.value = (textIndex.value + 1) % texts.value.length;
      } else if (index.value === currentText.length) {
        deleting.value = true;
      }
    },
    deleting.value ? deletingSpeed : typingSpeed
  );
};

onMounted(() => {
  toggleCursor();
  typeText();
});
</script>

<template>
  <div>
    <Header />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div class="mb-4">
          <span class="text-[58px] font-semibold">{{ displayedText }}</span>
          <span
            class="cursor text-[58px] font-semibold text-main-green"
            :class="{blink: cursorVisible}"
            >|</span
          >
        </div>
        <h1 class="text-[58px] font-semibold">
          с наставником в формате 1 на 1
        </h1>
      </div>

      <!-- Search Component -->
      <Search />

      <!-- Popular Tags -->
      <div class="mt-8 flex flex-wrap justify-center gap-2">
        <button
          v-for="tag in [
            'Python',
            'Java',
            'JavaScript',
            'C#',
            'C++',
            'React',
            'Mobile',
            'UX/UI',
            'Data Science',
            'Team Lead',
            'Product Management',
            '1C',
          ]"
          :key="tag"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors">
          {{ tag }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-main-green {
  background-color: #4caf50;
}

.cursor.blink {
  opacity: 0;
}
</style>
