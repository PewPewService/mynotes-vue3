import api from "./api";
import { getCookie, delCookie } from "../../utils/cookie control/cookie.js";
const NotesApi = process.env.VUE_APP_NOTES;
export const moduleName = "notesModule";

api.interceptors.request.use(
  (config) => {
    if (Object.getPrototypeOf(new FormData()) === Object.getPrototypeOf(config.data)) {
      config.data.append("jwt", getCookie("myNotesJWT"));
    } else config.data.jwt = getCookie("myNotesJWT");
    return config;
  },
  (error) => Promise.reject(error)
);

export const actionTypes = {
  ACTION_PIN_NOTE: "ACTION_PIN_NOTE",
  ACTION_COPY_NOTE: "ACTION_COPY_NOTE",
  ACTION_ADD_NOTE: "ACTION_ADD_NOTE",
  ACTION_EDIT_NOTE: "ACTION_EDIT_NOTE",
  ACTION_DELETE_NOTE: "ACTION_DELETE_NOTE",
  ACTION_GET_NOTES: "ACTION_GET_NOTES",
  ACTION_GET_NOTE: "ACTION_GET_NOTE",
  ACTION_CLEAR_NOTE: "ACTION_CLEAR_NOTE",
};

export const getterTypes = {
  GETTER_EDITING_NOTE: "GETTER_EDITING_NOTE",
  GETTER_NOTE_RESPONSE_ERROR: "GETTER_NOTE_RESPONSE_ERROR",
  GETTER_NOTE_RESPONSE_SUCCESS: "GETTER_NOTE_RESPONSE_SUCCESS",
  GETTER_PINNED_NOTES: "GETTER_PINNED_NOTES",
  GETTER_OTHER_NOTES: "GETTER_OTHER_NOTES",
  GETTER_PINNED_PAGES_COUNT: "GETTER_PINNED_PAGES_COUNT",
  GETTER_OTHER_PAGES_COUNT: "GETTER_OTHER_PAGES_COUNT",
  GETTER_CONNECTION_STRING: "GETTER_CONNECTION_STRING",
  GETTER_LOADING: "GETTER_LOADING",
};

export const mutationTypes = {
  MUTATION_NOTE_RESPONSE_ERROR: "MUTATION_NOTE_RESPONSE_ERROR",
  MUTATION_NOTE_RESPONSE_SUCCESS: "MUTATION_NOTE_RESPONSE_SUCCESS",
  MUTATION_FOUND_NOTE: "MUTATION_FIND_NOTE",
  MUTATION_SET_PINNED_NOTES: "MUTATION_SET_PINNED_NOTES",
  MUTATION_SET_OTHER_NOTES: "MUTATION_SET_OTHER_NOTES",
  MUTATION_CLEAR_NOTE: "MUTATION_CLEAR_NOTE",
  MUTATION_CLEAR_RESPONSE: "MUTATION_CLEAR_RESPONSE",
  MUTATION_SET_LOADING: "MUTATION_SET_LOADING",
  MUTATION_LOGOUT: "MUTATION_LOGOUT",
};

