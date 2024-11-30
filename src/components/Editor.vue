<template>
  <div class="h-[400px] p-4 bg-[#1E1E1E] w-[60vw]">
    <vue-monaco-editor
      v-model:value="code"
      language="python"
      theme="vs-dark"
      :options="MONACO_EDITOR_OPTIONS"
      @mount="handleMount" />
  </div>
</template>

<script lang="ts" setup>
import {ref, shallowRef} from "vue";
import * as monaco from "monaco-editor";

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};

const code = ref("// some code...");
const editorRef = shallowRef();
const handleMount = (editor: monaco.editor.IStandaloneCodeEditor) =>
  (editorRef.value = editor);

// your action
// @ts-ignore
function formatCode() {
  editorRef.value?.getAction("editor.action.formatDocument").run();
}
</script>
