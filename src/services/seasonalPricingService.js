// src/services/seasonalPricingService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

/**
 * Create seasonal pricing.
 * Endpoint: /hpms/api/SeasonalPricing/Post
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  startDate?: string,
 *  endDate?: string,
 *  priceMultiplier?: number
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createSeasonalPricing = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(ENDPOINTS.SEASONAL_PRICING.POST, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Update seasonal pricing.
 * Endpoint: /hpms/api/SeasonalPricing/Put
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  startDate?: string,
 *  endDate?: string,
 *  priceMultiplier?: number
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updateSeasonalPricing = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.SEASONAL_PRICING.PUT, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Delete seasonal pricing.
 * Endpoint: /hpms/api/SeasonalPricing/Delete
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  startDate?: string,
 *  endDate?: string,
 *  priceMultiplier?: number
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const deleteSeasonalPricing = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.delete(ENDPOINTS.SEASONAL_PRICING.DELETE, {
    headers,
    data: payload,
  });
  return extractResponseData(response);
};

/**
 * Get seasonal pricing list.
 * Endpoint: /hpms/api/SeasonalPricing/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getSeasonalPricingList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.SEASONAL_PRICING.GET_LIST, {
    headers,
  });
  return extractResponseData(response);
};
