// src/services/propertyAmenityService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

/**
 * Create a property amenity.
 * Endpoint: /hpms/api/PropertyAmenity/Post
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  propertyId?: string,
 *  name?: string | null,
 *  description?: string | null,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createPropertyAmenity = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(ENDPOINTS.PROPERTY_AMENITIES.POST, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Update a property amenity.
 * Endpoint: /hpms/api/PropertyAmenity/Put
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  propertyId?: string,
 *  name?: string | null,
 *  description?: string | null,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updatePropertyAmenity = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.PROPERTY_AMENITIES.PUT, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Delete a property amenity.
 * Endpoint: /hpms/api/PropertyAmenity/Delete
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  propertyId?: string,
 *  name?: string | null,
 *  description?: string | null,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const deletePropertyAmenity = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.delete(ENDPOINTS.PROPERTY_AMENITIES.DELETE, {
    headers,
    data: payload,
  });
  return extractResponseData(response);
};

/**
 * Get property amenities list.
 * Endpoint: /hpms/api/PropertyAmenity/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getPropertyAmenityList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.PROPERTY_AMENITIES.GET_LIST, {
    headers,
  });
  return extractResponseData(response);
};
