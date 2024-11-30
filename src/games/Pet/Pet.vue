<template>
  <div class="game-container">
    <h1 class="text-xl font-semibold">Программирование с питомцем</h1>
    <pre>{{ missionDescription }}</pre>

    <!-- Кнопка для прослушивания аудио -->
    <button @click="playAudio" :disabled="loading">
      Прослушать описание задачи
    </button>

    <div
      class="w-[50vw] h-[60vh] overflow-hidden relative flex items-center justify-center mx-auto border-2 border-main-green rounded-lg my-3">
      <div :style="petStyle" class="pet">
        <img src="./frog.svg" />
      </div>
    </div>

    <input
      v-model="userCommand"
      @keyup.enter="executeCommand"
      placeholder="Введите команду для питомца..." />

    <button @click="executeCommand" :disabled="loading">
      {{ loading ? "Выполнение..." : "Выполнить команду" }}
    </button>

    <div v-if="outputMessage" class="output">
      <p>{{ outputMessage }}</p>
    </div>

    <!-- Скрытый аудиофайл -->
    <audio ref="audio" :src="audioSrc" />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const missionDescription = ref(
  "Помоги питомцу выполнить команды! Напиши команду для питомца, чтобы он мог двигаться, прыгать или приседать\n\nВот какие команды существуют:\npet.jump() - питомец прыгнет\npet.sitdown() - питомец присядет\npet.left() - питомец двинется влево\npet.right() - питомец двинется вправо"
);

// Данные для аудио
const audioSrc = ref("path/to/audio/mission-description.mp3"); // Укажите путь к вашему аудиофайлу

const userCommand = ref("");
const outputMessage = ref("");
const petStyle = ref({
  position: "relative" as const,
  width: "100px",
  height: "100px",
  transition: "all 0.5s ease",
  bottom: "0px",
  left: "0px",
  backgroundColor: "transparent",
});

const loading = ref(false);

const executeCommand = () => {
  if (!userCommand.value) return;

  loading.value = true;
  outputMessage.value = "";

  setTimeout(() => {
    const command = userCommand.value.trim().toLowerCase();

    switch (command) {
      case "pet.right()":
        petStyle.value.left = parseInt(petStyle.value.left || "0") + 100 + "px";
        outputMessage.value = "Питомец двигается вправо!";
        break;
      case "pet.left()":
        petStyle.value.left = parseInt(petStyle.value.left || "0") - 100 + "px";
        outputMessage.value = "Питомец двигается влево!";
        break;
      case "pet.jump()":
        petStyle.value.bottom =
          parseInt(petStyle.value.bottom || "0") + 100 + "px";
        outputMessage.value = "Питомец прыгнул!";
        break;
      case "pet.sitdown()":
        petStyle.value.bottom = "0px";
        outputMessage.value = "Питомец сел!";
        break;
      case "pet.color()":
        const colors = [
          "lightblue",
          "lightgreen",
          "lightcoral",
          "lightsalmon",
          "lightgoldenrodyellow",
        ];
        petStyle.value.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        outputMessage.value = "Цвет питомца изменён!";
        break;
      default:
        outputMessage.value = "Неизвестная команда! Попробуй снова.";
    }

    userCommand.value = "";
    loading.value = false;
  }, 1000);
};

// Функция для проигрывания аудио
const playAudio = () => {
  const audio = document.querySelector("audio") as HTMLAudioElement;
  if (audio) {
    audio.play();
  }
};
</script>

<style scoped>
.game-container {
  text-align: center;
  margin-top: 30px;
  font-family: "Courier New", Courier, monospace;
}

.pet {
  margin: 20px auto;
}

input {
  font-size: 16px;
  padding: 8px;
  width: 60%;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #0056b3;
}

.output {
  margin-top: 20px;
  font-weight: bold;
}
</style>
