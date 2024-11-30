import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'

import { routes } from "./pages";
import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes,
});


createApp(App).use(router).use(VueMonacoEditorPlugin, {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
  },
}).mount('#app')
