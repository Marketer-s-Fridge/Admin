// useFindId.ts
import { useQuery } from "@tanstack/react-query";
import { findId } from "../api/authApi";
import { UserResponseDto } from "../types";

export function useFindId(name: string, email: string) {
  return useQuery<UserResponseDto>({
    queryKey: ["findId", name, email],
    queryFn: () => findId(name, email),
    enabled: !!name && !!email,
  });
}
