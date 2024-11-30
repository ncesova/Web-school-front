<script setup lang="ts">
import {ref, onMounted} from "vue";
import {tagService, type TeacherSearchResult} from "../services/tag.service";
import Button from "./ui/Button.vue";

const searchTags = ref<string[]>([]);
const availableTags = ref<{id: string; name: string}[]>([]);
const searchResults = ref<TeacherSearchResult[]>([]);
const loading = ref(false);
const error = ref("");

const loadTags = async () => {
  try {
    availableTags.value = await tagService.getAllTags();
  } catch (err) {
    console.error("Failed to load tags:", err);
    error.value = "Failed to load available tags";
  }
};

const handleSearch = async () => {
  if (searchTags.value.length === 0) return;

  loading.value = true;
  error.value = "";

  try {
    searchResults.value = await tagService.searchTeachersByTags(
      searchTags.value
    );
  } catch (err) {
    console.error("Search failed:", err);
    error.value = err instanceof Error ? err.message : "Search failed";
  } finally {
    loading.value = false;
  }
};

const toggleTag = (tag: string) => {
  const index = searchTags.value.indexOf(tag);
  if (index === -1) {
    searchTags.value.push(tag);
  } else {
    searchTags.value.splice(index, 1);
  }
};

onMounted(() => {
  loadTags();
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <p class="text-2xl text-center mb-8">
      Улучшайте свои навыки через персональные занятия с опытными наставниками
    </p>

    <!-- Tags Selection -->
    <div class="mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-3">Выберите навыки:</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in availableTags"
          :key="tag.id"
          @click="toggleTag(tag.name)"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            searchTags.includes(tag.name)
              ? 'bg-main-green text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]">
          {{ tag.name }}
        </button>
      </div>
    </div>

    <!-- Search Button -->
    <div class="text-center mb-8">
      <Button
        @click="handleSearch"
        :disabled="loading || searchTags.length === 0">
        {{ loading ? "Поиск..." : "Найти наставника" }}
      </Button>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      {{ error }}
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="space-y-6">
      <div
        v-for="teacher in searchResults"
        :key="teacher.teacherId"
        class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              {{ teacher.teacherName }} {{ teacher.teacherSurname }}
            </h3>
            <div class="mt-2 space-y-2">
              <p class="text-gray-600">
                <span class="font-medium">О преподавателе:</span>
                {{ teacher.aboutTeacher }}
              </p>
              <p class="text-gray-600">
                <span class="font-medium">Может помочь с:</span>
                {{ teacher.canHelpWith }}
              </p>
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="tag in teacher.tagsId"
                :key="tag"
                class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                {{ tag }}
              </span>
            </div>
          </div>
          <RouterLink :to="`/teacher/${teacher.teacherId}`">
            <Button>Подробнее</Button>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div
      v-else-if="searchResults.length === 0 && !loading && !error"
      class="text-center text-gray-500 mt-8">
      {{
        searchTags.length > 0
          ? "Наставники не найдены"
          : "Выберите навыки для поиска"
      }}
    </div>
  </div>
</template>

<style scoped>
.bg-main-green {
  background-color: #4caf50;
}
</style>
