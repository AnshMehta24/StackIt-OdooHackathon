import { authService } from "@/services/auth";
import type { SuccessResponse } from "@/types";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export function useSignUp(
  options?: UseMutationOptions<SuccessResponse<null>, Error, FormData>
) {
  return useMutation({
    mutationKey: ["signUp"],
    mutationFn: authService.signUp,
    ...options,
  });
}

export function useSignIn(
  options?: UseMutationOptions<SuccessResponse<null>, Error, FormData>
) {
  return useMutation({
    mutationKey: ["signIn"],
    mutationFn: authService.signIn,
    ...options,
  });
}

export function useLogout(
  options?: UseMutationOptions<SuccessResponse<null>, Error>
) {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: authService.logOut,
    ...options,
  });
}
