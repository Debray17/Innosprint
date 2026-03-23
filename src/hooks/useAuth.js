// src/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  getCurrentUser as getCurrentUserRequest,
} from "../services/authService";
import { getStoredToken } from "../services/api";

export const AUTH_QUERY_KEY = ["auth", "currentUser"];

/**
 * Query the current authenticated user.
 * @param {{ enabled?: boolean }} options
 * @returns {import("@tanstack/react-query").UseQueryResult<any>}
 */
export const useCurrentUser = (options = {}) => {
  const hasToken = Boolean(getStoredToken());

  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getCurrentUserRequest,
    enabled: options.enabled ?? hasToken,
  });
};

/**
 * Login mutation.
 * @returns {import("@tanstack/react-query").UseMutationResult<{ token: string | null, data: any }, any, { username: string, password: string }>}
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
};

/**
 * Register mutation.
 * @returns {import("@tanstack/react-query").UseMutationResult<any, any, { username: string, password: string, [key: string]: any }>}
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: registerRequest,
  });
};

/**
 * Logout mutation.
 * @returns {import("@tanstack/react-query").UseMutationResult<void, any, void>}
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
};

/**
 * Convenience hook bundling auth queries and mutations.
 */
const useAuth = () => ({
  currentUserQuery: useCurrentUser(),
  loginMutation: useLogin(),
  registerMutation: useRegister(),
  logoutMutation: useLogout(),
});

export default useAuth;

