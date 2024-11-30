<template>
  <div id="app">
    <h1 class="text-xl font-semibold">Кодовый замок</h1>
    <div v-if="level === 0" class="start-screen flex flex-col items-center justify-center">
      <p class="max-w-[40vw] mx-auto">В этой игре ты должен решить серию логических задач, используя навыки программирования. Твоя цель — открыть все замки, написав правильные программы. На каждом уровне тебе предстоит решить задачу, используя условные операторы, циклы и другие концепции программирования.

        Каждый уровень представляет собой новую задачу, которую нужно решить с помощью написания кода. После того как ты напишешь решение, оно будет проверено, и если ты решишь задачу правильно, замок откроется, и ты перейдешь к следующему уровню. Если ответ окажется неверным, ты сможешь попробовать снова.</p>
      <Button @click="startGame" class="w-fix mt-3">Начать игру</Button>
    </div>

    <div v-if="level > 0 && level <= levels.length" class="game-screen flex flex-col items-center justify-center">
      <div class="lock w-[40vw]">
        <p><strong>Задача:</strong> {{ levels[level - 1].description }}</p>
        <p><strong>Данные:</strong> {{ levels[level - 1].task }}</p>
        <div class="input-container flex flex-col justify-center items-center gap-2">
          <textarea v-model="userInput" placeholder="Введите решение..." rows="5" class=" max-h-10 min-h-10 resize-none mr-0"></textarea>
          <Button @click="checkCode">Подтвердить</Button>
        </div>
      </div>
      <div v-if="isSuccess" class="success-message flex flex-col items-center justify-center">
        <p>Поздравляем! Замок открыт!</p>
        <Button @click="nextLevel">Следующий уровень</Button>
      </div>
      <div v-if="isFail" class="fail-message flex flex-col items-center justify-center">
        <p>Ошибка! Попробуйте снова.</p>
        <Button @click="giveHint" class="mt-2">Подсказка</Button>
      </div>
    </div>

    <div v-if="isGameOver" class="game-over flex flex-col items-center justify-center">
      <h2>Игра завершена!</h2>
      <Button @click="resetGame">Начать заново</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '../../components/ui/Button.vue';

// Состояние игры
const level = ref(0); // Текущий уровень
const lockCode = ref(''); // Код замка для текущего уровня
const userInput = ref(''); // Ввод пользователя
const isSuccess = ref(false); // Статус успешного ввода
const isFail = ref(false); // Статус неудачного ввода
const isGameOver = ref(false); // Статус завершения игры

// Задания на уровнях
const levels = [
  {
    description: 'Отсортируйте массив чисел в порядке возрастания.',
    task: [5, 2, 8, 1, 4],
    solution: [1, 2, 4, 5, 8],
    validate: (input: string) => {
      // Преобразуем введенный код в массив и проверяем
      const sorted = input.split(',').map((num) => parseInt(num.trim(), 10));
      return JSON.stringify(sorted) === JSON.stringify([1, 2, 4, 5, 8]);
    },
  },
  {
    description: 'Найдите максимальное число в массиве.',
    task: [9, 3, 6, 12, 7],
    solution: 12,
    validate: (input: string) => parseInt(input.trim(), 10) === 12,
  },
];

const startGame = () => {
  level.value = 1;
  startLevel();
};

const startLevel = () => {
  isSuccess.value = false;
  isFail.value = false;
  userInput.value = '';
  lockCode.value = getLockCode(level.value);
};

const getLockCode = (levelNumber: number) => {
  if (levelNumber <= levels.length) {
    const levelData = levels[levelNumber - 1];
    return `Задача: ${levelData.description}`;
  }
  return '';
};

const checkCode = () => {
  const currentLevel = levels[level.value - 1];
  if (currentLevel.validate(userInput.value)) {
    isSuccess.value = true;
    isFail.value = false
  } else {
    isFail.value = true;
  }
};

const nextLevel = () => {
  if (level.value < levels.length) {
    level.value++;
    startLevel();
  } else {
    isGameOver.value = true;
  }
};

const resetGame = () => {
  level.value = 0;
  isGameOver.value = false;
  userInput.value = '';
};

const giveHint = () => {
  if (level.value === 1) {
    alert('Подсказка: Используйте метод sort() для сортировки массива.');
  } else if (level.value === 2) {
    alert('Подсказка: Используйте Math.max() для нахождения максимального значения в массиве.');
  }
};
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  color: #333;
}

.start-screen,
.game-screen,
.game-over {
  margin-top: 50px;
}

.input-container {
  margin-top: 20px;
}

textarea {
  padding: 10px;
  font-size: 16px;
  width: 300px;
  margin-right: 10px;
}

button {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #007bff;
  color: white;
}

.success-message {
  color: green;
}

.fail-message {
  color: red;
}

.lock {
  background-color: #f4f4f4;
  padding: 20px;
  border: 2px solid #ccc;
  display: inline-block;
  margin-top: 20px;
}

.game-over {
  color: red;
  font-size: 24px;
}
</style>
