<template>
  <div :hidden="!Notes.notes.length" :ref="Notes.name">
    <span class="mt-3 mb-3 mx-auto bold h2">
      {{ Notes.name.replace("_", " ") }}
    </span>

    <div class="row row-cols-1 row-cols-md-2 g-4">
      <VNoteCard
        v-for="Note in Notes.notes"
        :key="Note.id"
        :Note="Note"
        @PopUpMessage="$emit('PopUpMessage')"
        @Refresh="$emit('Refresh')"
        @CheckEmptyPage="CheckEmptyPage"
      />
    </div>

    <VPagination
      :Notes="Notes"
      @ScrollToTop="ScrollToTop"
      @Refresh="$emit('Refresh')"
      @PushToRouter="PushToRouter"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  moduleName,
  getterTypes,
  actionTypes,
} from "../../store/modules/notes";
import VNoteCard from "./VNoteCard.vue";
import VPagination from "./VPagination.vue";

export default {
  name: "VNotesList",
  props: {
    Notes: Object,
  },
  components: {
    VNoteCard,
    VPagination,
  },
  data() {
    return {
      PinnedNotesCaption: "PINNED_NOTES",
      OtherNotesCaption: "NOTES",
    };
  },
  computed: {
    ...mapGetters(moduleName, [
      getterTypes.GETTER_PINNED_NOTES,
      getterTypes.GETTER_OTHER_NOTES,
      getterTypes.GETTER_PINNED_PAGES_COUNT,
      getterTypes.GETTER_OTHER_PAGES_COUNT,
      getterTypes.GETTER_NOTE_RESPONSE_ERROR,
      getterTypes.GETTER_NOTE_RESPONSE_SUCCESS,
    ]),

    Error() {
      return this[getterTypes.GETTER_NOTE_RESPONSE_ERROR];
    },
    Success() {
      return this[getterTypes.GETTER_NOTE_RESPONSE_SUCCESS];
    },

    NotesFound() {
      if (
        +this[getterTypes.GETTER_PINNED_PAGES_COUNT] +
        +this[getterTypes.GETTER_OTHER_PAGES_COUNT]
      )
        return true;
      else return false;
    },
  },

  methods: {
    ...mapActions(moduleName, [
      actionTypes.ACTION_PIN_NOTE,
      actionTypes.ACTION_COPY_NOTE,
      actionTypes.ACTION_DELETE_NOTE,
    ]),

    CurrentPage(name) {
      let page;
      if (name == this.PinnedNotesCaption) page = this.$route.query.pinnedPage;
      if (name == this.OtherNotesCaption) page = this.$route.query.notesPage;
      return page ? Number(page) : 1;
    },

    PushToRouter(pinnedPage, notesPage) {
      let query = {};
      let search = this.$route.query.search;
      let name = this.$route.name;
      if (search) query.search = search;
      if (pinnedPage - 1) query.pinnedPage = pinnedPage;
      if (notesPage - 1) query.notesPage = notesPage;
      this.$router.push({ name: name, query: query });
    },

    CheckEmptyPage() {
      if (
        this.Notes.notes.length == 1 &&
        this.CurrentPage(this.Notes.name) > 1
      ) {
        let pinnedPage = this.CurrentPage(this.PinnedNotesCaption);
        let notesPage = this.CurrentPage(this.OtherNotesCaption);
        if (this.Notes.name == this.PinnedNotesCaption) pinnedPage -= 1;
        else notesPage -= 1;
        this.PushToRouter(pinnedPage, notesPage);
      }
      this.$emit("Refresh");
    },

    ScrollToTop(name) {
      this.$refs[`${name}`].scrollIntoView();
      const rem = getComputedStyle(document.documentElement).fontSize;
      window.scrollBy(0, -(2 * rem.substring(0, rem.length - 2) + 60));
    },
  },
};
</script>
