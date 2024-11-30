import Routing from "./index.vue";

export const routes = [
  {
    path: "/login",
    component: () => import("./LoginParent"),
    name: "Login",
    meta: {requiresAuth: false},
  },
  {
    path: "/",
    component: () => import("./MainPage"),
    name: "Main",
    meta: {requiresAuth: true},
  },
];

export {Routing};
