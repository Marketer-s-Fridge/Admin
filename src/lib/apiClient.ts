import axios, { AxiosRequestHeaders } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true, // 쿠키/세션 인증 필요할 때 true
  headers: {
    "Content-Type": "application/json",
  } as AxiosRequestHeaders, // ✅ 타입 캐스팅 추가
});

// ✅ 요청 인터셉터 (토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (공통 에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⛔ 인증이 만료되었습니다. 다시 로그인해주세요.");
      // window.location.href = "/login"; // 필요 시 자동 로그아웃 처리
    } else if (error.response?.status === 403) {
      console.warn("🚫 접근 권한이 없습니다.");
    } else if (error.response?.status === 500) {
      console.error("💥 서버 내부 오류 발생:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
