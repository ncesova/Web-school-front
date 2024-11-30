<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import Button from "../../components/ui/Button.vue";
import BackButton from "../../components/ui/BackButton.vue";
import {authService} from "../../services/auth.service";
import {UserRole} from "../../types/auth";

const router = useRouter();
const username = ref("");
const password = ref("");
const name = ref("");
const surname = ref("");
const error = ref("");
const loading = ref(false);

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  if (loading.value) return;

  try {
    loading.value = true;
    error.value = "";

    await authService.signup({
      username: username.value,
      password: password.value,
      name: name.value,
      surname: surname.value,
      roleId: UserRole.Teacher,
    });

    // After successful registration, log in the user
    await authService.login({
      username: username.value,
      password: password.value,
    });

    router.push("/");
  } catch (err) {
    console.error("Signup error:", err);
    error.value =
      err instanceof Error
        ? err.message
        : "An error occurred during registration";
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
          Регистрация наставника
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Станьте частью нашей команды преподавателей
        </p>
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
            <label for="name" class="block text-sm font-medium text-gray-700"
              >Имя</label
            >
            <input
              id="name"
              v-model="name"
              type="text"
              :disabled="loading"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-main-green focus:border-main-green"
              placeholder="Иван" />
          </div>

          <div>
            <label for="surname" class="block text-sm font-medium text-gray-700"
              >Фамилия</label
            >
            <input
              id="surname"
              v-model="surname"
              type="text"
              :disabled="loading"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-main-green focus:border-main-green"
              placeholder="Иванов" />
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
            {{ loading ? "Регистрация..." : "Зарегистрироваться" }}
          </Button>
        </div>

        <div class="text-center">
          <RouterLink
            to="/login-teacher"
            class="text-sm text-main-green hover:text-main-green/90">
            Уже есть аккаунт? Войти
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
