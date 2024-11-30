<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {classroomService} from "../../services/classroom.service";
import Button from "../../components/ui/Button.vue";
import BackButton from "../../components/ui/BackButton.vue";

const router = useRouter();
const name = ref("");
const error = ref("");
const loading = ref(false);
const successMessage = ref("");

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  if (loading.value) return;

  try {
    loading.value = true;
    error.value = "";
    successMessage.value = "";

    await classroomService.createClassroom({
      name: name.value,
    });

    successMessage.value = "Класс успешно создан";
    setTimeout(() => {
      router.push("/teacher-cabinet");
    }, 1500);
  } catch (err) {
    console.error("Create classroom error:", err);
    error.value =
      err instanceof Error ? err.message : "Failed to create classroom";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 relative">
    <BackButton />

    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Создать класс</h1>

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

        <!-- Create Form -->
        <form @submit="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"
              >Название класса</label
            >
            <input
              id="name"
              v-model="name"
              type="text"
              required
              :disabled="loading"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main-green focus:border-main-green"
              placeholder="Например: Программирование для начинающих" />
          </div>

          <div class="flex justify-end">
            <Button
              type="submit"
              :disabled="loading"
              class="inline-flex justify-center">
              {{ loading ? "Создание..." : "Создать класс" }}
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
