<template>
  <div>
    <transition
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
    >
      <div
        v-if="Animation"
        id="popup"
        :class="PopupClass"
      > {{ Message }} </div>
    </transition>
    <VNotesList
      v-for="Notes in Notes"
      :key="Notes.name"
      :Notes="Notes"
      @PopUpMessage="PopUpMessage"
      @Refresh="Refresh"
    />
    {{ Success + Error }}
    <div
      v-if="!(NotesFound || Loading)"
      class="centered transformed h5 fw-bold"
    > Wow, such empty </div>
    <div
      class="spinner-border text-primary centered"
      role="status"
      v-if="Loading"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { moduleName, actionTypes, getterTypes } from "../store/modules/notes";
import VNotesList from "./Notes/VNotesList.vue";

export default {
  name: "TheHomePage",
  
  watch: {
    $route: function (value, oldValue) {
      if (value.query.search !== oldValue.query.search) this.Refresh();
      else if (value.query.pinnedPage !== oldValue.query.pinnedPage) this.Refresh(true);
      else if (value.query.notesPage !== oldValue.query.notesPage) this.Refresh(false);
    }
  },

  components: {
    VNotesList,
  },

  data(){
    return {
      PinnedNotesCaption: "PINNED_NOTES",
      OtherNotesCaption: "NOTES",
      Animation: false,
      Message: "",
      PopupClass: "",
    }
  },
  computed: {
    ...mapGetters(moduleName, [
      getterTypes.GETTER_PINNED_NOTES,
      getterTypes.GETTER_OTHER_NOTES,
      getterTypes.GETTER_PINNED_PAGES_COUNT,
      getterTypes.GETTER_OTHER_PAGES_COUNT,
      getterTypes.GETTER_NOTE_RESPONSE_ERROR,
      getterTypes.GETTER_NOTE_RESPONSE_SUCCESS,
      getterTypes.GETTER_LOADING,
    ]),

    Error() {
      return this[getterTypes.GETTER_NOTE_RESPONSE_ERROR];
    },
    Success() {
      return this[getterTypes.GETTER_NOTE_RESPONSE_SUCCESS];
    },

    Notes() {
      return [
        {
          name: this.PinnedNotesCaption,
          notes: this[getterTypes.GETTER_PINNED_NOTES]
        },
        {
          name: this.OtherNotesCaption,
          notes: this[getterTypes.GETTER_OTHER_NOTES]
        },
      ];
    },

    NotesFound() {
      if (
        +this[getterTypes.GETTER_PINNED_PAGES_COUNT] +
        +this[getterTypes.GETTER_OTHER_PAGES_COUNT]
      )
        return true;
      else return false;
    },

    Loading() {
      return this[getterTypes.GETTER_LOADING];
    }
  },

  methods: {
    ...mapActions(moduleName, [actionTypes.ACTION_GET_NOTES]),

    PopUpMessage(){
      if (this.Error.data){
        this.Message = this.Error.data;
        this.PopupClass = "input_error";
      } else {
        this.Message = this.Success.data;
        this.PopupClass = "input_success";
      }
      this.Animation = true;
      setTimeout(() => {
        this.Animation = false;
        this.Message = "";
      }, 2000);
    },

    Refresh(pinned = null) {
      if (pinned !== null) this.GetNotes(pinned);
      else {
        this.GetNotes(true);
        this.GetNotes();
      }
    },

    GetNotes(pinned = false) {
      let page;
      if (pinned) page = this.$route.query.pinnedPage;
      else page = this.$route.query.notesPage;
      page = page ? page : 1;
      let searchQuery = this.$route.query.search;
      this[actionTypes.ACTION_GET_NOTES]({
        pinned: pinned,
        page: page - 1,
        queryString: searchQuery ? searchQuery : ""
      });
    },
  },

  created() {
    this.Refresh();
  },
};
</script>

<style lang="scss" scoped>
#popup {
  width: fit-content;
  height: 2rem;
  line-height: 2rem;
  font-size: 1rem;
  border: 2px solid black;
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1rem;
  padding: 0 1rem 0 1rem;
  vertical-align: middle;
  z-index: 100;
}
</style>
