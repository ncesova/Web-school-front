<script setup lang="ts">
import Button from "./ui/Button.vue";
import {authService} from "../services/auth.service";
import {computed} from "vue";
import {useRouter, useRoute} from "vue-router";

const router = useRouter();
const route = useRoute();
const isAuthenticated = computed(() => authService.isAuthenticated());

const handleLogout = () => {
  authService.logout();
  router.push("/login");
};

const isTeacherCabinet = computed(() => route.path === "/teacher-cabinet");
</script>

<template>
  <div class="px-5 py-2 border-b">
    <div class="flex items-center justify-between">
      <RouterLink to="/" v-if="$route.path === '/' || isTeacherCabinet">
        <h1 class="tracking-widest text-[30px] font-semibold">CodeCouch</h1>
      </RouterLink>
      <div v-else></div>

      <div v-if="!isAuthenticated">
        <ul class="flex items-center gap-5">
          <RouterLink to="/signup-teacher">
            <li class="cursor-pointer">Стать наставником</li>
          </RouterLink>
          <RouterLink to="/login">
            <li class="cursor-pointer">Вход для родителя</li>
          </RouterLink>
          <RouterLink to="/login-teacher">
            <li class="cursor-pointer">Вход для ментора</li>
          </RouterLink>
          <li><Button>Подобрать ментора</Button></li>
        </ul>
      </div>

      <div v-else>
        <ul class="flex items-center gap-5">
          <RouterLink to="/cabinet">
            <li class="cursor-pointer">Мой кабинет</li>
          </RouterLink>
          <li>
            <Button @click="handleLogout">Выйти</Button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
