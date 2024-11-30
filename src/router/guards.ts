import {RouteLocationNormalized, NavigationGuardNext} from "vue-router";
import {authService} from "../services/auth.service";

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const token = authService.getToken();

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
};
