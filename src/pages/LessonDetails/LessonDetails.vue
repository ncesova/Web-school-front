<script setup lang="ts">
import {ref, onMounted, watch, computed} from "vue";
import {useRoute} from "vue-router";
import Header from "../../components/Header.vue";
import Button from "../../components/ui/Button.vue";
import BackButton from "../../components/ui/BackButton.vue";
import {lessonService} from "../../services/lesson.service";
import {gradeService, type Grade} from "../../services/grade.service";
import {gameService, type Game} from "../../services/game.service";
import {authService} from "../../services/auth.service";
import {UserRole} from "../../types/auth";

interface Lesson {
  id: string;
  name: string;
  description?: string;
  gameIds?: string[];
  classroomId: string;
}

interface Message {
  type: "success" | "error";
  text: string;
}

interface ClassroomStudent {
  id: string;
  name?: string;
  surname?: string;
  username: string;
}

const route = useRoute();
const lessonId = route.params.id as string;

const lesson = ref<Lesson | null>(null);
const grades = ref<Grade[]>([]);
const games = ref<Game[]>([]);
const loading = ref(true);
const error = ref("");
const message = ref<Message | null>(null);

// Form states for adding/editing grades
const showAddGradeModal = ref(false);
const selectedStudentId = ref("");
const gradeValue = ref<number>(0);
const gradeComment = ref("");

// File upload state
const uploadProgress = ref(0);

// Add these refs
const fileInputRef = ref<HTMLInputElement | null>(null);
const hasSummaryFile = ref(false);

// Add to existing refs
const availableStudents = ref<ClassroomStudent[]>([]);
const isEditing = ref(false);
const editedName = ref("");
const editedDescription = ref("");
const editedGameIds = ref<string[]>([]);
const availableGames = ref<Game[]>([]);
const loadingGames = ref(false);

const isStudent = computed(
  () => authService.getUserRole() === UserRole.Student
);

const loadLessonData = async () => {
  try {
    loading.value = true;
    error.value = "";

    // Load lesson details
    const lessonData = await lessonService.getLessonById(lessonId);
    lesson.value = lessonData as unknown as Lesson;

    // Only load classroom students and grades if user is not a student
    if (!isStudent.value) {
      // Load classroom students
      await loadClassroomStudents();

      // Load grades
      const gradesData = await gradeService.getLessonGrades(lessonId);
      grades.value = gradesData as Grade[];
    }

    // Load games if lesson has gameIds
    if (lessonData.gameIds?.length) {
      const gamesData = await gameService.getAllGames();
      games.value = gamesData.filter((game) =>
        lessonData.gameIds?.includes(game.id)
      );
    }
  } catch (err) {
    console.error("Failed to load lesson data:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to load lesson data";
  } finally {
    loading.value = false;
  }
};

const handleAddGrade = async () => {
  try {
    await gradeService.addGrade(lessonId, {
      studentId: selectedStudentId.value,
      grade: gradeValue.value,
      comment: gradeComment.value || undefined,
    });

    // Refresh grades
    const gradesData = await gradeService.getLessonGrades(lessonId);
    grades.value = gradesData;

    // Reset form and close modal
    selectedStudentId.value = "";
    gradeValue.value = 0;
    gradeComment.value = "";
    showAddGradeModal.value = false;

    message.value = {type: "success", text: "Оценка успешно добавлена"};
    setTimeout(() => {
      message.value = null;
    }, 3000);
  } catch (err) {
    console.error("Failed to add grade:", err);
    error.value = err instanceof Error ? err.message : "Failed to add grade";
    message.value = {type: "error", text: error.value};
  }
};

const checkSummaryExists = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/lessons/${lessonId}/summary`,
      {
        method: "HEAD",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    hasSummaryFile.value = response.ok;
  } catch (err) {
    console.error("Failed to check summary existence:", err);
    hasSummaryFile.value = false;
  }
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const maxSize = 10 * 1024 * 1024; // 10MB limit

  if (file.size > maxSize) {
    error.value = "Файл слишком большой. Максимальный размер: 10MB";
    message.value = {type: "error", text: error.value};
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    uploadProgress.value = 0;
    await lessonService.uploadSummary(lessonId, formData, (progress) => {
      uploadProgress.value = Math.round(progress);
    });

    hasSummaryFile.value = true;
    message.value = {type: "success", text: "Файл успешно загружен"};

    // Reset file input
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }

    setTimeout(() => {
      message.value = null;
      uploadProgress.value = 0;
    }, 3000);
  } catch (err) {
    console.error("Failed to upload file:", err);
    error.value = err instanceof Error ? err.message : "Failed to upload file";
    message.value = {type: "error", text: error.value};
  }
};

const handleDownloadSummary = async () => {
  try {
    await lessonService.downloadSummary(lessonId);
    message.value = {type: "success", text: "Файл успешно скачан"};
    setTimeout(() => {
      message.value = null;
    }, 3000);
  } catch (err) {
    console.error("Failed to download file:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to download file";
    message.value = {type: "error", text: error.value};
  }
};

const handleDeleteSummary = async () => {
  try {
    await lessonService.deleteSummary(lessonId);
    hasSummaryFile.value = false;
    message.value = {type: "success", text: "Файл успешно удален"};
    setTimeout(() => {
      message.value = null;
    }, 3000);
  } catch (err) {
    console.error("Failed to delete file:", err);
    error.value = err instanceof Error ? err.message : "Failed to delete file";
    message.value = {type: "error", text: error.value};
  }
};

const loadClassroomStudents = async () => {
  try {
    if (!lesson.value?.classroomId) return;

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/classroom/${
        lesson.value.classroomId
      }/details`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load classroom students");
    }

    const classroomData = await response.json();
    availableStudents.value = classroomData.students;
  } catch (err) {
    console.error("Failed to load classroom students:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to load students";
  }
};

