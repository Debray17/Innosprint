// src/services/roomTypeService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

/**
 * Get room types.
 * Endpoint: /hpms/api/RoomType/Get
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getRoomTypes = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.ROOM_TYPES.GET, { headers });
  return extractResponseData(response);
};

/**
 * Get room types list.
 * Endpoint: /hpms/api/RoomType/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getRoomTypeList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.ROOM_TYPES.GET_LIST, { headers });
  return extractResponseData(response);
};

/**
 * Create room type.
 * Endpoint: /hpms/api/RoomType/Post
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  description?: string | null,
 *  baseCapacity?: number,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createRoomType = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(ENDPOINTS.ROOM_TYPES.POST, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Update room type.
 * Endpoint: /hpms/api/RoomType/Put
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  description?: string | null,
 *  baseCapacity?: number,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updateRoomType = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.ROOM_TYPES.PUT, payload, { headers });
  return extractResponseData(response);
};

/**
 * Delete room type.
 * Endpoint: /hpms/api/RoomType/Delete
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  description?: string | null,
 *  baseCapacity?: number,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const deleteRoomType = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.delete(ENDPOINTS.ROOM_TYPES.DELETE, {
    headers,
    data: payload,
  });
  return extractResponseData(response);
};
