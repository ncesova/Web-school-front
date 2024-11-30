import Routing from "./index.vue";
import Cabinet from "./Cabinet";
import TeacherCabinet from "./TeacherCabinet";
import CreateClassroom from "./CreateClassroom/CreateClassroom.vue";
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
    meta: {requiresAuth: false},
  },
  {
    path: "/cabinet",
    component: Cabinet,
    meta: {requiresAuth: true},
  },
  {
    path: "/teacher-cabinet",
    component: TeacherCabinet,
    meta: {requiresAuth: true},
  },
  {
    path: "/profile/edit",
    component: () => import("./EditProfile"),
    meta: {requiresAuth: true},
  },
  {
    path: "/classroom/create",
    component: CreateClassroom,
    meta: {requiresAuth: true},
  },
];

export {Routing};
