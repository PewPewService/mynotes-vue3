import api from "./api";
import {
  setCookie,
  delCookie,
  getCookie,
} from "../../utils/cookie control/cookie";
import { Commit } from "vuex";
const AuthApi: string = process.env.VUE_APP_USERS;
export const moduleName: string = "authModule";

export const actionTypes: Record<string, string> = {
  ACTION_REGISTER: "ACTION_REGISTER",
  ACTION_LOGIN: "ACTION_LOGIN",
  ACTION_LOGOUT: "ACTION_LOGOUT",
  ACTION_CHECK_COOKIE: "ACTION_CHECK_COOKIE",
  ACTION_CLEAR_RESPONSES: "ACTION_CLEAR_RESPONSES",
  ACTION_SET_LOADING: "ACTION_SET_LOADING",
  ACTION_SEND_EMAIL: "ACTION_SEND_EMAIL",
  ACTION_CHANGE_PASSWORD: "ACTION_CHANGE_PASSWORD",
};

export const getterTypes: Record<string, string> = {
  GETTER_AUTH_SUCCESS: "GETTER_AUTH_SUCCESS",
  GETTER_AUTH_ERROR: "GETTER_AUTH_ERROR",
  GETTER_JWT: "GETTER_JWT",
  GETTER_USER: "GETTER_USER",
  GETTER_LOADING: "GETTER_LOADING",
};

export const mutationTypes: Record<string, string> = {
  MUTATION_RESPONSE_ERROR: "MUTATION_RESPONSE_ERROR",
  MUTATION_RESPONSE_SUCCESS: "MUTATION_RESPONSE_SUCCESS",
  MUTATION_AUTH_ERROR: "MUTATION_AUTH_ERROR",
  MUTATION_AUTH_SUCCESS: "MUTATION_AUTH_SUCCESS",
  MUTATION_LOGOUT: "MUTATION_LOGOUT",
  MUTATION_CLEAR_RESPONSES: "MUTATION_CLEAR_RESPONSES",
  MUTATION_SET_LOADING: "MUTATION_SET_LOADING",
};

