<template>
  <div class="min-h-screen">
    <Header />

    <!-- Hero Section -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Программирование<br />
            для школьников
          </h1>
          <p class="text-lg sm:text-xl text-gray-600 mb-8">
            Изучайте программирование через интерактивные уроки и игры с
            опытными наставниками
          </p>

          <!-- Search Section -->
          <div class="max-w-2xl mx-auto mb-8">
            <div class="flex flex-col sm:flex-row gap-4">
              <select
                v-model="selectedSkill"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-green">
                <option value="">Выбери что хочешь изучать</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="web">Web-разработка</option>
                <option value="games">Создание игр</option>
                <option value="algorithms">Алгоритмы</option>
              </select>
              <Button @click="findMentor" class="w-full sm:w-auto">
                Начать обучение
              </Button>
            </div>
          </div>

          <!-- Popular Tags -->
          <div class="flex flex-wrap justify-center gap-2 mb-12">
            <span
              v-for="tag in popularTags"
              :key="tag"
              class="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-main-green mb-2">100+</div>
            <div class="text-gray-600">Интерактивных уроков</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-main-green mb-2">60+</div>
            <div class="text-gray-600">Учеников уже с нами</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-main-green mb-2">81%</div>
            <div class="text-gray-600">Успешно завершают курс</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          Почему стоит учиться у нас?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-main-green text-4xl mb-4">🎮</div>
            <h3 class="text-xl font-semibold mb-2">Обучение через игры</h3>
            <p class="text-gray-600">
              Изучайте программирование через интерактивные игры и задания
            </p>
          </div>
          <div class="text-center">
            <div class="text-main-green text-4xl mb-4">👨‍🏫</div>
            <h3 class="text-xl font-semibold mb-2">Опытные наставники</h3>
            <p class="text-gray-600">
              Персональные занятия с профессиональными разработчиками
            </p>
          </div>
          <div class="text-center">
            <div class="text-main-green text-4xl mb-4">📈</div>
            <h3 class="text-xl font-semibold mb-2">Отслеживание прогресса</h3>
            <p class="text-gray-600">
              Следите за своими успехами и получайте награды за достижения
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import Header from "../components/Header.vue";
import Button from "../components/ui/Button.vue";

const router = useRouter();
const selectedSkill = ref("");

const popularTags = [
  "Python для начинающих",
  "Создание игр",
  "Web-разработка",
  "JavaScript",
  "Алгоритмы",
  "HTML/CSS",
];

const mentors = [
  {
    id: 1,
    name: "Александр Петров",
    role: "Senior Software Engineer в EPAM",
    description:
      "Учу программированию на Python и созданию игр. 5 лет опыта преподавания.",
    image: "/images/mentor1.jpg",
  },
  {
    id: 2,
    name: "Мария Иванова",
    role: "Frontend Developer в Yandex",
    description: "Специализируюсь на JavaScript и современной веб-разработке.",
    image: "/images/mentor2.jpg",
  },
  {
    id: 3,
    name: "Дмитрий Сидоров",
    role: "Game Developer",
    description:
      "Создаю игры и обучаю основам геймдева. Работаю с Unity и Python.",
    image: "/images/mentor3.jpg",
  },
  {
    id: 4,
    name: "Анна Козлова",
    role: "Software Engineer в Google",
    description:
      "Преподаю алгоритмы и структуры данных. Помогаю с олимпиадным программированием.",
    image: "/images/mentor4.jpg",
  },
];

const findMentor = () => {
  if (selectedSkill.value) {
    router.push(`/search?skill=${selectedSkill.value}`);
  }
};
</script>

<style scoped>
.bg-main-green {
  background-color: #4caf50;
}
</style>
