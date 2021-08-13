<!-- eslint-disable prettier/prettier -->
<template>

<!-- <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div @change="test" class="modal-content">
      <div class="modal-body">
        Are you sure you want to delete this note?
      </div>
      <div class="modal-footer mx-auto">
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Yes!</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Nope</button>
      </div>
    </div>
  </div>
</div> -->


  <div>
    <transition
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
    >
      <div
        v-if="Animation"
        id="popup"
        :class="PopupClass"
      > {{Message}} </div>
    </transition>
    <VNotesList
      v-for="Notes in Notes"
      :key="Notes.name"
      :Notes="Notes"
      @PopUpMessage="PopUpMessage"
    />
    {{Success + Error}}
    <div
      v-if="!(NotesFound || Loading)"
      class="mt-3 mx-auto"
    > Wow, such empty </div>
    <div class="spinner-border text-primary" role="status" v-if="!(NotesFound || Loading)"/>
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */
import { mapGetters } from "vuex";
import { moduleName, getterTypes } from "../store/modules/notes";
import VNotesList from "./Notes/VNotesList.vue";

export default {
  name: 'TheHomePage',
  components:{
    VNotesList
  },
  data(){
    return {
      PinnedNotesCaption : "PINNED_NOTES",
      OtherNotesCaption : "NOTES",
      Animation: false,
      Message: '',
      PopupClass: '',
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

    Error(){
      return this[getterTypes.GETTER_NOTE_RESPONSE_ERROR];
    },
    Success(){
      return this[getterTypes.GETTER_NOTE_RESPONSE_SUCCESS];
    },

    Notes(){
      return [
        {
          name: this.PinnedNotesCaption,
          notes: this[getterTypes.GETTER_PINNED_NOTES]
        },
        {
          name: this.OtherNotesCaption,
          notes: this[getterTypes.GETTER_OTHER_NOTES]
        }
        ];
    },

    NotesFound(){
      if (+this[getterTypes.GETTER_PINNED_PAGES_COUNT] + +this[getterTypes.GETTER_OTHER_PAGES_COUNT]) return true
      else return false;
    },

    Loading(){
      return this[getterTypes.GETTER_LOADING];
    }
  },

  methods: {
    test(a){
      console.log(a);
    },
    PopUpMessage(){
      if (this.Error.data){
        this.Message = this.Error.data;
        this.PopupClass = 'input_error';
      } else {
        this.Message = this.Success.data;
        this.PopupClass = 'input_success';
      }
      this.Animation = true
      setTimeout(() => {
        this.Animation = false;
        this.Message = '';
      }, 2000);
    },
  },  
}
</script>

<style lang="scss" scoped>
#popup{
  width: fit-content;
  height: 2rem;
  line-height: 2rem;
  font-size: 1rem;
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: whitesmoke;
  border: 2px solid black;
  border-radius: 1rem;
  padding: 0 1rem 0 1rem;
  vertical-align: middle;
  z-index: 100;
}
</style>