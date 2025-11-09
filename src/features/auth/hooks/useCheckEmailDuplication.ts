// useCheckEmailDuplication.ts
import { useQuery } from "@tanstack/react-query";
import { checkEmailDuplication } from "../api/authApi";

export function useCheckEmailDuplication(email: string) {
  const normalized = (email ?? "").trim().toLowerCase();
  return useQuery({
    queryKey: ["emailDuplication", normalized],
    queryFn: () => checkEmailDuplication(normalized),
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}