<script setup lang="ts">
import Header from "../../components/Header.vue";
import {ref, onMounted, watch} from "vue";
import {userService} from "../../services/user.service";
import {authService} from "../../services/auth.service";
import {classroomService} from "../../services/classroom.service";
import type {User} from "../../types/user";
import type {Classroom} from "../../types/classroom";
import Button from "../../components/ui/Button.vue";
import BackButton from "../../components/ui/BackButton.vue";

const user = ref<User | null>(null);
const classrooms = ref<Classroom[]>([]);
const loading = ref(true);
const error = ref("");

const stats = ref({
  totalStudents: 0,
  activeClassrooms: 0,
  averageGrade: 0,
});

const loadData = async () => {
  console.log("Starting to load data");
  try {
    const userId = authService.getUserId();
    console.log("Got userId:", userId);

    if (!userId) {
      console.error("No userId found in storage");
      throw new Error("User ID not found");
    }

    // Load user data
    console.log("Fetching user data...");
    const userData = await userService.getUserById(userId);
    user.value = userData;

    // Load classrooms
    console.log("Fetching classrooms...");
    const classroomsData = await classroomService.getTeacherClassrooms();

    // Load detailed data for each classroom
    const detailedClassrooms = await Promise.all(
      classroomsData.map(async (classroom) => {
        const details = await classroomService.getClassroomDetails(
          classroom.id
        );
        return details;
      })
    );

    classrooms.value = detailedClassrooms;

    // Update stats
    stats.value.activeClassrooms = classrooms.value.length;
    // Calculate total students from all classrooms
    stats.value.totalStudents = classrooms.value.reduce(
      (total, classroom) => total + (classroom.students?.length || 0),
      0
    );
    // You might want to add API endpoints to get these stats
    stats.value.averageGrade = 0; // This should come from an API
  } catch (err) {
    console.error("Failed to load data:", err);
    error.value = err instanceof Error ? err.message : "Failed to load data";
  } finally {
    loading.value = false;
  }
};

const handleDeleteClassroom = async (classroomId: string) => {
  try {
    await classroomService.deleteClassroom(classroomId);
    classrooms.value = classrooms.value.filter((c) => c.id !== classroomId);
    stats.value.activeClassrooms = classrooms.value.length;
  } catch (err) {
    console.error("Failed to delete classroom:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to delete classroom";
  }
};

onMounted(() => {
  loadData();
});

const getDisplayName = () => {
  if (!user.value) return "";
  return user.value.name && user.value.surname
    ? `${user.value.name} ${user.value.surname}`
    : user.value.username;
};

// Add watcher to update stats when classrooms change
watch(
  classrooms,
  async (newClassrooms) => {
    stats.value.activeClassrooms = newClassrooms.length;
    stats.value.totalStudents = newClassrooms.reduce(
      (total, classroom) => total + (classroom.students?.length || 0),
      0
    );
  },
  {deep: true}
);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <BackButton />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
        <div class="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-8">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1
              class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              Добро пожаловать, {{ getDisplayName() }}!
            </h1>
            <RouterLink to="/profile/edit">
              <Button>Редактировать профиль</Button>
            </RouterLink>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        <!-- Classrooms Section -->
        <div class="bg-white rounded-lg shadow p-4 sm:p-6">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2
              class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
              Мои классы
            </h2>
            <RouterLink to="/classroom/create">
              <Button>Создать класс</Button>
            </RouterLink>
          </div>

          <div class="space-y-4">
            <div
              v-if="classrooms.length === 0"
              class="text-center text-gray-500">
              У вас пока нет классов. Создайте свой первый класс!
            </div>

            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="classroom in classrooms"
                :key="classroom.id"
                class="bg-gray-50 p-4 rounded-lg">
                <div class="flex flex-col h-full">
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">
                      {{ classroom.name }}
                    </h3>
                    <div class="space-y-2 text-sm text-gray-600">
                      <p>Учеников: {{ classroom.students?.length || 0 }}</p>
                      <p>Уроков: {{ classroom.lessons?.length || 0 }}</p>
                    </div>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2 mt-4">
                    <RouterLink
                      :to="`/classroom/${classroom.id}`"
                      class="flex-1">
                      <Button class="w-full">Подробнее</Button>
                    </RouterLink>
                    <Button
                      @click="handleDeleteClassroom(classroom.id)"
                      class="bg-red-500 hover:bg-red-600 w-full sm:w-auto">
                      Удалить
                    </Button>
                  </div>
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
