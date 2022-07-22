import { createRouter, createWebHistory, Router } from "vue-router";
import Error404 from "./views/Error404.vue";
import Home from "./views/Home.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/:pathMatch(.*)*", component: Error404 },
];

export default function setupRouter(): Router {
  return createRouter({
    history: createWebHistory(),
    routes,
  });
}
