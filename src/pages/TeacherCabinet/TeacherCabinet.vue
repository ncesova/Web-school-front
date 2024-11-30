<script setup lang="ts">
import Header from "../../components/Header.vue";
import {ref, onMounted} from "vue";
import {userService} from "../../services/user.service";
import {authService} from "../../services/auth.service";
import type {User} from "../../types/user";
import Button from "../../components/ui/Button.vue";

const user = ref<User | null>(null);
const loading = ref(true);
const error = ref("");

const stats = ref({
  totalStudents: 0,
  activeClassrooms: 0,
  averageGrade: 0,
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
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">
              Добро пожаловать, {{ getDisplayName() }}!
            </h1>
            <RouterLink to="/profile/edit">
              <Button>Редактировать профиль</Button>
            </RouterLink>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">Всего учеников</h3>
              <p class="text-2xl font-bold text-main-green">
                {{ stats.totalStudents }}
              </p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">Активные классы</h3>
              <p class="text-2xl font-bold text-main-green">
                {{ stats.activeClassrooms }}
              </p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">Средняя оценка</h3>
              <p class="text-2xl font-bold text-main-green">
                {{ stats.averageGrade }}
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Быстрые действия
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RouterLink
              to="/classroom/create"
              class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 class="text-lg font-medium text-gray-900">Создать класс</h3>
              <p class="text-gray-600">Создайте новый класс для учеников</p>
            </RouterLink>

            <RouterLink
              to="/lessons/create"
              class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 class="text-lg font-medium text-gray-900">Создать урок</h3>
              <p class="text-gray-600">Добавьте новый урок для класса</p>
            </RouterLink>

            <RouterLink
              to="/grades"
              class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 class="text-lg font-medium text-gray-900">Оценки</h3>
              <p class="text-gray-600">Просмотр и управление оценками</p>
            </RouterLink>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Последняя активность
          </h2>
          <div class="space-y-4">
            <!-- Placeholder for activity items -->
            <p class="text-gray-600 text-center">Нет последней активности</p>
          </div>
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
