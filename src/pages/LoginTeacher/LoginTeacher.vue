<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import Button from "../../components/ui/Button.vue";
import BackButton from "../../components/ui/BackButton.vue";
import {authService} from "../../services/auth.service";

const router = useRouter();
const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  if (loading.value) return;

  try {
    loading.value = true;
    error.value = "";

    const response = await authService.login({
      username: username.value,
      password: password.value,
    });

    console.log("Login successful:", response);

    // Redirect to home page after successful login
    router.push("/");
  } catch (err) {
    console.error("Login error:", err);
    error.value =
      err instanceof Error ? err.message : "An error occurred during login";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 relative">
    <BackButton />
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Вход для наставника
        </h2>
      </div>

      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert">
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <form class="mt-8 space-y-6" @submit="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700"
              >Username</label
            >
            <input
              id="username"
              v-model="username"
              type="text"
              required
              :disabled="loading"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-main-green focus:border-main-green"
              placeholder="username" />
          </div>
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Пароль</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              required
              :disabled="loading"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-main-green focus:border-main-green"
              placeholder="••••••••" />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            class="w-full flex justify-center"
            :disabled="loading">
            {{ loading ? "Вход..." : "Войти" }}
          </Button>
        </div>
      </form>

      <div class="text-center mt-4">
        <RouterLink
          to="/signup-teacher"
          class="text-sm text-main-green hover:text-main-green/90">
          Нет аккаунта? Зарегистрироваться
        </RouterLink>
      </div>
    </div>
  </div>
</template>
