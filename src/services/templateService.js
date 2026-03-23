// src/services/templateService.js
import api, { extractResponseData } from "./api";

// TODO: Replace with Swagger-defined base path for the resource.
export const RESOURCE_BASE_PATH = "[REPLACE_RESOURCE_BASE_PATH]";

/**
 * List all resources.
 * @param {{ page?: number, pageSize?: number, [key: string]: any }} params
 * @returns {Promise<any>}
 */
export const listResources = async (params = {}) => {
  // TODO: Replace RESOURCE_BASE_PATH with actual endpoint path.
  const response = await api.get(RESOURCE_BASE_PATH, { params });
  return extractResponseData(response);
};

/**
 * Get a single resource by id.
 * @param {string | number} id
 * @returns {Promise<any>}
 */
export const getResourceById = async (id) => {
  // TODO: Replace RESOURCE_BASE_PATH and URL shape with actual endpoint.
  const response = await api.get(`${RESOURCE_BASE_PATH}/${id}`);
  return extractResponseData(response);
};

/**
 * Create a resource.
 * @param {{ [key: string]: any }} payload
 * @returns {Promise<any>}
 */
export const createResource = async (payload) => {
  // TODO: Replace RESOURCE_BASE_PATH with actual endpoint path.
  const response = await api.post(RESOURCE_BASE_PATH, payload);
  return extractResponseData(response);
};

/**
 * Update a resource.
 * @param {string | number} id
 * @param {{ [key: string]: any }} payload
 * @returns {Promise<any>}
 */
export const updateResource = async (id, payload) => {
  // TODO: Replace RESOURCE_BASE_PATH and URL shape with actual endpoint.
  const response = await api.put(`${RESOURCE_BASE_PATH}/${id}`, payload);
  return extractResponseData(response);
};

/**
 * Delete a resource.
 * @param {string | number} id
 * @returns {Promise<any>}
 */
export const deleteResource = async (id) => {
  // TODO: Replace RESOURCE_BASE_PATH and URL shape with actual endpoint.
  const response = await api.delete(`${RESOURCE_BASE_PATH}/${id}`);
  return extractResponseData(response);
};

