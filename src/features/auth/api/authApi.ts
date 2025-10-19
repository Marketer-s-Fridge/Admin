import axios from "axios";
import { SignupRequestDto, SigninRequestDto, UserResponseDto } from "../types";

/** ✅ Axios 인스턴스 설정 */
const api = axios.create({
  baseURL: "/", // 👈 프록시/리라이트를 통해 백엔드로 연결됨
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/** ✅ 요청 & 응답 로그 (선택 사항) */
api.interceptors.request.use((config) => {
  console.log(`📡 [요청] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log(`✅ [응답 성공 ${res.status}]`, res.data);
    return res;
  },
  (err) => {
    console.error(
      `❌ [응답 오류 ${err.response?.status}]`,
      err.response?.data || err.message
    );
    return Promise.reject(err);
  }
);

/** ✅ 회원가입 */
export const signup = async (dto: SignupRequestDto): Promise<string> => {
  const res = await api.post<string>("/auth/signup", dto);
  return res.data;
};

/** ✅ 이메일 중복 체크 */
export const checkEmailDuplication = async (email: string): Promise<boolean> => {
  const res = await api.get<boolean>("/auth/signup/email_duplication_check", {
    params: { email },
  });
  return res.data;
};

/** ✅ 로그인 */
export const signin = async (dto: SigninRequestDto): Promise<UserResponseDto> => {
  const res = await api.post<UserResponseDto>("/auth/signin", dto);
  return res.data;
};

/** ✅ 아이디 찾기 */
export const findId = async (
  name: string,
  email: string
): Promise<UserResponseDto> => {
  const res = await api.get<UserResponseDto>("/auth/signin/find_id", {
    params: { name, email },
  });
  return res.data;
};

/** ✅ 비밀번호 찾기 */
export const findPw = async (id: string, email: string): Promise<string> => {
  const res = await api.get<string>("/auth/signin/find_pw", {
    params: { id, email },
  });
  return res.data;
};
