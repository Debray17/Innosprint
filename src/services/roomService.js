// src/services/roomService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

/**
 * Get rooms.
 * Endpoint: /hpms/api/Room/Get
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getRooms = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.ROOMS.GET, { headers });
  return extractResponseData(response);
};

/**
 * Get room list.
 * Endpoint: /hpms/api/Room/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getRoomList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.ROOMS.GET_LIST, { headers });
  return extractResponseData(response);
};

/**
 * Get available room list.
 * Endpoint: /hpms/api/Room/GetAvailableRoomList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getAvailableRoomList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.ROOMS.GET_AVAILABLE_ROOM_LIST, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Search room list by filters.
 * Endpoint: /hpms/api/Room/SearchRoomListByFilters
 * @param {{
 *  cityName?: string,
 *  countryName?: string,
 *  checkinDate?: string,
 *  checkoutDate?: string,
 *  roomCapacity?: number,
 * }} params
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const searchRoomListByFilters = async (params, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.ROOMS.SEARCH_BY_FILTERS, {
    headers,
    params,
  });
  return extractResponseData(response);
};

/**
 * Create room.
 * Endpoint: /hpms/api/Room/Post
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  propertyId?: string,
 *  roomTypeId?: string,
 *  roomNo?: string | null,
 *  floor?: string | null,
 *  capacity?: number,
 *  basePrise?: number,
 *  description?: string | null,
 *  icon?: string | null,
 *  statusId?: number
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createRoom = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(ENDPOINTS.ROOMS.POST, payload, { headers });
  return extractResponseData(response);
};

/**
 * Update room.
 * Endpoint: /hpms/api/Room/Put
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  propertyId?: string,
 *  roomTypeId?: string,
 *  roomNo?: string | null,
 *  floor?: string | null,
 *  capacity?: number,
 *  basePrise?: number,
 *  description?: string | null,
 *  icon?: string | null,
 *  statusId?: number
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updateRoom = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.ROOMS.PUT, payload, { headers });
  return extractResponseData(response);
};

/**
 * Delete room.
 * Endpoint: /hpms/api/Room/Delete
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  propertyId?: string,
 *  roomTypeId?: string,
 *  roomNo?: string | null,
 *  floor?: string | null,
 *  capacity?: number,
 *  basePrise?: number,
 *  description?: string | null,
 *  icon?: string | null,
 *  statusId?: number
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const deleteRoom = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.delete(ENDPOINTS.ROOMS.DELETE, {
    headers,
    data: payload,
  });
  return extractResponseData(response);
};
