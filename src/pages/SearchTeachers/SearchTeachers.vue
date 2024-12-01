<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import Header from "../../components/Header.vue";
import {tagService, type TeacherSearchResult} from "../../services/tag.service";
import Button from "../../components/ui/Button.vue";
import BackButton from "../../components/ui/BackButton.vue";

const route = useRoute();
const initialSkill = route.query.skill as string;

const loading = ref(false);
const error = ref("");
const availableTags = ref<string[]>([]);
const selectedTags = ref<string[]>(initialSkill ? [initialSkill] : []);
const searchResults = ref<TeacherSearchResult[]>([]);

const loadTags = async () => {
  try {
    loading.value = true;
    const tags = await tagService.getAllTags();
    availableTags.value = tags;
    console.log("Available tags:", tags);
  } catch (err) {
    console.error("Failed to load tags:", err);
    error.value = err instanceof Error ? err.message : "Failed to load tags";
  } finally {
    loading.value = false;
  }
};

const handleTagToggle = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
  searchTeachers();
};

const searchTeachers = async () => {
  if (selectedTags.value.length === 0) {
    searchResults.value = [];
    return;
  }

  try {
    loading.value = true;
    error.value = "";
    const results = await tagService.searchTeachersByTags(selectedTags.value);
    searchResults.value = results;
    console.log("Search results:", results);
  } catch (err) {
    console.error("Search failed:", err);
    error.value = err instanceof Error ? err.message : "Search failed";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadTags();
  if (initialSkill) {
    await searchTeachers();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <BackButton />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p>Loading...</p>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="text-center py-8 text-red-600">
        {{ error }}
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Search Section -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">
            Поиск преподавателей
          </h1>

          <!-- Tags Selection -->
          <div class="space-y-4">
            <label class="block text-sm font-medium text-gray-700">
              Выберите интересующие навыки
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in availableTags"
                :key="tag"
                @click="handleTagToggle(tag)"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  selectedTags.includes(tag)
                    ? 'bg-main-green text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                ]">
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div v-if="searchResults.length > 0" class="space-y-6">
          <div
            v-for="teacher in searchResults"
            :key="teacher.teacherId"
            class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-xl font-bold text-gray-900">
                  {{ teacher.teacherName }} {{ teacher.teacherSurname }}
                </h2>
                <div class="mt-2 space-y-2">
                  <p class="text-gray-600">{{ teacher.aboutTeacher }}</p>
                  <p class="text-gray-600">
                    <span class="font-medium">Может помочь с:</span>
                    {{ teacher.canHelpWith }}
                  </p>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="tag in teacher.tagsId"
                    :key="tag"
                    class="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                    {{ tag }}
                  </span>
                </div>
              </div>
              <Button>Связаться</Button>
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div
          v-else-if="selectedTags.length > 0"
          class="text-center text-gray-500 py-8">
          Преподаватели не найдены. Попробуйте изменить критерии поиска.
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.bg-main-green {
  background-color: #4caf50;
}
</style>
