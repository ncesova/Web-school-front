<template>
  <div class="game-container">
    <h1 class="main-title">Найди и исправь ошибки в верстке</h1>

    <div class="image-container">
      <!-- Верстка с лишними блоками или элементами -->
      <div class="content">
        <h2 class="welcome-title">Добро пожаловать на сайт!</h2>
        <p class="intro-text">Здесь есть полезная информация о продукте.</p>
        
        <!-- Лишний блок -->
        <transition name="fade" @before-leave="beforeLeave" @leave="leave">
          <div
            v-if="!errorStatus[1]"
            class="extra-block"
            @click="fixError(1)"
          >
            <p class="error-text">Этот блок не должен быть здесь!</p>
          </div>
        </transition>

        <p class="product-info">Наши продукты помогают вам достичь ваших целей.</p>
        
        <!-- Лишний текст -->
        <transition name="fade" @before-leave="beforeLeave" @leave="leave">
          <p
            v-if="!errorStatus[2]"
            class="extra-text"
            @click="fixError(2)"
          >
            Этот текст не должен быть на странице!
          </p>
        </transition>

        <footer class="footer">
          <p>Контакты</p>
          <p>Компания XYZ</p>
        </footer>
      </div>
    </div>

    <!-- Сообщение о завершении игры -->
    <div v-if="isFinished" class="finished-message">
      <p>Поздравляю! Вы исправили все ошибки в верстке.</p>
      <button class="reset-button" @click="resetGame">Начать заново</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Статус ошибок
const errorStatus = ref({ 1: false, 2: false }); 
const isFinished = ref(false);

// Обработчик клика по ошибке
const fixError = (errorId: number) => {
  // Отметим ошибку как исправленную
  errorStatus.value[errorId] = true;
  checkIfFinished();
};

// Проверка, все ли ошибки исправлены
const checkIfFinished = () => {
  if (Object.values(errorStatus.value).every(status => status)) {
    isFinished.value = true;
  }
};

// Сбрасываем игру
const resetGame = () => {
  errorStatus.value = { 1: false, 2: false };
  isFinished.value = false;
};

// Функции для анимации
const beforeLeave = (el: HTMLElement) => {
  el.style.transition = "opacity 0.5s";
};

const leave = (el: HTMLElement) => {
  el.style.opacity = 0;
};
</script>

<style scoped>
/* Основной фон игры */
.game-container {
  background: linear-gradient(to right, #6a11cb, #2575fc); /* Градиентный фон */
  padding: 50px;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  color: #fff;
  min-height: 100vh;
}

/* Заголовок игры */
.main-title {
  font-size: 36px;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
  color: #fff;
}

/* Оформление приветственного текста */
.welcome-title {
  font-size: 28px;
  margin: 20px 0;
  color: #ffd700;
}

/* Общий стиль для текста */
.intro-text,
.product-info {
  font-size: 18px;
  margin: 10px 0;
}

/* Оформление ошибок */
.extra-block,
.extra-text {
  background-color: rgba(255, 0, 0, 0.7); /* Красный фон для ошибок */
  border: 2px solid red;
  cursor: pointer;
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

/* Стиль после исправления ошибки */
.fixed {
  background-color: rgba(0, 255, 0, 0.7); /* Зеленый фон после исправления ошибки */
}

/* Текст ошибки */
.error-text {
  font-size: 20px;
  font-weight: bold;
}

/* Анимация для плавного исчезновения */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Подвал */
.footer {
  margin-top: 50px;
  font-size: 16px;
  color: #fff;
  text-align: center;
}

/* Сообщение о завершении игры */
.finished-message {
  margin-top: 50px;
  font-size: 20px;
  color: #fff;
  font-weight: bold;
}

.reset-button {
  padding: 12px 20px;
  font-size: 18px;
  background-color: #ffd700;
  border: none;
  border-radius: 5px;
  color: #000;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.reset-button:hover {
  background-color: #ffcc00;
}
</style>
