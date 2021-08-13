/* eslint-disable prettier/prettier */
import api from "./api";
import {setCookie, delCookie, getCookie} from "../../utils/cookie control/cookie.js";
const AuthApi = process.env.VUE_APP_USERS;
export const moduleName = "authModule";


export const actionTypes = {
    ACTION_REGISTER: "ACTION_REGISTER",
    ACTION_LOGIN: "ACTION_LOGIN",
    ACTION_LOGOUT: "ACTION_LOGOUT",
    ACTION_CHECK_COOKIE: "ACTION_CHECK_COOKIE",
    ACTION_CLEAR_RESPONSES: "ACTION_CLEAR_RESPONSES",
}

export const getterTypes = {
    GETTER_AUTH_SUCCESS: "GETTER_AUTH_SUCCESS",
    GETTER_AUTH_ERROR: "GETTER_AUTH_ERROR",
    GETTER_JWT: "GETTER_JWT",
    GETTER_USER: "GETTER_USER",
}

export const mutationTypes = {
    MUTATION_AUTH_ERROR: "MUTATION_AUTH_ERROR",
    MUTATION_AUTH_SUCCESS: "MUTATION_AUTH_SUCCESS",
    MUTATION_LOGOUT: "MUTATION_JWT",
    MUTATION_CLEAR_RESPONSES: "MUTATION_CLEAR_RESPONSES",
}

export default{
    moduleName,

    namespaced: true,

    state: () => ({
        response_success: "",
        response_error: "",
        jwt: "",
        user: "",
    }),

    actions: {
        async [actionTypes.ACTION_LOGIN] ({commit}, userData){
            commit(mutationTypes.MUTATION_CLEAR_RESPONSES);
            try {
                const response = await api.post(AuthApi + "login", userData);
                delCookie("jwt");
                delCookie("user");
                if (response.status == 200){
                    setCookie("jwt", response.data.jwt);
                    setCookie("user", response.data.user);
                    commit(mutationTypes.MUTATION_AUTH_SUCCESS, response);
                }
                else commit(mutationTypes.MUTATION_AUTH_ERROR, response.data);
            }
            catch (err){
                commit(mutationTypes.MUTATION_AUTH_ERROR, err);
            }
        },

        async [actionTypes.ACTION_REGISTER] ({commit}, userData){
            commit(mutationTypes.MUTATION_CLEAR_RESPONSES);
            try{
                const response = await api.post(AuthApi + "register", userData);
                delCookie("jwt");
                delCookie("user");
                if (response.status == 200) {
                    setCookie("jwt", response.data.jwt);
                    setCookie("user", response.data.user);
                    commit(mutationTypes.MUTATION_AUTH_SUCCESS, response);
                }
                else commit (mutationTypes.MUTATION_AUTH_ERROR, response.data);
            }
            catch (err){
                commit(mutationTypes.MUTATION_AUTH_ERROR, err);
            }
        },

        [actionTypes.ACTION_LOGOUT] ({commit}){
            delCookie("jwt");
            delCookie("user");
            commit(mutationTypes.MUTATION_LOGOUT);
        },

        [actionTypes.ACTION_CHECK_COOKIE] ({commit}) {
            let jwt = getCookie("jwt");
            let user = getCookie("user");
            if (jwt && user) commit(mutationTypes.MUTATION_AUTH_SUCCESS, {jwt: jwt, user: user});
            else commit(mutationTypes.MUTATION_LOGOUT);
        },

        [actionTypes.ACTION_CLEAR_RESPONSES] ({commit}){
            commit(mutationTypes.MUTATION_CLEAR_RESPONSES);
        },
    },

    mutations: {
        [mutationTypes.MUTATION_AUTH_ERROR] (state, err){
            state.response_error = err;
            state.jwt = "";
        },

        [mutationTypes.MUTATION_AUTH_SUCCESS] (state, response) {
            state.response_success = response;
            state.jwt = getCookie("jwt");
            state.user = getCookie("user");
        },

        [mutationTypes.MUTATION_LOGOUT] (state){
            state.jwt = getCookie("jwt");
            state.user = getCookie("user");
        },

        [mutationTypes.MUTATION_CLEAR_RESPONSES] (state){
            state.response_error = "";
            state.response_success = "";
        }
    },

    getters: {
        [getterTypes.GETTER_AUTH_SUCCESS]: (state) => state.response_success,
        [getterTypes.GETTER_AUTH_ERROR]: (state) => state.response_error,
        [getterTypes.GETTER_JWT]: (state) => state.jwt,
        [getterTypes.GETTER_USER]: (state) => state.user,
    }
}