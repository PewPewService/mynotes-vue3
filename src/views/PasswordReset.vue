<template>
  <ThePasswordResetPage />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ThePasswordResetPage from "../components/ThePasswordResetPage.vue";
export default defineComponent({
  name: "PasswordReset",
  components: {
    ThePasswordResetPage,
  },
});
</script>
