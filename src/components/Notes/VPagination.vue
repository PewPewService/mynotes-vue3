<template>
  <div
    :id="'pagination' + Notes.name"
    :hidden="PagesCount(Notes.name) < 2"
    class="w-100 mx-auto mt-3 mb-3"
  >
    <button
      :disabled="CurrentPage(Notes.name) == 1"
      class="btn pagination__button ms-1 me-1"
      @click="goToPage(Notes.name)"
    >
      {{ Pagination.start }}
    </button>
    <button
      :disabled="CurrentPage(Notes.name) == 1"
      class="btn pagination__button ms-1 me-1"
      @click="adjustPage(Notes.name)"
    >
      {{ Pagination.prev }}
    </button>

    <button
      v-for="n in 5"
      :key="n"
      :disabled="n == 3"
      :hidden="
        n - 3 + CurrentPage(Notes.name) > PagesCount(Notes.name) ||
        n - 3 + CurrentPage(Notes.name) < 1
      "
      class="btn pagination__button ms-1 me-1"
      @click="goToPage(Notes.name, n - 3 + CurrentPage(Notes.name))"
    >
      {{ n - 3 + CurrentPage(Notes.name) }}
    </button>

    <button
      :disabled="CurrentPage(Notes.name) == PagesCount(Notes.name)"
      class="btn pagination__button ms-1 me-1"
      @click="adjustPage(Notes.name, 1)"
    >
      {{ Pagination.next }}
    </button>
    <button
      class="btn pagination__button ms-1 me-1"
      :disabled="CurrentPage(Notes.name) == PagesCount(Notes.name)"
      @click="goToPage(Notes.name, PagesCount(Notes.name))"
    >
      {{ Pagination.end }}
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { moduleName, getterTypes } from "../../store/modules/notes";

export default defineComponent({
  name: "VPagintaion",
  props: {
    Notes: Object,
  },

  setup() {
    const store = useStore();
    const PinnedNotesCaption = ref("PINNED_NOTES");
    const OtherNotesCaption = ref("NOTES");
    const Pagination = ref({
      start: "⟪",
      prev: "❰",
      next: "❱",
      end: "⟫",
    });
    const pinnedPagesCount = computed(
      () =>
        store.getters[`${moduleName}/${getterTypes.GETTER_PINNED_PAGES_COUNT}`]
    );
    const notesPagesCount = computed(
      () =>
        store.getters[`${moduleName}/${getterTypes.GETTER_OTHER_PAGES_COUNT}`]
    );

    return {
      PinnedNotesCaption,
      OtherNotesCaption,
      Pagination,
      pinnedPagesCount,
      notesPagesCount,
    };
  },

  methods: {
    PagesCount(name: string) {
      if (name == this.PinnedNotesCaption) return Number(this.pinnedPagesCount);
      if (name == this.OtherNotesCaption) return Number(this.notesPagesCount);
      return null;
    },

    CurrentPage(name: string) {
      let page;
      if (name == this.PinnedNotesCaption) page = this.$route.query.pinnedPage;
      if (name == this.OtherNotesCaption) page = this.$route.query.notesPage;
      return page ? Number(page) : 1;
    },

    async adjustPage(name: string, direction: number = -1) {
      let pinnedPage: number = this.$route.query.pinnedPage
        ? Number(this.$route.query.pinnedPage)
        : 1;
      let notesPage: number = this.$route.query.notesPage
        ? Number(this.$route.query.notesPage)
        : 1;
      let pinned;
      if (name == this.PinnedNotesCaption) {
        pinnedPage += direction;
        pinned = true;
      }
      if (name == this.OtherNotesCaption) {
        notesPage += direction;
        pinned = false;
      }
      this.$emit("PushToRouter", pinnedPage, notesPage);
      this.$emit("refresh", pinned);
      this.$emit("ScrollToTop", name);
    },

    async goToPage(name: string, page: number = 1) {
      let pinnedPage = this.$route.query.pinnedPage
        ? this.$route.query.pinnedPage
        : 1;
      let notesPage = this.$route.query.notesPage
        ? this.$route.query.notesPage
        : 1;
      let pinned;
      if (name == this.PinnedNotesCaption) {
        pinnedPage = page;
        pinned = true;
      }
      if (name == this.OtherNotesCaption) {
        notesPage = page;
        pinned = false;
      }
      this.$emit("PushToRouter", pinnedPage, notesPage);
      this.$emit("refresh", pinned);
      this.$emit("ScrollToTop", name);
    },
  },
});
</script>

<style lang="scss" scoped>
.pagination__button {
  @include basic-button();
  font-size: 1rem;
  background-color: $global-color;
  color: black;
  line-height: 1rem;
  &:hover {
    background-color: black;
    color: $global-color;
  }
}
</style>
