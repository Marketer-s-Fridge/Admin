// src/features/auth/hooks/useAuthStatus.ts
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "../api/authApi";
import type { UserResponseDto } from "../types";

export function useAuthStatus() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // 토큰 존재 여부는 동기적으로 확정
  const hasToken = useMemo(() => !!token, [token]);

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserResponseDto>({
    queryKey: ["myProfile"],
    queryFn: fetchUserInfo,
    enabled: hasToken,   // 토큰 있으면 바로 /auth/me 호출
    retry: false,
  });

  // 인증 실패 시 토큰 정리
  useEffect(() => {
    const status = (error as any)?.response?.status;
    if (isError && (status === 401 || status === 403)) {
      localStorage.removeItem("accessToken");
    }
  }, [isError, error]);

  // hasToken이 true이고 /auth/me가 401만 아니면 인증 상태로 본다
  const isAuthenticated = hasToken && !(isError && user == null);

  return { isAuthenticated, user, isLoading, isError, error, refetch };
}
