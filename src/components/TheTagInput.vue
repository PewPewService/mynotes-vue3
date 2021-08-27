<template>
  <div class="w-100 tag-input">
    <input
      type="text"
      placeholder="Enter a tag"
      class="form-control tag-input__input"
      @keydown.space="addTag"
      @keydown.enter="addTag"
      @keydown.delete="popTag"
    />
    <div v-for="(tag, index) in Tags" :key="index" class="tag-input__tag">
      <span @click="deleteTag(index)" class="cursor-pointer">x</span>
      {{ tag }}
    </div>
  </div>
</template>

<script lang="ts">
import This from "../utils/interfaces/this";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "TheTagInput",
  props: {
    Tags: Array,
  },

  methods: {
    addTag(this: This, event: Record<string, any>) {
      event.preventDefault();
      let tag = event.target.value.trim();
      if (tag && this.Tags.indexOf(tag) == -1) {
        let tags = this.Tags;
        tags.push(tag);
        this.$emit("UpdateTags", tags);
        event.target.value = "";
      }
    },

    deleteTag(index: number) {
      let tags: any = this.Tags;
      tags.splice(index, 1);
      this.$emit("UpdateTags", tags);
    },

    popTag(this: This, event: Record<string, any>) {
      let tag = event.target.value.trim();
      if (!tag && this.Tags.length) {
        event.preventDefault();
        let tags = this.Tags;
        tags.pop();
        this.$emit("UpdateTags", tags);
      }
    },
  },
});
</script>

<style scoped>
.tag-input__tag {
  height: 30px;
  float: left;
  margin-right: 10px;
  background-color: #eee;
  margin-top: 10px;
  line-height: 30px;
  padding: 0 5px;
  border-radius: 5px;
}

.tag-input__tag > span {
  opacity: 0.75;
}
</style>
