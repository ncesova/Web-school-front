<script setup lang="ts">
import {ref, onMounted} from "vue";
import {
  leaderboardService,
  type LeaderboardEntry,
} from "../services/leaderboard.service";

const props = defineProps<{
  gameId: string;
  classroomId?: string;
}>();

const entries = ref<LeaderboardEntry[]>([]);
const loading = ref(true);
const error = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);

const loadLeaderboard = async () => {
  try {
    loading.value = true;
    error.value = "";

    const response = props.classroomId
      ? await leaderboardService.getClassroomLeaderboard(
          props.classroomId,
          currentPage.value,
          pageSize.value
        )
      : await leaderboardService.getGameLeaderboard(
          props.gameId,
          currentPage.value,
          pageSize.value
        );

    entries.value = response.data;
    totalPages.value = Math.ceil(response.pagination.total / pageSize.value);
  } catch (err) {
    console.error("Failed to load leaderboard:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to load leaderboard";
  } finally {
    loading.value = false;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadLeaderboard();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadLeaderboard();
  }
};

onMounted(() => {
  loadLeaderboard();
});
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h2 class="text-xl font-bold mb-4">Таблица лидеров</h2>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <p>Загрузка...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-600 py-4">
      {{ error }}
    </div>

    <!-- Leaderboard Table -->
    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Место
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Игрок
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Очки
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(entry, index) in entries" :key="entry.userId">
              <td class="px-6 py-4 whitespace-nowrap">
                {{ (currentPage - 1) * pageSize + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ entry.name }} {{ entry.surname }}
                <span class="text-gray-500">({{ entry.username }})</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ entry.value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 border rounded-md disabled:opacity-50">
          Назад
        </button>
        <span>Страница {{ currentPage }} из {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border rounded-md disabled:opacity-50">
          Вперед
        </button>
      </div>
    </div>
  </div>
</template>
