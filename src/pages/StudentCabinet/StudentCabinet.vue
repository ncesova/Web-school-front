<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import Header from "../../components/Header.vue";
import {authService} from "../../services/auth.service";
import {userService} from "../../services/user.service";
import {classroomService} from "../../services/classroom.service";
import {gradeService} from "../../services/grade.service";
import type {User} from "../../types/user";

interface StudentClassroom {
  id: string;
  name: string;
  lessons: {
    id: string;
    name: string;
    description?: string;
  }[];
}

interface Grade {
  lessonId: string;
  grade: number;
  comment?: string;
}

const user = ref<User | null>(null);
const classrooms = ref<StudentClassroom[]>([]);
const grades = ref<Grade[]>([]);
const loading = ref(true);
const error = ref("");

// Add computed properties for stats
const totalLessons = computed(() => {
  if (!classrooms.value) return 0;
  return classrooms.value.reduce(
    (total, c) => total + (c.lessons?.length || 0),
    0
  );
});

const averageGrade = computed(() => {
  if (!grades.value || grades.value.length === 0) return 0;
  const sum = grades.value.reduce((total, g) => total + g.grade, 0);
  return Number((sum / grades.value.length).toFixed(1));
});

const completedLessons = computed(() => {
  return grades.value.length;
});

const progressPercentage = computed(() => {
  if (totalLessons.value === 0) return 0;
  return Math.round((completedLessons.value / totalLessons.value) * 100);
});

const loadStudentData = async () => {
  try {
    const userId = authService.getUserId();
    if (!userId) throw new Error("User ID not found");

    // Load user data
    const userData = await userService.getUserById(userId);
    user.value = userData;
    console.log("User data:", userData);

    // Load classrooms using classroom service
    console.log("Fetching student classrooms...");
    const classroomsData = await classroomService.getStudentClassrooms(userId);
    console.log("Received classrooms:", classroomsData);
    classrooms.value = classroomsData || [];

    // Load grades using grade service
    console.log("Fetching student grades...");
    const gradesData = await gradeService.getStudentGrades(userId);
    console.log("Received grades:", gradesData);
    grades.value = gradesData || [];
  } catch (err) {
    console.error("Failed to load student data:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to load student data";
  } finally {
    loading.value = false;
  }
};

const getDisplayName = () => {
  if (!user.value) return "";
  return user.value.name && user.value.surname
    ? `${user.value.name} ${user.value.surname}`
    : user.value.username;
};

onMounted(() => {
  loadStudentData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
        <!-- Welcome Section with Logo -->
        <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-8">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-0">
              <RouterLink to="/" class="mb-4 sm:mb-0 sm:mr-8">
                <h1
                  class="tracking-widest text-[24px] sm:text-[30px] font-semibold">
                  CodeCouch
                </h1>
              </RouterLink>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                Добро пожаловать, {{ getDisplayName() }}!
              </h1>
            </div>
          </div>

          <!-- Student Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">Мои классы</h3>
              <p class="text-2xl font-bold text-main-green">
                {{ classrooms.length }}
              </p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">Всего уроков</h3>
              <p class="text-2xl font-bold text-main-green">
                {{ totalLessons }}
              </p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">Средняя оценка</h3>
              <p class="text-2xl font-bold text-main-green">
                {{ averageGrade }}
              </p>
            </div>
          </div>
        </div>

        <!-- Progress Section -->
        <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-8">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            Мой прогресс
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">
                Выполнено уроков
              </h3>
              <p class="text-2xl font-bold text-main-green">
                {{ completedLessons }}/{{ totalLessons }}
              </p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">Прогресс</h3>
              <p class="text-2xl font-bold text-main-green">
                {{ progressPercentage }}%
              </p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900">Средняя оценка</h3>
              <p class="text-2xl font-bold text-main-green">
                {{ averageGrade }}
              </p>
            </div>
          </div>
        </div>

        <!-- Classrooms Section -->
        <div class="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            Мои классы
          </h2>

          <div v-if="classrooms.length === 0" class="text-center text-gray-500">
            Вы пока не состоите ни в одном классе
          </div>

          <div v-else class="space-y-4 sm:space-y-8">
            <div
              v-for="classroom in classrooms"
              :key="classroom.id"
              class="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                {{ classroom.name }}
              </h3>

              <!-- Lessons and Grades -->
              <div class="overflow-x-auto -mx-4 sm:mx-0">
                <div class="inline-block min-w-full align-middle">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                      <tr>
                        <th
                          class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Урок
                        </th>
                        <th
                          class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Оценка
                        </th>
                        <th
                          class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Комментарий
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="lesson in classroom.lessons" :key="lesson.id">
                        <td class="px-3 sm:px-6 py-4">
                          <RouterLink
                            :to="`/lessons/${lesson.id}`"
                            class="text-sm font-medium text-main-green hover:text-main-green/80">
                            {{ lesson.name }}
                          </RouterLink>
                          <div
                            class="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">
                            {{ lesson.description }}
                          </div>
                        </td>
                        <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                          {{
                            grades.find((g) => g.lessonId === lesson.id)
                              ?.grade || "-"
                          }}
                        </td>
                        <td class="px-3 sm:px-6 py-4">
                          <div class="truncate max-w-[150px] sm:max-w-none">
                            {{
                              grades.find((g) => g.lessonId === lesson.id)
                                ?.comment || "-"
                            }}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
