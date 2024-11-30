<script setup lang='ts'>
import Header from '../../components/Header.vue'

import { ref, onMounted } from 'vue';
import Agent from '../../games/Agent/Agent.vue';
import Pet from '../../games/Pet/Pet.vue';
import Testing from '../../games/Testing/Testing.vue';


const texts = ref<string[]>([
  'Frontend',
  'Backend',
  'Тестирование',
  'GameDev'
]);
const displayedText = ref('');
const cursorVisible = ref(true);
const index = ref(0);
const textIndex = ref(0);
const deleting = ref(false);

const typingSpeed = 150;
const deletingSpeed = 50;


const toggleCursor = () => {
  setInterval(() => {
    cursorVisible.value = !cursorVisible.value;
  }, 500);
};

const typeText = () => {
  setInterval(() => {
    const currentText = texts.value[textIndex.value];

    if (!deleting.value && index.value < currentText.length) {
      displayedText.value += currentText[index.value];
      index.value++;
    } else if (deleting.value && index.value > 0) {
      displayedText.value = displayedText.value.slice(0, -1);
      index.value--;
    } else if (index.value === 0) {
      deleting.value = false;
      textIndex.value = (textIndex.value + 1) % texts.value.length;
    } else if (index.value === currentText.length) {
      deleting.value = true;
    }
  }, deleting.value ? deletingSpeed : typingSpeed);
};

onMounted(() => {
  toggleCursor();
  typeText();
});
</script>
<template>
  <div class="">
    <Header />
    <div class="flex items-center justify-center flex-col mt-4">
      <div>
         <span class="text-[58px] font-semibold">{{ displayedText }}</span><span class="cursor text-[58px] font-semibold text-main-green" :class="{ blink: cursorVisible }">|</span>
      </div>
     
      <p class="text-[58px] font-semibold">с наставником в формате 1 на 1</p>
    </div>
    <!-- <Agent /> -->
     <!-- <Pet /> -->
      <!-- <Editor /> -->
       <Testing />
   
  </div>
</template>
<style lang='scss'>
    
</style>