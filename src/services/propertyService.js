// src/services/propertyService.js
import api, { extractResponseData } from "./api";
import {
  ACCEPT_LANGUAGE_HEADER,
  DEFAULT_LANGUAGE,
  ENDPOINTS,
} from "../config/apiConfig";

const PROPERTY_REQUEST_STORAGE_KEY = "hpms.property.requests";

const isBrowser = typeof window !== "undefined";

const normalizeList = (value) => (Array.isArray(value) ? value : []);

const readStoredPropertyRequests = () => {
  if (!isBrowser) return [];

  try {
    const rawValue = window.localStorage.getItem(PROPERTY_REQUEST_STORAGE_KEY);
    if (!rawValue) return [];
    return normalizeList(JSON.parse(rawValue));
  } catch (error) {
    return [];
  }
};

const writeStoredPropertyRequests = (properties) => {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(
      PROPERTY_REQUEST_STORAGE_KEY,
      JSON.stringify(normalizeList(properties))
    );
  } catch (error) {
    // ignore storage failures
  }
};

const upsertStoredPropertyRequest = (property) => {
  if (!property?.id) return;

  const properties = readStoredPropertyRequests();
  const nextProperties = properties.filter(
    (item) => String(item.id) !== String(property.id)
  );
  nextProperties.unshift(property);
  writeStoredPropertyRequests(nextProperties);
};

const removeStoredPropertyRequest = (id) => {
  if (!id) return;

  const properties = readStoredPropertyRequests().filter(
    (item) => String(item.id) !== String(id)
  );
  writeStoredPropertyRequests(properties);
};

export const getStoredPropertyRequests = () => readStoredPropertyRequests();

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
 *  approvalDate?: string,
 *  accountName?: string | null,
 *  accountNo?: string | null
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
  const responseData = extractResponseData(response);

  if (Number(responseData?.statusId ?? payload?.statusId ?? 0) !== 1) {
    upsertStoredPropertyRequest({
      ...payload,
      ...responseData,
      id: responseData?.id || responseData?.primaryKeyValue,
    });
  }

  return responseData;
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
 *  approvalDate?: string,
 *  accountName?: string | null,
 *  accountNo?: string | null
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
 *  approvalDate?: string,
 *  accountName?: string | null,
 *  accountNo?: string | null
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
  const responseData = extractResponseData(response);
  removeStoredPropertyRequest(payload?.id || payload?.primaryKeyValue);
  return responseData;
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

/**
 * Approve a property.
 * Endpoint: /hpms/api/Property/Approve
 * @param {{ id: string, isActive?: boolean, transactedBy?: string | null, remark?: string | null }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const approveProperty = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.PROPERTIES.APPROVE, payload, {
    headers,
  });
  const responseData = extractResponseData(response);
  removeStoredPropertyRequest(payload?.id || payload?.primaryKeyValue);
  return responseData;
};

/**
 * Reject a property.
 * Endpoint: /hpms/api/Property/Reject
 * @param {{ id: string, isActive?: boolean, transactedBy?: string | null, remark?: string | null }} payload
 * @param {{ language?: "en" | "dz", headers?: Record<string, string> }} options
 * @returns {Promise<any>}
 */
export const rejectProperty = async (payload, options = {}) => {
  const language = options.language || DEFAULT_LANGUAGE;
  const headers = {
    ...(options.headers || {}),
    [ACCEPT_LANGUAGE_HEADER]: language,
  };

  const response = await api.put(ENDPOINTS.PROPERTIES.REJECT, payload, {
    headers,
  });
  const responseData = extractResponseData(response);
  removeStoredPropertyRequest(payload?.id || payload?.primaryKeyValue);
  return responseData;
};
