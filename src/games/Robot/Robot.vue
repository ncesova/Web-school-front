<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-xl font-semibold mb-4">Роботы-кодеры</h1>

      <!-- Exercise Description -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <pre class="whitespace-pre-wrap text-lg font-medium text-gray-700">
Напиши программу, которая приведет робота(синий квадрат) в домик (зеленый квадрат)
Задай такое число для robot.x и robot.y, чтоб робот оказался в нужной точке</pre
        >
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
        <!-- Game Section -->
        <div class="space-y-4">
          <canvas
            ref="canvas"
            width="600"
            height="400"
            class="border border-gray-300 w-full" />

          <!-- Code Editor Section -->
          <div class="h-[400px] bg-[#1E1E1E]">
            <vue-monaco-editor
              v-model:value="code"
              language="javascript"
              theme="vs-dark"
              :options="{
                ...MONACO_EDITOR_OPTIONS,
                minimap: {enabled: false},
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                fontSize: 14,
              }"
              @mount="handleMount"
              class="h-full" />
          </div>

          <Button @click="runCode" v-if="!feedback" class="w-full">
            Запустить
          </Button>

          <div v-if="feedback" class="p-4 bg-white rounded-lg shadow">
            {{ feedback }}
          </div>
        </div>

        <!-- Leaderboard Section -->
        <div class="h-fit">
          <Leaderboard :gameId="GAME_ID" :classroomId="lessonId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, shallowRef} from "vue";
import {useRoute} from "vue-router";
import Button from "../../components/ui/Button.vue";
import Leaderboard from "../../components/Leaderboard.vue";
import {leaderboardService} from "../../services/leaderboard.service";

const route = useRoute();
const lessonId = route.params.id as string;
const GAME_ID = "robot"; // Unique identifier for this game

let canvas: HTMLCanvasElement;
const code = ref("");
const feedback = ref<string | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const robot = ref<{x: number; y: number; direction: string}>({
  x: 50,
  y: 50,
  direction: "right",
});
const goal = ref<{x: number; y: number}>({x: 550, y: 350});
const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};

const editorRef = shallowRef();
const handleMount = (editor: any) => (editorRef.value = editor);

const draw = () => {
  if (!ctx.value) return;

  ctx.value.clearRect(0, 0, canvas.width, canvas.height);

  ctx.value.beginPath();
  ctx.value.moveTo(30, 10);
  ctx.value.lineTo(30, 380);
  ctx.value.lineTo(590, 380);
  ctx.value.strokeStyle = "#000";
  ctx.value.stroke();

  // Числовые метки для осей X и Y
  for (let i = 0; i <= 30; i++) {
    ctx.value.fillText((i * 20).toString(), 30 + i * 20, 390);
    ctx.value.fillText((i * 20).toString(), 20, 380 - i * 20);
  }

  // Нарисовать робота
  ctx.value.fillStyle = "blue";
  ctx.value.fillRect(robot.value.x, robot.value.y, 20, 20);

  // Нарисовать цель
  ctx.value.fillStyle = "green";
  ctx.value.fillRect(goal.value.x, goal.value.y, 20, 20);
};

onMounted(() => {
  canvas = document.querySelector("canvas")!;
  ctx.value = canvas.getContext("2d");
  draw();
});

const calculateScore = (moves: number): number => {
  // Score calculation based on number of moves and accuracy
  const distance = Math.sqrt(
    Math.pow(robot.value.x - goal.value.x, 2) +
      Math.pow(robot.value.y - goal.value.y, 2)
  );
  const baseScore = 1000;
  const movePenalty = moves * 10;
  const distancePenalty = distance * 0.5;

  return Math.max(0, Math.round(baseScore - movePenalty - distancePenalty));
};

const runCode = async () => {
  feedback.value = null;
  try {
    const moves = code.value.split("\n").filter((line) => line.trim()).length;
    const userCode = new Function("robot", code.value);
    userCode(robot.value);
    draw();

    if (robot.value.x === goal.value.x && robot.value.y === goal.value.y) {
      const score = calculateScore(moves);
      feedback.value = `Задача выполнена! Ваш счет: ${score}`;

      // Submit score to leaderboard with authorization token
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/leaderboard`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            gameId: GAME_ID,
            value: score,
          }),
        });
        console.log("Score submitted successfully");
      } catch (err) {
        console.error("Failed to submit score:", err);
      }
    }
  } catch (error) {
    feedback.value = "Ошибка в коде! Проверьте синтаксис.";
  }
};
</script>

<style scoped>
.bg-main-green {
  background-color: #4caf50;
}

:deep(.monaco-editor) {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
