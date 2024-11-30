import {NavigationGuard} from "vue-router";
import {authService} from "../services/auth.service";
import {UserRole} from "../types/auth";

export const authGuard: NavigationGuard = (to) => {
  const publicPages = [
    "/",
    "/login",
    "/login-teacher",
    "/login-student",
    "/signup",
    "/signup-teacher",
  ];
  const authPages = [
    "/login",
    "/login-teacher",
    "/login-student",
    "/signup",
    "/signup-teacher",
  ];

  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  if (publicPages.includes(to.path)) {
    if (isAuthenticated && authPages.includes(to.path)) {
      return userRole === UserRole.Teacher ? "/teacher-cabinet" : "/cabinet";
    }
    return;
  }

  if (!isAuthenticated) {
    return "/login";
  }

  if (to.path === "/cabinet" && userRole === UserRole.Teacher) {
    return "/teacher-cabinet";
  }
  if (to.path === "/teacher-cabinet" && userRole !== UserRole.Teacher) {
    return "/cabinet";
  }
};
