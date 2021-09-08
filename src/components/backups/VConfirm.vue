<template>
  <div v-if="visible">
    <div class="confirm__background" @click="cancel" />
    <div class="centered transformed confirm shadow p-3">
      <span class="confirm__question mx-auto cursor-default">
        {{ question }}
      </span>
      <div>
        <input
          type="button"
          class="btn btn-primary confirm__proceed_button m-2"
          value="Yep!"
          @click="proceed"
        />
        <input
          type="button"
          class="btn btn-secondary confirm__cancel_button m-2"
          value="No"
          @click="cancel"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import This from "../utils/interfaces/this";
import { ref } from "@vue/reactivity";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "VConfirm",
  setup() {
    const visible = ref(false);
    const question = ref("");

    return {
      visible,
      question,
    };
  },

  methods: {
    show(this: This, message: string) {
      this.question = message;
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },

    proceed(this: This) {
      this.resolvePromise(true);
      this.hide();
    },

    cancel(this: This) {
      this.resolvePromise(false);
      this.hide();
    },

    hide() {
      this.visible = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.confirm {
  border-radius: 1rem;
  background-color: whitesmoke;
  border: 2px solid $global-color;
  width: fit-content;
  z-index: 100;
}

.confirm__question {
  font-size: 1.2rem;
  font-weight: bold;
}

.confirm__proceed_button:hover {
  background-color: $global-color;
  color: black;
}

.confirm__cancel_button:hover {
  background-color: $global-error;
  color: black;
}

.confirm__background {
  width: 100vw;
  height: 100vh;
  left: 0px;
  top: 0px;
  background-color: black;
  opacity: 0.4;
  position: fixed;
  z-index: 99;
}
</style>
