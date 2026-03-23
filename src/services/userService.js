// src/services/userService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

/**
 * Create a user.
 * Swagger schema: User
 * @param {{
 *  id?: string,
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  transactedDate?: string,
 *  remark?: string | null,
 *  version?: number,
 *  lastChanged?: string,
 *  logInfo?: {
 *    id?: string,
 *    applicationName?: string | null,
 *    moduleName?: string | null,
 *    layer?: string | null,
 *    className?: string | null,
 *    methodName?: string | null,
 *    userName?: string | null
 *  },
 *  documentNumber?: string | null,
 *  isSelected?: boolean,
 *  message?: string | null,
 *  errorList?: Array<{
 *    errorType?: number,
 *    message?: string | null,
 *    propertyName?: string | null
 *  }>,
 *  isDeleted?: boolean,
 *  aspNetUserId?: string,
 *  name?: string | null,
 *  email?: string | null,
 *  phoneNo?: string | null,
 *  avatarUrl?: string | null,
 *  lastLoginDate?: string,
 *  isBlocked?: boolean
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createUser = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(ENDPOINTS.USERS.POST, payload, { headers });
  return extractResponseData(response);
};

/**
 * Get users.
 * Endpoint: /hpms/api/User/Get
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getUsers = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.USERS.GET, { headers });
  return extractResponseData(response);
};

/**
 * Get user by id.
 * Endpoint: /hpms/api/User/GetById/{id}
 * @param {string} id
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getUserById = async (id, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(`${ENDPOINTS.USERS.GET_BY_ID}/${id}`, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Get user list.
 * Endpoint: /hpms/api/User/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getUserList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.USERS.GET_LIST, { headers });
  return extractResponseData(response);
};

/**
 * Update a user.
 * Endpoint: /hpms/api/User/Put
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  aspNetUserId?: string,
 *  name?: string | null,
 *  email?: string | null,
 *  phoneNo?: string | null,
 *  avatarUrl?: string | null,
 *  lastLoginDate?: string,
 *  isBlocked?: boolean
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updateUser = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.USERS.PUT, payload, { headers });
  return extractResponseData(response);
};
