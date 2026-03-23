// src/services/userRoleService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

/**
 * Map a user to a role.
 * Endpoint: /hpms/api/UserRole/Post
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  documentNumber?: string | null,
 *  isSelected?: boolean,
 *  message?: string | null,
 *  userId: string,
 *  roleId: number
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createUserRole = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(ENDPOINTS.USER_ROLES.POST, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Update user role.
 * Endpoint: /hpms/api/UserRole/Put
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  documentNumber?: string | null,
 *  isSelected?: boolean,
 *  message?: string | null,
 *  userId: string,
 *  roleId: number
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updateUserRole = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.USER_ROLES.PUT, payload, { headers });
  return extractResponseData(response);
};

/**
 * Delete user role.
 * Endpoint: /hpms/api/UserRole/Delete
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  documentNumber?: string | null,
 *  isSelected?: boolean,
 *  message?: string | null,
 *  userId: string,
 *  roleId: number
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const deleteUserRole = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.delete(ENDPOINTS.USER_ROLES.DELETE, {
    headers,
    data: payload,
  });
  return extractResponseData(response);
};

/**
 * Get user roles list.
 * Endpoint: /hpms/api/UserRole/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getUserRoleList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.USER_ROLES.GET_LIST, { headers });
  return extractResponseData(response);
};

/**
 * Get user role by id.
 * Endpoint: /hpms/api/UserRole/GetById/{id}
 * @param {string} id
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getUserRoleById = async (id, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(`${ENDPOINTS.USER_ROLES.GET_BY_ID}/${id}`, {
    headers,
  });
  return extractResponseData(response);
};
