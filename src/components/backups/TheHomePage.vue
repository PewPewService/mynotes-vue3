<template>
  <div>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <div v-if="Animation" id="popup" :class="PopupClass">{{ Message }}</div>
    </transition>
    <VNotesList
      v-for="NotesList in Notes"
      :key="NotesList.name"
      :Notes="NotesList"
      @PopUpMessage="PopUpMessage"
      @Refresh="Update"
    />
    {{ Success + Error }}
    <div
      v-if="!(NotesFound || Loading)"
      class="centered transformed h5 fw-bold cursor-default"
    >
      Wow, such empty
    </div>
    <div
      class="spinner-border text-primary centered"
      role="status"
      v-if="Loading"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import This from "../utils/interfaces/this";
import { getCookie } from "../utils/cookie control/cookie";
import { computed, defineComponent, ref } from "@vue/runtime-core";
import { mapActions, useStore } from "vuex";
import { moduleName, actionTypes, getterTypes } from "../store/modules/notes";
import VNotesList from "./Notes/VNotesList.vue";

export default defineComponent({
  name: "TheHomePage",

  watch: {
    $route: function (this: This, value, oldValue) {
      if (value.query.search !== oldValue.query.search) this.Refresh();
      else {
        if (value.query.pinnedPage !== oldValue.query.pinnedPage)
          this.Refresh(true);
        if (value.query.notesPage !== oldValue.query.notesPage)
          this.Refresh(false);
      }
    },
  },

  components: {
    VNotesList,
  },

  setup() {
    const store = useStore();
    const PinnedNotesCaption = "PINNED_NOTES";
    const OtherNotesCaption = "NOTES";
    const Animation = ref(false);
    const Message = ref("");
    const PopupClass = ref("");
    let WebSocketConnection;

    const Error = computed(
      () =>
        store.getters[`${moduleName}/${getterTypes.GETTER_NOTE_RESPONSE_ERROR}`]
    );
    const Success = computed(
      () =>
        store.getters[
          `${moduleName}/${getterTypes.GETTER_NOTE_RESPONSE_SUCCESS}`
        ]
    );
    const Notes = computed(() => [
      {
        name: PinnedNotesCaption,
        notes:
          store.getters[`${moduleName}/${getterTypes.GETTER_PINNED_NOTES}`],
      },
      {
        name: OtherNotesCaption,
        notes: store.getters[`${moduleName}/${getterTypes.GETTER_OTHER_NOTES}`],
      },
    ]);
    const NotesFound = computed(() => {
      if (
        +store.getters[
          `${moduleName}/${getterTypes.GETTER_PINNED_PAGES_COUNT}`
        ] +
        +(+store.getters[
          `${moduleName}/${getterTypes.GETTER_OTHER_PAGES_COUNT}`
        ])
      )
        return true;
      else return false;
    });

    const Loading = computed(
      () => store.getters[`${moduleName}/${getterTypes.GETTER_LOADING}`]
    );

    return {
      PinnedNotesCaption,
      OtherNotesCaption,
      Animation,
      Message,
      PopupClass,
      WebSocketConnection,
      Error,
      Success,
      Notes,
      NotesFound,
      Loading,
    };
  },

  methods: {
    ...mapActions(moduleName, [actionTypes.ACTION_GET_NOTES]),

    PopUpMessage() {
      if (this.Error.data) {
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

    Refresh(this: This, pinned: boolean | null = null) {
      if (pinned !== null) this.GetNotes(pinned);
      else {
        this.GetNotes(true);
        this.GetNotes();
      }
    },

    GetNotes(this: This, pinned: boolean = false) {
      let page;
      if (pinned) page = this.$route.query.pinnedPage;
      else page = this.$route.query.notesPage;
      page = page ? page : 1;
      let searchQuery = this.$route.query.search;
      this[actionTypes.ACTION_GET_NOTES]({
        pinned: pinned,
        page: page - 1,
        queryString: searchQuery ? searchQuery : "",
      });
    },

    SetWebSocket(this: This) {
      this.WebSocketConnection = new WebSocket(process.env.VUE_APP_WEBSOCKET);
      let refreshFunc = this.Refresh;
      this.WebSocketConnection.onmessage = function (
        event: Record<string, unknown>,
        refresh: Function = refreshFunc
      ) {
        if (event.data == "refresh") {
          refresh();
        }
      };

      this.WebSocketConnection.onopen = function () {
        const user = {
          type: "identify",
          user: getCookie("myNotesUser"),
        };
        this.send(JSON.stringify(user));
      };
    },

    Update() {
      this.SendRefresh();
      this.Refresh();
    },

    SendRefresh(this: This) {
      const message = {
        type: "command",
        command: "refresh",
      };
      this.WebSocketConnection.send(JSON.stringify(message));
    },

    CloseWebSocket(this: This) {
      if (this.WebSocketConnection != undefined)
        this.WebSocketConnection.close();
    },
  },

  created() {
    let jwt = getCookie("myNotesJWT");
    if (jwt == undefined || jwt == "") this.$router.push({ name: "Login" });
    else {
      this.SetWebSocket();
      this.Refresh();
    }
  },

  beforeUnmount() {
    this.CloseWebSocket();
  },
});
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
