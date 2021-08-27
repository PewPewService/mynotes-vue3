<template>
  <div
    v-if="Images && Images.length > 0"
    :id="'carousel' + Id"
    class="w-100 mx-auto carousel"
    data-bs-ride="carousel"
    data-bs-interval="false"
  >
    <div class="carousel-inner">
      <div
        v-for="(image, index) in Images"
        :key="index"
        :class="'carousel-item' + (index == displayedImage ? ' active' : '')"
        data-bs-interval="false"
      >
        <img
          :src="ImageConnectionString(image)"
          class="d-block carousel-slide"
        />
        <input
          v-if="Delete"
          type="button"
          class="btn delete-image-button"
          @click="DeleteImage(index)"
        />
      </div>
    </div>

    <button
      v-if="Images.length > 1"
      class="carousel-control-prev"
      type="button"
      @click="NextSlide"
    >
      <span class="carousel-control-prev-icon" />
    </button>
    <button
      v-if="Images.length > 1"
      class="carousel-control-next"
      type="button"
      @click="PrevSlide"
    >
      <span class="carousel-control-next-icon" />
    </button>

    <VConfirm ref="popup" />
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import This from "../utils/interfaces/this";
import { computed, defineComponent, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { getterTypes, moduleName } from "../store/modules/notes";
import VConfirm from "./VConfirm.vue";

export default defineComponent({
  name: "VImageCarousel",

  components: {
    VConfirm,
  },

  props: {
    id: Number,
    Images: Array,
    DeletedImages: Array,
    Delete: Boolean,
  },

  setup() {
    const store = useStore();
    const displayedImage = ref(0);
    const ConnectionString = computed(
      () =>
        store.getters[`${moduleName}/${getterTypes.GETTER_CONNECTION_STRING}`]
    );
    return {
      displayedImage,
      ConnectionString,
    };
  },

  methods: {
    ImageConnectionString(image: string) {
      return this.ConnectionString + image;
    },

    async DeleteImage(this: This, index: number) {
      let confirmation = await this.$refs.popup.show(
        "Are you sure you want to delete this image?"
      );
      if (confirmation) {
        this.$emit("DeleteImage", index);
        if (this.displayedImage >= this.Images.length - 1) {
          this.displayedImage = this.Images.length - 1;
        }
      }
    },

    NextSlide(this: This) {
      if (this.displayedImage >= this.Images.length - 1) {
        this.displayedImage = 0;
      } else {
        this.displayedImage += 1;
      }
    },

    PrevSlide(this: This) {
      if (this.displayedImage <= 0) {
        this.displayedImage = this.Images.length - 1;
      } else {
        this.displayedImage -= 1;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.delete-image-button {
  @include basic-button();
  background-image: url($delete_icon);
  background-color: $global-error;
  transform: translate(-50%, -50%);
  left: 50%;
  position: absolute !important;
  bottom: 1rem;
}
.carousel,
.slide,
.carousel-item {
  height: 20rem !important;
}
</style>
