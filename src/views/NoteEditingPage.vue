<template>
  <TheNoteEditingPage />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import TheNoteEditingPage from "../components/TheNoteEditingPage.vue";
export default defineComponent({
  name: "NoteEditingPage",
  components: {
    TheNoteEditingPage,
  },
});
</script>