export default {
  moduleName,

  namespaced: true,

  state: () => ({
    editing_note: {},
    pinned_notes: [],
    other_notes: [],
    response_error: "",
    response_success: "",
    pinned_pages: 0,
    other_pages: 0,
    loading: true,
  }),

  actions: {
    async [actionTypes.ACTION_ADD_NOTE]({ commit }, note) {
      commit(mutationTypes.MUTATION_CLEAR_RESPONSE);
      try {
        note.append("action", "createNote");
        const response = await api.post(NotesApi + "createNote", note);
        commit(mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS, response);
      } catch (err) {
        if (err.response.status == 400) commit(mutationTypes.MUTATION_LOGOUT);
        else commit(mutationTypes.MUTATION_NOTE_RESPONSE_ERROR, err);
      }
    },

    async [actionTypes.ACTION_PIN_NOTE]({ commit }, noteId) {
      commit(mutationTypes.MUTATION_CLEAR_RESPONSE);
      try {
        const response = await api.post(NotesApi + "pinNote/" + noteId, {});
        commit(mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS, response);
      } catch (err) {
        if (err.response.status == 400) commit(mutationTypes.MUTATION_LOGOUT);
        else commit(mutationTypes.MUTATION_NOTE_RESPONSE_ERROR, err);
      }
    },

    async [actionTypes.ACTION_COPY_NOTE]({ commit }, noteId) {
      commit(mutationTypes.MUTATION_CLEAR_RESPONSE);
      try {
        const response = await api.post(NotesApi + "duplicateNote/" + noteId, {});
        commit(mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS, response);
      } catch (err) {
        if (err.response.status == 400) commit(mutationTypes.MUTATION_LOGOUT);
        else commit(mutationTypes.MUTATION_NOTE_RESPONSE_ERROR, err);
      }
    },

    async [actionTypes.ACTION_DELETE_NOTE]({ commit }, noteId) {
      commit(mutationTypes.MUTATION_CLEAR_RESPONSE);
      try {
        const response = await api.post(NotesApi + "deleteNote/" + noteId, {});
        commit(mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS, response);
      } catch (err) {
        if (err.response.status == 400) commit(mutationTypes.MUTATION_LOGOUT);
        else commit(mutationTypes.MUTATION_NOTE_RESPONSE_ERROR, err);
      }
    },

    async [actionTypes.ACTION_GET_NOTE]({ commit }, noteId) {
      commit(mutationTypes.MUTATION_CLEAR_RESPONSE);
      try {
        if (noteId) {
          const response = await api.post(NotesApi + "getNote/" + noteId, {});
          commit(mutationTypes.MUTATION_FOUND_NOTE, response.data);
        } else commit(mutationTypes.MUTATION_CLEAR_NOTE);
      } catch (err) {
        if (err.response.status == 400) commit(mutationTypes.MUTATION_LOGOUT);
        else {
          commit(mutationTypes.MUTATION_NOTE_RESPONSE_ERROR, err);
          commit(mutationTypes.MUTATION_CLEAR_NOTE);
        }
      }
    },

    async [actionTypes.ACTION_EDIT_NOTE]({ commit }, note) {
      commit(mutationTypes.MUTATION_CLEAR_RESPONSE);
      try {
        note.append("action", "createNote");
        const response = await api.post(NotesApi + "editNote", note);
        commit(mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS, response);
      } catch (err) {
        if (err.response.status == 400) commit(mutationTypes.MUTATION_LOGOUT);
        else commit(mutationTypes.MUTATION_NOTE_RESPONSE_ERROR, err);
      }
    },

    async [actionTypes.ACTION_GET_NOTES]({ commit }, data) {
      commit(mutationTypes.MUTATION_SET_LOADING, true);
      commit(mutationTypes.MUTATION_CLEAR_RESPONSE);
      try {
        const notes = await api.post(NotesApi + "getNotes/", {
          queryString: data.queryString,
          pinned: data.pinned,
          page: data.page,
        });
        if (data.pinned) commit(mutationTypes.MUTATION_SET_PINNED_NOTES, notes.data);
        else commit(mutationTypes.MUTATION_SET_OTHER_NOTES, notes.data);
      } catch (err) {
        if (err.response.status == 400) commit(mutationTypes.MUTATION_LOGOUT);
      } finally {
        commit(mutationTypes.MUTATION_SET_LOADING, false);
      }
    },

    [actionTypes.ACTION_CLEAR_NOTE]({ commit }) {
      commit(mutationTypes.MUTATION_CLEAR_RESPONSE);
      commit(mutationTypes.MUTATION_CLEAR_NOTE);
    },
  },

  mutations: {
    [mutationTypes.MUTATION_NOTE_RESPONSE_ERROR](state, err) {
      state.response_success = "";
      state.response_error = err;
    },

    [mutationTypes.MUTATION_NOTE_RESPONSE_SUCCESS](state, response) {
      state.response_error = "";
      state.response_success = response;
    },

    [mutationTypes.MUTATION_FOUND_NOTE](state, note) {
      if (note.tags === null) note.tags = [];
      state.editing_note = note;
    },

    [mutationTypes.MUTATION_SET_PINNED_NOTES](state, notes) {
      state.pinned_notes = notes[0];
      state.pinned_pages = notes[1];
    },

    [mutationTypes.MUTATION_SET_OTHER_NOTES](state, notes) {
      state.other_notes = notes[0];
      state.other_pages = notes[1];
    },

    [mutationTypes.MUTATION_CLEAR_NOTE](state) {
      const cleanNote = {
        id: "",
        name: "",
        text: "",
        tags: [],
        images: [],
        pinned: false,
      };
      state.editing_note = cleanNote;
    },

    [mutationTypes.MUTATION_CLEAR_RESPONSE](state) {
      state.response_error = "";
      state.response_success = "";
    },

    [mutationTypes.MUTATION_SET_LOADING](state, condition) {
      state.loading = condition;
    },

    [mutationTypes.MUTATION_LOGOUT]() {
      console.log("Invalid token! Logging out");
      delCookie("myNotesJWT");
      delCookie("myNotesUser");
      document.location.reload();
    }
  },

  getters: {
    [getterTypes.GETTER_EDITING_NOTE]: (state) => state.editing_note,
    [getterTypes.GETTER_NOTE_RESPONSE_ERROR]: (state) => state.response_error,
    [getterTypes.GETTER_NOTE_RESPONSE_SUCCESS]: (state) => state.response_success,
    [getterTypes.GETTER_PINNED_NOTES]: (state) => state.pinned_notes,
    [getterTypes.GETTER_OTHER_NOTES]: (state) => state.other_notes,
    [getterTypes.GETTER_PINNED_PAGES_COUNT]: (state) => state.pinned_pages,
    [getterTypes.GETTER_OTHER_PAGES_COUNT]: (state) => state.other_pages,
    [getterTypes.GETTER_CONNECTION_STRING]: () => process.env.VUE_APP_CONNECTIONSTRING,
    [getterTypes.GETTER_LOADING]: (state) => state.loading,
  },
};
