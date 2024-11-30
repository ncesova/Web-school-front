<script setup lang="ts">
import Header from "../../components/Header.vue";
import {ref, onMounted} from "vue";
import {userService} from "../../services/user.service";
import {authService} from "../../services/auth.service";
import type {User} from "../../types/user";

interface Game {
  id: number;
  title: string;
  description: string;
  route: string;
  image?: string;
}

const user = ref<User | null>(null);
const loading = ref(true);
const error = ref("");

const games = ref<Game[]>([
  {
    id: 1,
    title: "Агент-Кодер",
    description: "Решайте задачи и помогите агенту выполнить миссию",
    route: "/games/agent",
  },
  {
    id: 2,
    title: "Питомец-Программист",
    description: "Управляйте питомцем с помощью кода",
    route: "/games/pet",
  },
  {
    id: 3,
    title: "Тестировщик",
    description: "Найдите и исправьте ошибки в коде",
    route: "/games/testing",
  },
]);

const progress = ref({
  completedLessons: 5,
  totalLessons: 15,
  currentStreak: 3,
});

const loadUserData = async () => {
  try {
    const userId = authService.getUserId();
    if (!userId) {
      throw new Error("User ID not found");
    }

    user.value = await userService.getUserById(userId);
  } catch (err) {
    console.error("Failed to load user data:", err);
    error.value = "Failed to load user data";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUserData();
});

const getDisplayName = () => {
  if (!user.value) return "";
  return user.value.name && user.value.surname
    ? `${user.value.name} ${user.value.surname}`
    : user.value.username;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p>Loading...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8 text-red-600">
        {{ error }}
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Welcome Section -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            Добро пожаловать, {{ getDisplayName() }}!
          </h1>

          <!-- Progress Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">Пройдено уроков</h3>
              <p class="text-2xl font-bold text-main-green">
                {{ progress.completedLessons }}/{{ progress.totalLessons }}
              </p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">Текущая серия</h3>
              <p class="text-2xl font-bold text-main-green">
                {{ progress.currentStreak }} дней
              </p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">Прогресс</h3>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  class="bg-main-green h-2.5 rounded-full"
                  :style="`width: ${
                    (progress.completedLessons / progress.totalLessons) * 100
                  }%`"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Games Section -->
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Доступные игры</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="game in games"
            :key="game.id"
            :to="game.route"
            class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ game.title }}
              </h3>
              <p class="text-gray-600">{{ game.description }}</p>
            </div>
          </RouterLink>
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
