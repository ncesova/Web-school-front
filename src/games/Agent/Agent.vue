<template>
  <div class="game-container flex items-center justify-center flex-col" v-if="currentLevel">
    <h1 class="mt-3 text-xl font-semibold">Агент-Кодер: Уровень {{ currentLevel.id }}</h1>
    <p class="my-3">{{ currentLevel.description }}</p>

    <div class="h-[400px] p-4 bg-[#1E1E1E] w-[60vw]">
      <vue-monaco-editor
      v-model:value="userCode"
      language="javascript"
      theme="vs-dark"
      :options="MONACO_EDITOR_OPTIONS"
      @mount="handleMount"
    />
    </div>

    <button @click="executeCode">
      Запустить код
    </button>

    <div v-if="output !== null" class="results">
      <p v-if="error">{{ output }}</p>
      <p v-else>Результат: {{ output }}</p>
    </div>

    <button v-if="!error && hasNextLevel" @click="nextLevel">
      Следующий уровень
    </button>
  </div>

  <div v-else>
    <p>Загрузка уровня...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue';
import levelsData from './levels.json';

const levels = ref(levelsData);
const currentLevelIndex = ref(0);
const userCode = ref('');
const output = ref<string | null>(null);
const error = ref(false);

const currentLevel = computed(() => levels.value[currentLevelIndex.value] || null);

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
}

const editorRef = shallowRef()
//@ts-ignore
const handleMount = editor => (editorRef.value = editor)

const loadLevel = () => {
  userCode.value = currentLevel.value?.functionTemplate || '';
  output.value = null;
  error.value = false;
};

onMounted(() => {
  loadLevel();
});

const executeCode = () => {
  if (!currentLevel.value) return;

  const { testCases, functionTemplate } = currentLevel.value;

  try {
    //@ts-ignore
    const functionName = functionTemplate.match(/function (\w+)\(/)[1];

    const fullCode = `${userCode.value}; return ${functionName};`;
    const userFunction = new Function(fullCode)();

    const testCase = testCases[0];
    const result = userFunction(...testCase.input);

    output.value = `Ожидается: ${testCase.expected}, Получено: ${result}`;
    error.value = result !== testCase.expected;
  } catch (err) {
    output.value = 'Ошибка в коде! Проверьте синтаксис.';
    error.value = true;
  }
};


const hasNextLevel = computed(() => currentLevelIndex.value < levels.value.length - 1);

const nextLevel = () => {
  currentLevelIndex.value++;
  loadLevel();
};
</script>

<style scoped>
.game-container {
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
}

.code-editor {
  width: 80%;
  height: 150px;
  margin: 20px auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  display: block;
}

button {
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 18px;
  cursor: pointer;
}

.results {
  margin-top: 20px;
  font-weight: bold;
}
</style>
