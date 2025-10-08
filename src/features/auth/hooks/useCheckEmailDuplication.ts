// useCheckEmailDuplication.ts
import { useQuery } from "@tanstack/react-query";
import { checkEmailDuplication } from "../api/authApi";

export function useCheckEmailDuplication(email: string) {
  return useQuery<boolean>({
    queryKey: ["emailDuplication", email],
    queryFn: () => checkEmailDuplication(email),
    enabled: !!email, // email이 있을 때만 실행
  });
}
