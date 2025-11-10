/**
 * Application constants
 */

export const APP_NAME = "Task Manager";
export const APP_VERSION = "1.0.0";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  DASHBOARD: "/dashboard",
  TASKS: "/dashboard/tasks",
  PROFILE: "/dashboard/profile",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TITLE_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 5000,
};
