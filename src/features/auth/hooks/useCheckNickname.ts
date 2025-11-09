import { useQuery } from "@tanstack/react-query";
import { checkNickname } from "../api/authApi";
// import { checkNickname } from "@/features/user/api/authApi";


export function useCheckNickname(nickname: string) {
  const normalized = (nickname ?? "").trim();
  return useQuery({
    queryKey: ["nicknameDup", normalized],
    queryFn: () => checkNickname(normalized),
    enabled: false,            // 버튼으로 refetch
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}
