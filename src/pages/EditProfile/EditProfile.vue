<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import {useRouter} from "vue-router";
import {userService} from "../../services/user.service";
import {authService} from "../../services/auth.service";
import {teacherService, type TeacherInfo} from "../../services/teacher.service";
import {tagService} from "../../services/tag.service";
import type {User} from "../../types/user";
import {UserRole} from "../../types/auth";
import Button from "../../components/ui/Button.vue";
import BackButton from "../../components/ui/BackButton.vue";

const router = useRouter();
const user = ref<User | null>(null);
const teacherInfo = ref<TeacherInfo | null>(null);
const loading = ref(true);
const error = ref("");
const successMessage = ref("");

// Basic user info
const name = ref("");
const surname = ref("");
const username = ref("");

// Teacher metadata
const aboutTeacher = ref("");
const canHelpWith = ref("");
const resume = ref("");
const tagsId = ref("");

const availableTags = ref<string[]>([]);
const selectedTags = ref<string[]>([]);
const newTagName = ref("");
const tagError = ref("");

const isTeacher = computed(
  () => authService.getUserRole() === UserRole.Teacher
);

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
    console.log("Received user data:", userData);
    user.value = userData;
    name.value = userData.name || "";
    surname.value = userData.surname || "";
    username.value = userData.username;

    // Load teacher info if user is a teacher
    if (isTeacher.value) {
      console.log("Loading teacher info...");
      try {
        const info = await teacherService.getTeacherInfo();
        teacherInfo.value = info;
        aboutTeacher.value = info.aboutTeacher || "";
        canHelpWith.value = info.canHelpWith || "";
        resume.value = info.resume || "";
        tagsId.value = info.tagsId || "";
        console.log("Teacher info loaded successfully");
      } catch (err) {
        console.error("Failed to load teacher info:", err);
        // Don't throw error here, just log it
      }
    }

    // Load available tags
    if (isTeacher.value) {
      try {
        availableTags.value = await tagService.getAllTags();

        // If teacher info exists, set selected tags
        if (teacherInfo.value?.tagsId) {
          selectedTags.value = teacherInfo.value.tagsId.split(",");
        }
      } catch (err) {
        console.error("Failed to load tags:", err);
        tagError.value = "Failed to load available tags";
      }
    }
  } catch (err) {
    console.error("Failed to load data:", err);
    error.value = err instanceof Error ? err.message : "Failed to load data";
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  if (loading.value) return;

  console.log("Starting profile update");
  try {
    loading.value = true;
    error.value = "";
    successMessage.value = "";

    if (isTeacher.value) {
      const teacherData: TeacherInfo = {
        aboutTeacher: aboutTeacher.value || undefined,
        canHelpWith: canHelpWith.value || undefined,
        resume: resume.value || undefined,
        tagsId: selectedTags.value.join(",") || undefined,
      };

      if (teacherInfo.value) {
        await teacherService.updateTeacherInfo(teacherData);
      } else {
        await teacherService.createTeacherInfo(teacherData);
      }
    }

    successMessage.value = "Профиль успешно обновлен";

    setTimeout(() => {
      router.push(isTeacher.value ? "/teacher-cabinet" : "/cabinet");
    }, 1500);
  } catch (err) {
    console.error("Update error:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to update profile";
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
};

const handleAddNewTag = async () => {
  if (!newTagName.value.trim()) return;

  try {
    tagError.value = "";
    await tagService.createTag({name: newTagName.value.trim()});

    // Refresh available tags
    availableTags.value = await tagService.getAllTags();

    // Clear input
    newTagName.value = "";
  } catch (err) {
    console.error("Failed to create tag:", err);
    tagError.value =
      err instanceof Error ? err.message : "Failed to create tag";
  }
};

onMounted(() => {
  console.log("Component mounted, calling loadData");
  loadData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 relative">
    <BackButton />

    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          Редактировать профиль
        </h1>

        <!-- Loading State -->
        <div v-if="loading && !user" class="text-center py-4">
          <p>Loading...</p>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert">
          <span class="block sm:inline">{{ error }}</span>
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert">
          <span class="block sm:inline">{{ successMessage }}</span>
        </div>

        <!-- Edit Form -->
        <form v-if="!loading || user" @submit="handleSubmit" class="space-y-6">
          <!-- Teacher-specific fields -->
          <template v-if="isTeacher">
            <div>
              <label
                for="aboutTeacher"
                class="block text-sm font-medium text-gray-700"
                >О себе</label
              >
              <textarea
                id="aboutTeacher"
                v-model="aboutTeacher"
                rows="4"
                :disabled="loading"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main-green focus:border-main-green"
                placeholder="Расскажите о своем опыте преподавания..."></textarea>
            </div>

            <div>
              <label
                for="canHelpWith"
                class="block text-sm font-medium text-gray-700"
                >Могу помочь с</label
              >
              <textarea
                id="canHelpWith"
                v-model="canHelpWith"
                rows="4"
                :disabled="loading"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main-green focus:border-main-green"
                placeholder="Опишите, с чем вы можете помочь ученикам..."></textarea>
            </div>

            <div>
              <label
                for="resume"
                class="block text-sm font-medium text-gray-700"
                >Резюме</label
              >
              <textarea
                id="resume"
                v-model="resume"
                rows="4"
                :disabled="loading"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main-green focus:border-main-green"
                placeholder="Ваше профессиональное резюме..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Теги</label
              >

              <!-- Tag Error Message -->
              <div v-if="tagError" class="text-red-600 text-sm mb-2">
                {{ tagError }}
              </div>

              <!-- Add New Tag -->
              <div class="flex gap-2 mb-4">
                <input
                  v-model="newTagName"
                  type="text"
                  placeholder="Новый тег"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-main-green focus:border-main-green" />
                <Button @click="handleAddNewTag" :disabled="!newTagName.trim()">
                  Добавить тег
                </Button>
              </div>

              <!-- Available Tags -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in availableTags"
                  :key="tag"
                  @click="handleTagToggle(tag)"
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    selectedTags.includes(tag)
                      ? 'bg-main-green text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]">
                  {{ tag }}
                </button>
              </div>
            </div>
          </template>

          <div class="flex justify-end space-x-4">
            <Button
              type="submit"
              :disabled="loading"
              class="inline-flex justify-center">
              {{ loading ? "Сохранение..." : "Сохранить изменения" }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-main-green {
  background-color: #4caf50;
}
</style>
