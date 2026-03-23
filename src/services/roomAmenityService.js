// src/services/roomAmenityService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

/**
 * Create room amenity.
 * Endpoint: /hpms/api/RoomAmenity/Post
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  roomId?: string,
 *  name?: string | null,
 *  description?: string | null,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createRoomAmenity = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(ENDPOINTS.ROOM_AMENITIES.POST, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Update room amenity.
 * Endpoint: /hpms/api/RoomAmenity/Put
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  roomId?: string,
 *  name?: string | null,
 *  description?: string | null,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updateRoomAmenity = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.ROOM_AMENITIES.PUT, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Delete room amenity.
 * Endpoint: /hpms/api/RoomAmenity/Delete
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  roomId?: string,
 *  name?: string | null,
 *  description?: string | null,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const deleteRoomAmenity = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.delete(ENDPOINTS.ROOM_AMENITIES.DELETE, {
    headers,
    data: payload,
  });
  return extractResponseData(response);
};

/**
 * Get room amenities list.
 * Endpoint: /hpms/api/RoomAmenity/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getRoomAmenityList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.ROOM_AMENITIES.GET_LIST, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Get room amenity by id.
 * Endpoint: /hpms/api/RoomAmenity/GetById/{id}
 * @param {string} id
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getRoomAmenityById = async (id, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(`${ENDPOINTS.ROOM_AMENITIES.GET_BY_ID}/${id}`, {
    headers,
  });
  return extractResponseData(response);
};
