<template>
  <TheHomePage />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import TheHomePage from "../components/TheHomePage.vue";
export default defineComponent({
  name: "HomePage",
  components: {
    TheHomePage,
  },
});
</script>
