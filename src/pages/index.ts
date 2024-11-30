import Routing from "./index.vue";

export const routes = [
  {
    path: "/login",
    component: () => import("./LoginParent"),
    name: "LoginParent",
    meta: {requiresAuth: false},
  },
  {
    path: "/signup",
    component: () => import("./SignupParent"),
    name: "SignupParent",
    meta: {requiresAuth: false},
  },
  {
    path: "/login-teacher",
    component: () => import("./LoginTeacher"),
    name: "LoginTeacher",
    meta: {requiresAuth: false},
  },
  {
    path: "/signup-teacher",
    component: () => import("./SignupTeacher"),
    name: "SignupTeacher",
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
