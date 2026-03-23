// src/services/propertyService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

/**
 * Create a property.
 * Endpoint: /hpms/api/Property/Post
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  ownerId?: string,
 *  propertyTypeId?: string,
 *  name?: string | null,
 *  description?: string | null,
 *  address?: string | null,
 *  city?: string | null,
 *  country?: string | null,
 *  statusId?: number,
 *  icon?: string | null,
 *  rating?: number,
 *  reviewCount?: number,
 *  commissionRate?: number,
 *  emailAddress?: string | null,
 *  phoneNo?: string | null,
 *  checkinDate?: string,
 *  checkoutDate?: string,
 *  rejectionReason?: string | null,
 *  approvalDate?: string
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const createProperty = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.post(ENDPOINTS.PROPERTIES.POST, payload, {
    headers,
  });
  return extractResponseData(response);
};

/**
 * Update a property.
 * Endpoint: /hpms/api/Property/Put
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  ownerId?: string,
 *  propertyTypeId?: string,
 *  name?: string | null,
 *  description?: string | null,
 *  address?: string | null,
 *  city?: string | null,
 *  country?: string | null,
 *  statusId?: number,
 *  icon?: string | null,
 *  rating?: number,
 *  reviewCount?: number,
 *  commissionRate?: number,
 *  emailAddress?: string | null,
 *  phoneNo?: string | null,
 *  checkinDate?: string,
 *  checkoutDate?: string,
 *  rejectionReason?: string | null,
 *  approvalDate?: string
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const updateProperty = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.PROPERTIES.PUT, payload, { headers });
  return extractResponseData(response);
};

/**
 * Delete a property.
 * Endpoint: /hpms/api/Property/Delete
 * @param {{
 *  isActive?: boolean,
 *  transactedBy?: string | null,
 *  ownerId?: string,
 *  propertyTypeId?: string,
 *  name?: string | null,
 *  description?: string | null,
 *  address?: string | null,
 *  city?: string | null,
 *  country?: string | null,
 *  statusId?: number,
 *  icon?: string | null,
 *  rating?: number,
 *  reviewCount?: number,
 *  commissionRate?: number,
 *  emailAddress?: string | null,
 *  phoneNo?: string | null,
 *  checkinDate?: string,
 *  checkoutDate?: string,
 *  rejectionReason?: string | null,
 *  approvalDate?: string
 * }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const deleteProperty = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.delete(ENDPOINTS.PROPERTIES.DELETE, {
    headers,
    data: payload,
  });
  return extractResponseData(response);
};

/**
 * Get property list.
 * Endpoint: /hpms/api/Property/GetList
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getPropertyList = async (options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(ENDPOINTS.PROPERTIES.GET_LIST, { headers });
  return extractResponseData(response);
};

/**
 * Get property by id.
 * Endpoint: /hpms/api/Property/GetById/{id}
 * @param {string} id
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const getPropertyById = async (id, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.get(`${ENDPOINTS.PROPERTIES.GET_BY_ID}/${id}`, {
    headers,
  });
  return extractResponseData(response);
};
