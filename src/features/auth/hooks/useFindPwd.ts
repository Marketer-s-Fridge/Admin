// useFindPw.ts
import { useQuery } from "@tanstack/react-query";
import { findPw } from "../api/authApi";

export function useFindPw(id: string, email: string) {
  return useQuery<string>({
    queryKey: ["findPw", id, email],
    queryFn: () => findPw(id, email),
    enabled: !!id && !!email,
  });
}
