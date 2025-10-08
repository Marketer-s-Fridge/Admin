
// useSignup.ts
import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/authApi";
import { SignupRequestDto } from "../types";

export function useSignup() {
  return useMutation<string, Error, SignupRequestDto>({
    mutationFn: signup,
  });
}
