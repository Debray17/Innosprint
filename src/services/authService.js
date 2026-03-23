// src/services/authService.js
import api, {
  extractResponseData,
  extractTokenFromPayload,
  setStoredToken,
  clearStoredToken,
} from "./api";
import {
  ENDPOINTS,
  FIELD_MAP,
  DEFAULT_FIELD_FALLBACKS,
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
} from "../config/apiConfig";

const resolveField = (fieldValue, fallbackValue) =>
  fieldValue && !fieldValue.startsWith("[REPLACE_") ? fieldValue : fallbackValue;

const buildLoginPayload = (credentials) => ({
  [resolveField(
    FIELD_MAP.LOGIN_USERNAME_FIELD,
    DEFAULT_FIELD_FALLBACKS.LOGIN_USERNAME_FIELD
  )]: credentials.username,
  [resolveField(
    FIELD_MAP.LOGIN_PASSWORD_FIELD,
    DEFAULT_FIELD_FALLBACKS.LOGIN_PASSWORD_FIELD
  )]: credentials.password,
});

const buildRegisterPayload = (payload) => ({
  // TODO: Replace with Swagger-defined fields for registration.
  [resolveField(
    FIELD_MAP.REGISTER_USERNAME_FIELD,
    DEFAULT_FIELD_FALLBACKS.REGISTER_USERNAME_FIELD
  )]: payload.username,
  [resolveField(
    FIELD_MAP.REGISTER_PASSWORD_FIELD,
    DEFAULT_FIELD_FALLBACKS.REGISTER_PASSWORD_FIELD
  )]: payload.password,
  ...payload,
});

/**
 * Login with required username/password.
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{ token: string | null, data: any }>}
 */
export const login = async (credentials) => {
  const loginPath = ENDPOINTS.USERS?.ACCESS_TOKEN || ENDPOINTS.AUTH.LOGIN;
  const response = await api.post(loginPath, buildLoginPayload(credentials), {
    headers: {
      [ACCEPT_LANGUAGE_HEADER]: DEFAULT_LANGUAGE,
    },
  });

  const data = extractResponseData(response);
  const token = extractTokenFromPayload(data);

  if (token) {
    setStoredToken(token);
  }

  return { token, data };
};

/**
 * Register a new user.
 * @param {{ username: string, password: string, [key: string]: any }} payload
 * @returns {Promise<any>}
 */
export const register = async (payload) => {
  const response = await api.post(
    ENDPOINTS.AUTH.REGISTER,
    buildRegisterPayload(payload)
  );

  return extractResponseData(response);
};

/**
 * Logout current user.
 * @returns {Promise<void>}
 */
export const logout = async () => {
  // TODO: If your API requires a logout endpoint, keep this call.
  // Otherwise remove it and just clear storage.
  if (ENDPOINTS.AUTH.LOGOUT) {
    await api.post(ENDPOINTS.AUTH.LOGOUT);
  }

  clearStoredToken();
};

/**
 * Get current authenticated user.
 * @returns {Promise<any>}
 */
export const getCurrentUser = async () => {
  const response = await api.get(ENDPOINTS.AUTH.ME);
  return extractResponseData(response);
};