const loadAvailableGames = async () => {
  try {
    loadingGames.value = true;
    const games = await gameService.getAllGames();
    availableGames.value = games;
    console.log("Available games:", games);
  } catch (err) {
    console.error("Failed to load games:", err);
    error.value = err instanceof Error ? err.message : "Failed to load games";
  } finally {
    loadingGames.value = false;
  }
};

const startEditing = () => {
  editedName.value = lesson.value?.name || "";
  editedDescription.value = lesson.value?.description || "";
  editedGameIds.value = lesson.value?.gameIds || [];
  isEditing.value = true;
  loadAvailableGames();
};

const cancelEditing = () => {
  isEditing.value = false;
  editedName.value = "";
  editedDescription.value = "";
  editedGameIds.value = [];
};

// Add this function to handle all updates
const handleUpdateLesson = async () => {
  try {
    if (!lesson.value) return;

    await lessonService.updateLesson(lessonId, {
      name: editedName.value,
      description: editedDescription.value,
      gameIds: editedGameIds.value,
    });

    // Refresh lesson data
    const updatedLesson = await lessonService.getLessonById(lessonId);
    lesson.value = updatedLesson as unknown as Lesson;

    // Refresh games data
    if (updatedLesson.gameIds?.length) {
      const gamesData = await gameService.getAllGames();
      games.value = gamesData.filter((game) =>
        updatedLesson.gameIds?.includes(game.id)
      );
    } else {
      games.value = [];
    }

    // Reset edit mode
    isEditing.value = false;
    message.value = {type: "success", text: "Урок успешно обновлен"};
    setTimeout(() => {
      message.value = null;
    }, 3000);
  } catch (err) {
    console.error("Failed to update lesson:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to update lesson";
    message.value = {type: "error", text: error.value};
  }
};

onMounted(() => {
  loadLessonData();
  checkSummaryExists();
});

watch(showAddGradeModal, (newValue) => {
  if (newValue) {
    // Reset form when opening modal
    selectedStudentId.value = "";
    gradeValue.value = 0;
    gradeComment.value = "";
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <BackButton />

    <!-- Message notification -->
    <div
      v-if="message"
      :class="[
        'fixed top-4 right-4 px-4 py-2 rounded-lg z-50 transition-all duration-300',
        message.type === 'success' ? 'bg-green-500' : 'bg-red-500',
        'text-white',
      ]">
      {{ message.text }}
    </div>

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
      <template v-else-if="lesson">
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <div v-if="!isEditing">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                  {{ lesson.name }}
                </h1>
                <p class="text-gray-600">{{ lesson.description }}</p>
              </div>
              <div v-else class="space-y-4 w-full max-w-2xl">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Название урока
                  </label>
                  <input
                    v-model="editedName"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-main-green focus:ring-main-green" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Описание
                  </label>
                  <textarea
                    v-model="editedDescription"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-main-green focus:ring-main-green"></textarea>
                </div>

                <!-- Games Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Выберите игры для урока
                  </label>

                  <div v-if="loadingGames" class="text-center py-4">
                    Загрузка списка игр...
                  </div>

                  <div
                    v-else
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                      v-for="game in availableGames"
                      :key="game.id"
                      class="bg-gray-50 p-4 rounded-lg flex items-center">
                      <input
                        type="checkbox"
                        :id="game.id"
                        :value="game.id"
                        v-model="editedGameIds"
                        class="h-4 w-4 text-main-green focus:ring-main-green border-gray-300 rounded" />
                      <label
                        :for="game.id"
                        class="ml-3 block text-sm font-medium text-gray-700">
                        {{ game.name }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <template v-if="!isStudent && !isEditing">
                <Button @click="startEditing">Редактировать</Button>
                <Button @click="showAddGradeModal = true">
                  Добавить оценку
                </Button>
              </template>
              <template v-if="!isStudent && isEditing">
                <Button @click="cancelEditing" class="bg-gray-500">
                  Отмена
                </Button>
                <Button
                  @click="handleUpdateLesson"
                  :disabled="!editedName.trim()">
                  Сохранить
                </Button>
              </template>
            </div>
          </div>

          <!-- Games Section -->
          <div v-if="games.length || isEditing" class="mb-8">
            <h2 class="text-xl font-semibold mb-4">Игры урока</h2>

            <!-- Games List -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="game in games"
                :key="game.id"
                class="bg-gray-50 p-4 rounded-lg">
                <template v-if="game.url">
                  <RouterLink
                    :to="game.url"
                    class="font-medium text-main-green hover:text-main-green/80 transition-colors">
                    {{ game.name }}
                  </RouterLink>
                </template>
                <template v-else>
                  <h3 class="font-medium">{{ game.name }}</h3>
                </template>
              </div>
            </div>
          </div>

          <!-- Summary File Section -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">Материалы урока</h2>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <input
                  ref="fileInputRef"
                  type="file"
                  @change="handleFileUpload"
                  accept=".pdf,.doc,.docx,.txt"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-main-green file:text-white hover:file:bg-main-green/90" />
                <div class="flex gap-2">
                  <Button
                    v-if="hasSummaryFile"
                    @click="handleDownloadSummary"
                    class="whitespace-nowrap">
                    Скачать
                  </Button>
                  <Button
                    v-if="hasSummaryFile"
                    @click="handleDeleteSummary"
                    class="bg-red-500 hover:bg-red-600 whitespace-nowrap">
                    Удалить
                  </Button>
                </div>
              </div>

              <!-- Upload Progress -->
              <div v-if="uploadProgress > 0" class="relative pt-1">
                <div class="flex mb-2 items-center justify-between">
                  <div>
                    <span
                      class="text-xs font-semibold inline-block text-main-green">
                      Загрузка
                    </span>
                  </div>
                  <div class="text-right">
                    <span
                      class="text-xs font-semibold inline-block text-main-green">
                      {{ Math.round(uploadProgress) }}%
                    </span>
                  </div>
                </div>
                <div
                  class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    :style="`width: ${uploadProgress}%`"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-main-green transition-all duration-300"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Grades Section - Only visible for teachers -->
          <div v-if="!isStudent">
            <h2 class="text-xl font-semibold mb-4">Оценки</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Студент
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Оценка
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Комментарий
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="grade in grades" :key="grade.studentId">
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{
                        availableStudents.find((s) => s.id === grade.studentId)
                          ?.name || grade.studentId
                      }}
                      {{
                        availableStudents.find((s) => s.id === grade.studentId)
                          ?.surname
                      }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ grade.grade }}
                    </td>
                    <td class="px-6 py-4">
                      {{ grade.comment || "-" }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>

      <!-- Add Grade Modal -->
      <div
        v-if="showAddGradeModal && !isStudent"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 class="text-xl font-bold mb-4">Добавить оценку</h2>

          <form @submit.prevent="handleAddGrade" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Выберите ученика
              </label>
              <select
                v-model="selectedStudentId"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-main-green focus:ring-main-green">
                <option value="">Выберите ученика</option>
                <option
                  v-for="student in availableStudents"
                  :key="student.id"
                  :value="student.id">
                  {{ student.name }} {{ student.surname }} ({{
                    student.username
                  }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Оценка
              </label>
              <input
                v-model.number="gradeValue"
                type="number"
                required
                min="1"
                max="5"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-main-green focus:ring-main-green" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Комментарий
              </label>
              <textarea
                v-model="gradeComment"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-main-green focus:ring-main-green"></textarea>
            </div>

            <div class="flex justify-end space-x-4">
              <Button
                type="button"
                @click="showAddGradeModal = false"
                class="bg-gray-500">
                Отмена
              </Button>
              <Button
                type="submit"
                :disabled="!selectedStudentId || gradeValue === null">
                Добавить
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
