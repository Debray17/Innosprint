// src/services/ownerService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

/**
 * Create an owner.
 * Endpoint: /hpms/api/Owner/Post
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  email?: string | null,
 *  phoneNo?: string | null,
 *  address?: string | null,
 *  avatarUrl?: string | null,
 *  statusId?: number,
 *  documentUrl?: string | null,
 *  rejectionReason?: string | null,
 *  verificationDate?: string
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createOwner = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(ENDPOINTS.OWNERS.POST, payload, { headers });
  return extractResponseData(response);
};

/**
 * Update an owner.
 * Endpoint: /hpms/api/Owner/Put
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  email?: string | null,
 *  phoneNo?: string | null,
 *  address?: string | null,
 *  avatarUrl?: string | null,
 *  statusId?: number,
 *  documentUrl?: string | null,
 *  rejectionReason?: string | null,
 *  verificationDate?: string
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updateOwner = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.OWNERS.PUT, payload, { headers });
  return extractResponseData(response);
};

/**
 * Get owners list.
 * Endpoint: /hpms/api/Owner/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getOwnerList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.OWNERS.GET_LIST, { headers });
  return extractResponseData(response);
};

/**
 * Delete an owner.
 * Endpoint: /hpms/api/Owner/Delete
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  email?: string | null,
 *  phoneNo?: string | null,
 *  address?: string | null,
 *  avatarUrl?: string | null,
 *  statusId?: number,
 *  documentUrl?: string | null,
 *  rejectionReason?: string | null,
 *  verificationDate?: string
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const deleteOwner = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.delete(ENDPOINTS.OWNERS.DELETE, {
    headers,
    data: payload,
  });
  return extractResponseData(response);
};
