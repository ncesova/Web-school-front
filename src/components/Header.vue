<script setup lang='ts'>
import Button from './ui/Button.vue'
</script>
<template>
  <div class="px-5 py-2 border-b">
    <div class="flex items-center justify-between">
      <RouterLink to="/">
        <h1 class="tracking-widest text-[30px] font-semibold">CodeCouch</h1>
      </RouterLink>
      <div>
        <ul class="flex items-center gap-5">
          <li class="cursor-pointer">Стать наставником</li>
          <li class="cursor-pointer">Вход для ученика</li>
          <li class="cursor-pointer">Вход для ментора</li>
          <li><Button>Подобрать ментора</Button></li>
        </ul>
      </div>
    </div>
  </div>
</template>