export default {
  moduleName,

  namespaced: true,

  state: () => ({
    response_success: "",
    response_error: "",
    myNotesJWT: "",
    myNotesUser: "",
    loading: false,
  }),

  actions: {
    async [actionTypes.ACTION_LOGIN](
      { commit }: Record<string, Commit>,
      userData: Record<string, string>
    ) {
      commit(mutationTypes.MUTATION_SET_LOADING, true);
      commit(mutationTypes.MUTATION_CLEAR_RESPONSES);
      try {
        const response = await api.post(AuthApi + "login", userData);
        setCookie("myNotesJWT", response.data.jwt);
        setCookie("myNotesUser", response.data.user);
        commit(mutationTypes.MUTATION_AUTH_SUCCESS, response);
      } catch (err: any) {
        commit(mutationTypes.MUTATION_AUTH_ERROR, err.response.data);
      } finally {
        commit(mutationTypes.MUTATION_SET_LOADING, false);
      }
    },

    async [actionTypes.ACTION_REGISTER](
      { commit }: Record<string, Commit>,
      userData: Record<string, string>
    ) {
      commit(mutationTypes.MUTATION_SET_LOADING, true);
      commit(mutationTypes.MUTATION_CLEAR_RESPONSES);
      try {
        const response = await api.post(AuthApi + "register", userData);
        setCookie("myNotesJWT", response.data.jwt);
        setCookie("myNotesUser", response.data.user);
        commit(mutationTypes.MUTATION_AUTH_SUCCESS, response);
      } catch (err: any) {
        commit(mutationTypes.MUTATION_AUTH_ERROR, err.response.data);
      } finally {
        commit(mutationTypes.MUTATION_SET_LOADING, false);
      }
    },

    [actionTypes.ACTION_LOGOUT]({ commit }: Record<string, Commit>) {
      delCookie("myNotesJWT");
      delCookie("myNotesUser");
      commit(mutationTypes.MUTATION_LOGOUT);
    },

    [actionTypes.ACTION_CHECK_COOKIE]({ commit }: Record<string, Commit>) {
      const jwt = getCookie("myNotesJWT");
      const user = getCookie("myNotesUser");
      if (jwt && user)
        commit(mutationTypes.MUTATION_AUTH_SUCCESS, { jwt: jwt, user: user });
      else commit(mutationTypes.MUTATION_LOGOUT);
    },

    [actionTypes.ACTION_CLEAR_RESPONSES]({ commit }: Record<string, Commit>) {
      commit(mutationTypes.MUTATION_CLEAR_RESPONSES);
    },

    async [actionTypes.ACTION_SEND_EMAIL](
      { commit }: Record<string, Commit>,
      data: Record<string, string>
    ) {
      try {
        commit(mutationTypes.MUTATION_SET_LOADING, true);
        commit(mutationTypes.MUTATION_CLEAR_RESPONSES);
        const response = await api.post(AuthApi + "passwordReset", data);
        commit(mutationTypes.MUTATION_RESPONSE_SUCCESS, response.data);
      } catch (err: any) {
        commit(mutationTypes.MUTATION_RESPONSE_ERROR, err.response.data);
      } finally {
        commit(mutationTypes.MUTATION_SET_LOADING, false);
      }
    },

    async [actionTypes.ACTION_CHANGE_PASSWORD](
      { commit }: Record<string, Commit>,
      data: Record<string, string>
    ) {
      try {
        commit(mutationTypes.MUTATION_SET_LOADING, true);
        commit(mutationTypes.MUTATION_CLEAR_RESPONSES);
        const response = await api.post(AuthApi + "changePassword", { data });
        commit(mutationTypes.MUTATION_RESPONSE_SUCCESS, response.data);
      } catch (err: any) {
        commit(mutationTypes.MUTATION_RESPONSE_ERROR, err.response.data);
      } finally {
        commit(mutationTypes.MUTATION_SET_LOADING, false);
      }
    },
  },

  mutations: {
    [mutationTypes.MUTATION_AUTH_ERROR](
      state: Record<string, unknown>,
      err: Error
    ) {
      state.response_error = err;
      state.myNotesJWT = "";
      state.myNotesUser = "";
    },

    [mutationTypes.MUTATION_AUTH_SUCCESS](
      state: Record<string, unknown>,
      response: Record<string, string>
    ) {
      state.response_success = response;
      state.myNotesJWT = getCookie("myNotesJWT");
      state.myNotesUser = getCookie("myNotesUser");
    },

    [mutationTypes.MUTATION_LOGOUT](state: Record<string, unknown>) {
      state.myNotesJWT = "";
      state.myNotesUser = "";
    },

    [mutationTypes.MUTATION_CLEAR_RESPONSES](state: Record<string, unknown>) {
      state.response_error = "";
      state.response_success = "";
    },

    [mutationTypes.MUTATION_SET_LOADING](
      state: Record<string, unknown>,
      condition: Boolean
    ) {
      state.loading = condition;
    },

    [mutationTypes.MUTATION_RESPONSE_SUCCESS](
      state: Record<string, unknown>,
      response: string
    ) {
      state.response_success = response;
    },

    [mutationTypes.MUTATION_RESPONSE_ERROR](
      state: Record<string, unknown>,
      response: unknown
    ) {
      state.response_error = response;
    },
  },

  getters: {
    [getterTypes.GETTER_AUTH_SUCCESS]: (state: Record<string, unknown>) => state.response_success,
    [getterTypes.GETTER_AUTH_ERROR]: (state: Record<string, unknown>) => state.response_error,
    [getterTypes.GETTER_JWT]: (state: Record<string, unknown>) => state.myNotesJWT,
    [getterTypes.GETTER_USER]: (state: Record<string, unknown>) => state.myNotesUser,
    [getterTypes.GETTER_LOADING]: (state: Record<string, unknown>) => state.loading,
  },
};
