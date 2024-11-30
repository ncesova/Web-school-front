import Routing from "./index.vue";

export const routes = [
  { path: "/login", component: () => import("."), name: "Login" },
  { path: "/", component: () => import("./MainPage"), name: "Main" },
];

export { Routing };
