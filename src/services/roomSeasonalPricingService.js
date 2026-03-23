// src/services/roomSeasonalPricingService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

/**
 * Create room seasonal pricing.
 * Endpoint: /hpms/api/RoomSeasonalPricing/Post
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  seasonalPricingId?: string,
 *  roomId?: string,
 *  price?: number
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createRoomSeasonalPricing = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(
    ENDPOINTS.ROOM_SEASONAL_PRICING.POST,
    payload,
    {
      headers,
    }
  );
  return extractResponseData(response);
};

/**
 * Update room seasonal pricing.
 * Endpoint: /hpms/api/RoomSeasonalPricing/Put
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  seasonalPricingId?: string,
 *  roomId?: string,
 *  price?: number,
 *  id?: string,
 *  documentNumber?: string | null,
 *  isSelected?: boolean,
 *  version?: number,
 *  remark?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updateRoomSeasonalPricing = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(
    ENDPOINTS.ROOM_SEASONAL_PRICING.PUT,
    payload,
    {
      headers,
    }
  );
  return extractResponseData(response);
};

/**
 * Delete room seasonal pricing.
 * Endpoint: /hpms/api/RoomSeasonalPricing/Delete
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  seasonalPricingId?: string,
 *  roomId?: string,
 *  price?: number,
 *  id?: string,
 *  documentNumber?: string | null,
 *  isSelected?: boolean,
 *  version?: number,
 *  remark?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const deleteRoomSeasonalPricing = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.delete(
    ENDPOINTS.ROOM_SEASONAL_PRICING.DELETE,
    {
      headers,
      data: payload,
    }
  );
  return extractResponseData(response);
};

/**
 * Get room seasonal pricing list.
 * Endpoint: /hpms/api/RoomSeasonalPricing/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getRoomSeasonalPricingList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.ROOM_SEASONAL_PRICING.GET_LIST, {
    headers,
  });
  return extractResponseData(response);
};
