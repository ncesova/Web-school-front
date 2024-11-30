<template>
  <div id="app">
    <h1 class="text-xl font-semibold">Роботы-кодеры</h1>
    <p>Программируйте робота для выполнения миссий!</p>
    <pre class="my-3 text-center">Напиши программу, которая приведет робота(синий квадрат) в домик (зеленый квадрат)
       Задай такое число для robot.x и robot.y, чтоб робот оказался в нужной точке</pre>
    <div class="flex items-end justify-end flex-col px-4">
      <div class="flex items-center gap-3">
        <canvas ref="canvas" width="600" height="400" />
        <div class="controls">
          <div class="h-[400px] p-4 bg-[#1E1E1E] w-[50vw]">
            <vue-monaco-editor v-model:value="code" language="javascript" theme="vs-dark"
              :options="MONACO_EDITOR_OPTIONS" @mount="handleMount" />
          </div>

        </div>
      </div>
      <Button @click="runCode" class="w-full" v-if="!feedback">Запустить</Button>
    </div>
    <div class="feedback" v-if="feedback">{{ feedback }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, shallowRef } from 'vue';
import Button from '../../components/ui/Button.vue';

let canvas: HTMLCanvasElement;
const code = ref('');
const feedback = ref<string | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const robot = ref<{ x: number; y: number; direction: string }>({ x: 50, y: 50, direction: 'right' });
const goal = ref<{ x: number; y: number }>({ x: 550, y: 350 });
const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
}

const editorRef = shallowRef()
//@ts-ignore
const handleMount = editor => (editorRef.value = editor)
const draw = () => {
  if (!ctx.value) return;

  ctx.value.clearRect(0, 0, canvas.width, canvas.height);

  ctx.value.beginPath();
  ctx.value.moveTo(30, 10);
  ctx.value.lineTo(30, 380);
  ctx.value.lineTo(590, 380);
  ctx.value.strokeStyle = '#000';
  ctx.value.stroke();

  // Числовые метки для осей X и Y
  for (let i = 0; i <= 30; i++) {
    ctx.value.fillText(i * 20, 30 + i * 20, 390);
    ctx.value.fillText(i * 20, 20, 380 - i * 20);
  }

  // Нарисовать робота
  ctx.value.fillStyle = 'blue';
  ctx.value.fillRect(robot.value.x, robot.value.y, 20, 20);

  // Нарисовать цель
  ctx.value.fillStyle = 'green';
  ctx.value.fillRect(goal.value.x, goal.value.y, 20, 20);
};

onMounted(() => {
  canvas = document.querySelector('canvas')!;
  ctx.value = canvas.getContext('2d');
  draw();
});

const runCode = () => {
  feedback.value = null; // сбросить обратную связь
  try {
    // Преобразуем введенный код в функцию и выполняем
    const userCode = new Function('robot', `
      ${code.value}
    `);

    // Запуск пользовательского кода
    userCode(robot.value);
    draw();

    // Проверка на выполнение миссии
    if (robot.value.x === goal.value.x && robot.value.y === goal.value.y) {
      feedback.value = 'Задача выполнена! Робот достиг цели.';
    }
  } catch (error) {
    feedback.value = 'Ошибка в коде! Проверьте синтаксис.';
  }
};
</script>

<style scoped>
#app {
  text-align: center;
}

canvas {
  border: 1px solid black;
  margin-bottom: 20px;
}

.controls {
  margin-bottom: 20px;
}

textarea {
  width: 80%;
  height: 100px;
  font-family: monospace;
}

button {
  padding: 10px 20px;
  font-size: 16px;
}

.feedback {
  margin-top: 20px;
  font-weight: bold;
}
</style>
