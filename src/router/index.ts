import { createRouter, createWebHistory } from "vue-router";
import NotesPage from "../views/NotesPage.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginPage.vue"),
  },

  {
    path: "/register",
    name: "Registration",
    redirect: "/login",
  },

  {
    path: "/",
    name: "Home",
    component: NotesPage,
  },

  {
    path: "/search",
    name: "Search",
    component: NotesPage,
  },

  {
    path: "/note/create",
    name: "NoteCreation",
    component: () => import("../views/NoteEditingPage.vue"),
  },

  {
    path: "/note/edit",
    name: "NoteEditing",
    component: () => import("../views/NoteEditingPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
