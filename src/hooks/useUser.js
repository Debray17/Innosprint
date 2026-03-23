// src/hooks/useUser.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../services/userService";

// TODO: Expand query keys once user list/detail endpoints exist.
export const USER_QUERY_KEY = ["users"];

/**
 * Create user mutation.
 * @returns {import("@tanstack/react-query").UseMutationResult<any, any, { payload: any, options?: { language?: "en" | "dz", headers?: Record<string, string> } }>}
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, options }) => createUser(payload, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};

export default useCreateUser;

