import Routing from "./index.vue";
import TeacherCabinet from "./TeacherCabinet";
import ParentCabinet from "./ParentCabinet/ParentCabinet.vue";
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
    component: () => {
      const role = localStorage.getItem("roleId");
      console.log("role", role);
      if (role === "3") {
        return import("./TeacherCabinet/TeacherCabinet.vue");
      } else if (role === "2") {
        return import("./ParentCabinet/ParentCabinet.vue");
      } else {
        return import("./StudentCabinet/StudentCabinet.vue");
      }
    },
    meta: {requiresAuth: true},
  },
  {
    path: "/parent-cabinet",
    component: ParentCabinet,
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
  {
    path: "/classroom/:id",
    component: () => import("./ClassroomDetails/ClassroomDetails.vue"),
    meta: {requiresAuth: true},
  },
  {
    path: "/lessons/:id",
    component: () => import("./LessonDetails/LessonDetails.vue"),
    meta: {requiresAuth: true},
  },
];

export {Routing};
