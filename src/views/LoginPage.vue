<template>
  <TheLoginPage />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import TheLoginPage from "../components/TheLoginPage.vue";
export default defineComponent({
  name: "LoginPage",
  components: {
    TheLoginPage,
  },
});
</script>
