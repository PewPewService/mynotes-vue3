import { createRouter, createWebHistory } from "vue-router";

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
    component: () => import("../views/NotesPage.vue"),
  },

  {
    path: "/search",
    name: "Search",
    component: () => import("../views/NotesPage.vue"),
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

  {
    path: "/passwordReset",
    name: "PasswordReset",
    component: () => import("../views/PasswordReset.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
