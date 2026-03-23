// src/services/propertyTypeService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

/**
 * Create a property type.
 * Endpoint: /hpms/api/PropertyType/Post
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  description?: string | null,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createPropertyType = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(ENDPOINTS.PROPERTY_TYPES.POST, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Update a property type.
 * Endpoint: /hpms/api/PropertyType/Put
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  description?: string | null,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updatePropertyType = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.PROPERTY_TYPES.PUT, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Delete a property type.
 * Endpoint: /hpms/api/PropertyType/Delete
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  name?: string | null,
 *  description?: string | null,
 *  icon?: string | null
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const deletePropertyType = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.delete(ENDPOINTS.PROPERTY_TYPES.DELETE, {
    headers,
    data: payload,
  });
  return extractResponseData(response);
};

/**
 * Get property types list.
 * Endpoint: /hpms/api/PropertyType/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getPropertyTypeList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.PROPERTY_TYPES.GET_LIST, {
    headers,
  });
  return extractResponseData(response);
};
