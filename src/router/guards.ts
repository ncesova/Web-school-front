import {NavigationGuard} from "vue-router";
import {authService} from "../services/auth.service";

export const authGuard: NavigationGuard = (to) => {
  // Allow access to auth-related pages without login
  const publicPages = [
    "/",
    "/login",
    "/login-teacher",
    "/login-student",
    "/signup",
    "/signup-teacher",
  ];
  const authRequired = !publicPages.includes(to.path);

  const isAuthenticated = authService.isAuthenticated();

  if (authRequired && !isAuthenticated) {
    return "/login";
  }
};
