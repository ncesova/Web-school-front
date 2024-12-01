import Routing from "./index.vue";
import TeacherCabinet from "./TeacherCabinet";
import ParentCabinet from "./ParentCabinet/ParentCabinet.vue";
import CreateClassroom from "./CreateClassroom/CreateClassroom.vue";
import MainPage from "./MainPage.vue";
import SearchTeachers from "./SearchTeachers/SearchTeachers.vue";

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
    component: MainPage,
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
  {
    path: "/lesson/:id/agent",
    component: () => import("../games/Agent/Agent.vue"),
    meta: {requiresAuth: true},
  },
  {
    path: "/lesson/:id/pet",
    component: () => import("../games/Pet/Pet.vue"),
    meta: {requiresAuth: true},
  },
  {
    path: "/lesson/:id/robot",
    component: () => import("../games/Robot/Robot.vue"),
    meta: {requiresAuth: true},
  },
  {
    path: "/lesson/:id/space",
    component: () => import("../games/Space/Space.vue"),
    meta: {requiresAuth: true},
  },
  {
    path: "/lesson/:id/testing",
    component: () => import("../games/Testing/Testing.vue"),
    meta: {requiresAuth: true},
  },
  {
    path: "/search",
    component: SearchTeachers,
    name: "SearchTeachers",
    meta: {requiresAuth: false},
  },
];

export {Routing};
