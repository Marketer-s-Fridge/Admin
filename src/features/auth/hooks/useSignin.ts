// useSignin.ts
import { useMutation } from "@tanstack/react-query";
import { signin } from "../api/authApi";
import { SigninRequestDto, UserResponseDto } from "../types";

export function useSignin() {
  return useMutation<string, Error, SigninRequestDto>({
    mutationFn: signin,
  });
}
