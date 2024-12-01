<script setup lang="ts">
import Header from "../../components/Header.vue";
import {ref, onMounted} from "vue";
import {userService} from "../../services/user.service";
import {authService} from "../../services/auth.service";
import {classroomService} from "../../services/classroom.service";
import {gradeService} from "../../services/grade.service";
import type {User} from "../../types/user";
import Button from "../../components/ui/Button.vue";

interface ChildStats {
  totalLessons: number;
  completedLessons: number;
  averageGrade: number;
}

interface ChildWithStats extends User {
  classrooms?: {
    id: string;
    name: string;
    lessons: {
      id: string;
      name: string;
      description?: string;
    }[];
  }[];
  stats?: ChildStats;
}

const user = ref<User | null>(null);
const children = ref<ChildWithStats[]>([]);
const loading = ref(true);
const error = ref("");

// Modal states
const showAddChildModal = ref(false);
const newChildData = ref({
  username: "",
  password: "",
  name: "",
  surname: "",
});
const successMessage = ref("");

const loadData = async () => {
  console.log("Starting to load parent cabinet data");
  try {
    const userId = authService.getUserId();
    console.log("Parent ID:", userId);

    if (!userId) {
      console.error("No userId found in storage");
      throw new Error("User ID not found");
    }

    // Load parent data
    console.log("Fetching parent data...");
    const userData = await userService.getUserById(userId);
    console.log("Parent data:", userData);
    user.value = userData;

    // Load children data with their classrooms and stats
    console.log("Fetching children data...");
    const childrenData = await userService.getParentChildren();
    console.log("Children data:", childrenData);

    // Load classroom data and stats for each child
    const childrenWithDetails = await Promise.all(
      childrenData.map(async (child) => {
        try {
          const [classrooms, grades] = await Promise.all([
            classroomService.getStudentClassrooms(child.id),
            gradeService.getStudentGrades(child.id),
          ]);

          const totalLessons = classrooms.reduce(
            (total, c) => total + c.lessons.length,
            0
          );
          const completedLessons = grades.length;
          const averageGrade = grades.length
            ? grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
            : 0;

          return {
            ...child,
            classrooms,
            stats: {
              totalLessons,
              completedLessons,
              averageGrade: Number(averageGrade.toFixed(1)),
            },
          };
        } catch (err) {
          console.error(`Failed to load details for child ${child.id}:`, err);
          return {
            ...child,
            classrooms: [],
            stats: {
              totalLessons: 0,
              completedLessons: 0,
              averageGrade: 0,
            },
          };
        }
      })
    );

    children.value = childrenWithDetails;
    console.log("Children with details:", children.value);
  } catch (err) {
    console.error("Failed to load parent cabinet data:", err);
    error.value = err instanceof Error ? err.message : "Failed to load data";
  } finally {
    loading.value = false;
  }
};

const handleAddChild = async () => {
  console.log("Starting to add new child");
  try {
    loading.value = true;
    error.value = "";

    console.log("New child data:", newChildData.value);
    await userService.registerChild(newChildData.value);

    console.log("Child registered successfully");
    successMessage.value = "Ребенок успешно добавлен";

    // Refresh children data
    await loadData();

    // Reset form and close modal
    newChildData.value = {
      username: "",
      password: "",
      name: "",
      surname: "",
    };
    showAddChildModal.value = false;

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (err) {
    console.error("Failed to add child:", err);
    error.value = err instanceof Error ? err.message : "Failed to add child";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  console.log("Parent cabinet mounted");
  loadData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p>Loading...</p>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="text-center py-8 text-red-600">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
        role="alert">
        <span class="block sm:inline">{{ successMessage }}</span>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Welcome Section -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">
              Личный кабинет родителя
            </h1>
            <Button @click="showAddChildModal = true">
              Добавить ребенка
            </Button>
          </div>
        </div>

        <!-- Children Section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Мои дети</h2>

          <div v-if="children.length === 0" class="text-center text-gray-500">
            У вас пока нет добавленных детей
          </div>

          <div v-else class="space-y-8">
            <div
              v-for="child in children"
              :key="child.id"
              class="bg-gray-50 p-6 rounded-lg">
              <div class="mb-4">
                <h3 class="text-xl font-bold text-gray-900">
                  {{ child.name }} {{ child.surname }}
                </h3>
                <p class="text-gray-600">{{ child.username }}</p>
              </div>

              <!-- Child's Stats -->
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-white p-4 rounded-lg shadow-sm">
                  <h4 class="text-sm font-medium text-gray-500">Прогресс</h4>
                  <p class="text-2xl font-bold text-main-green">
                    {{
                      Math.round(
                        ((child.stats?.completedLessons || 0) /
                          (child.stats?.totalLessons || 1)) *
                          100
                      )
                    }}%
                  </p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                  <h4 class="text-sm font-medium text-gray-500">
                    Выполнено уроков
                  </h4>
                  <p class="text-2xl font-bold text-main-green">
                    {{ child.stats?.completedLessons || 0 }}/{{
                      child.stats?.totalLessons || 0
                    }}
                  </p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                  <h4 class="text-sm font-medium text-gray-500">
                    Средняя оценка
                  </h4>
                  <p class="text-2xl font-bold text-main-green">
                    {{ child.stats?.averageGrade || 0 }}
                  </p>
                </div>
              </div>

              <!-- Child's Classrooms -->
              <div v-if="child.classrooms?.length" class="space-y-4">
                <h4 class="font-medium text-gray-900">Классы</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="classroom in child.classrooms"
                    :key="classroom.id"
                    class="bg-white p-4 rounded-lg shadow-sm">
                    <h5 class="font-medium text-gray-900 mb-2">
                      {{ classroom.name }}
                    </h5>
                    <p class="text-sm text-gray-600">
                      Уроков: {{ classroom.lessons.length }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-500 italic">
                Не записан ни в один класс
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Add Child Modal -->
      <div
        v-if="showAddChildModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 class="text-xl font-bold mb-4">Добавить ребенка</h2>

          <form @submit.prevent="handleAddChild" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Имя пользователя
              </label>
              <input
                v-model="newChildData.username"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-main-green focus:ring-main-green" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <input
                v-model="newChildData.password"
                type="password"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-main-green focus:ring-main-green" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Имя
              </label>
              <input
                v-model="newChildData.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-main-green focus:ring-main-green" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Фамилия
              </label>
              <input
                v-model="newChildData.surname"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-main-green focus:ring-main-green" />
            </div>

            <div class="flex justify-end space-x-4">
              <Button
                type="button"
                @click="showAddChildModal = false"
                class="bg-gray-500">
                Отмена
              </Button>
              <Button type="submit" :disabled="loading">
                {{ loading ? "Добавление..." : "Добавить" }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-main-green {
  background-color: #4caf50;
}
</style>
