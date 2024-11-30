<script setup lang="ts">
import Header from "../../components/Header.vue";
import {ref, onMounted} from "vue";
import {userService} from "../../services/user.service";
import {authService} from "../../services/auth.service";
import type {User} from "../../types/user";
import Button from "../../components/ui/Button.vue";

const user = ref<User | null>(null);
const children = ref<User[]>([]);
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

    // Load children data
    console.log("Fetching children data...");
    const childrenData = await userService.getParentChildren();
    console.log("Children data:", childrenData);
    children.value = childrenData;
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

          <div v-else class="grid grid-cols-1 gap-6">
            <div
              v-for="child in children"
              :key="child.id"
              class="bg-gray-50 p-6 rounded-lg">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">
                    {{ child.name }} {{ child.surname }}
                  </h3>
                  <p class="text-gray-600">{{ child.username }}</p>
                </div>
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
