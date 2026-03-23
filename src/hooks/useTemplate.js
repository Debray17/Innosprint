// src/hooks/useTemplate.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from "../services/templateService";

// TODO: Replace with a meaningful query key for the resource.
export const RESOURCE_QUERY_KEY = ["[REPLACE_RESOURCE_QUERY_KEY]"];

/**
 * List resources query.
 * @param {{ page?: number, pageSize?: number, [key: string]: any }} params
 * @param {{ enabled?: boolean }} options
 * @returns {import("@tanstack/react-query").UseQueryResult<any>}
 */
export const useResourceList = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...RESOURCE_QUERY_KEY, "list", params],
    queryFn: () => listResources(params),
    enabled: options.enabled ?? true,
  });

/**
 * Get a single resource query.
 * @param {string | number} id
 * @param {{ enabled?: boolean }} options
 * @returns {import("@tanstack/react-query").UseQueryResult<any>}
 */
export const useResource = (id, options = {}) =>
  useQuery({
    queryKey: [...RESOURCE_QUERY_KEY, "detail", id],
    queryFn: () => getResourceById(id),
    enabled: options.enabled ?? Boolean(id),
  });

/**
 * Create resource mutation.
 * @returns {import("@tanstack/react-query").UseMutationResult<any, any, { [key: string]: any }>}
 */
export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEY });
    },
  });
};

/**
 * Update resource mutation.
 * @returns {import("@tanstack/react-query").UseMutationResult<any, any, { id: string | number, data: { [key: string]: any } }>}
 */
export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEY });
    },
  });
};

/**
 * Delete resource mutation.
 * @returns {import("@tanstack/react-query").UseMutationResult<any, any, { id: string | number }>}
 */
export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEY });
    },
  });
};

/**
 * Convenience hook bundling resource queries and mutations.
 */
const useTemplate = () => ({
  listQuery: useResourceList(),
  createMutation: useCreateResource(),
  updateMutation: useUpdateResource(),
  deleteMutation: useDeleteResource(),
});

export default useTemplate;

