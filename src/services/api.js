// src/services/api.js
import axios from "axios";
import {
  API_BASE_URL,
  REQUEST_TIMEOUT_MS,
  WITH_CREDENTIALS,
  AUTH_HEADER_NAME,
  AUTH_TOKEN_PREFIX,
  AUTH_TOKEN_STORAGE_KEY,
  TOKEN_FIELD_CANDIDATES,
  DATA_WRAPPER_CANDIDATES,
  ERROR_MESSAGE_FIELD_CANDIDATES,
  ERROR_LIST_FIELD_CANDIDATES,
} from "../config/apiConfig";

const isReplaceable = (value) =>
  typeof value === "string" && value.startsWith("[REPLACE_");

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const resolveField = (fieldValue, fallbackValue) =>
  isReplaceable(fieldValue) ? fallbackValue : fieldValue;

const normalizeFieldCandidates = (candidates) =>
  candidates.filter((candidate) => !isReplaceable(candidate));

export const getStoredToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch (error) {
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } catch (error) {
    // TODO: Handle storage fallbacks (cookies, sessionStorage) if needed.
  }
};

export const clearStoredToken = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch (error) {
    // TODO: Handle storage fallbacks (cookies, sessionStorage) if needed.
  }
};

export const extractTokenFromPayload = (payload) => {
  if (!payload) return null;

  if (typeof payload === "string") {
    return payload;
  }

  if (isPlainObject(payload)) {
    const candidates = normalizeFieldCandidates(TOKEN_FIELD_CANDIDATES);
    for (const field of candidates) {
      if (payload[field]) {
        return payload[field];
      }
    }
  }

  return null;
};

export const extractResponseData = (response) => {
  if (!response) return null;

  const responseData = response.data ?? response;

  if (isPlainObject(responseData)) {
    const wrapperCandidates = normalizeFieldCandidates(
      DATA_WRAPPER_CANDIDATES
    );
    for (const wrapper of wrapperCandidates) {
      if (Object.prototype.hasOwnProperty.call(responseData, wrapper)) {
        return responseData[wrapper];
      }
    }
  }

  return responseData;
};

export const extractErrorMessage = (errorData) => {
  if (!errorData) return null;

  if (typeof errorData === "string") {
    return errorData;
  }

  if (isPlainObject(errorData)) {
    const messageCandidates = normalizeFieldCandidates(
      ERROR_MESSAGE_FIELD_CANDIDATES
    );
    for (const field of messageCandidates) {
      if (errorData[field]) {
        return errorData[field];
      }
    }

    const listCandidates = normalizeFieldCandidates(
      ERROR_LIST_FIELD_CANDIDATES
    );
    for (const field of listCandidates) {
      const listValue = errorData[field];
      if (Array.isArray(listValue) && listValue.length > 0) {
        const firstItem = listValue[0];
        if (typeof firstItem === "string") {
          return firstItem;
        }
        if (isPlainObject(firstItem)) {
          return (
            firstItem.message ||
            firstItem.detail ||
            JSON.stringify(firstItem)
          );
        }
      }
    }
  }

  return null;
};

export const normalizeApiError = (error) => {
  const status = error?.response?.status ?? null;
  const data = error?.response?.data ?? null;
  const message =
    extractErrorMessage(data) ||
    error?.message ||
    "An unexpected error occurred";

  return {
    message,
    status,
    data,
    raw: error,
  };
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: WITH_CREDENTIALS,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    const prefix = resolveField(AUTH_TOKEN_PREFIX, "Bearer");
    const headerValue = prefix ? `${prefix} ${token}` : token;
    config.headers = config.headers ?? {};
    config.headers[resolveField(AUTH_HEADER_NAME, "Authorization")] =
      headerValue;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
);

export default api;

