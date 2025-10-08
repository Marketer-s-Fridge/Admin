import api from "@/lib/apiClient";
import { SignupRequestDto, SigninRequestDto, UserResponseDto } from "../types";

// ✅ 회원가입
export const signup = async (dto: SignupRequestDto): Promise<string> => {
  const res = await api.post<string>("/auth/signup", dto);
  return res.data; // 성공/실패 여부 (Successful / Failed)
};

// ✅ 이메일 중복 체크
export const checkEmailDuplication = async (email: string): Promise<boolean> => {
  const res = await api.get<boolean>("/auth/signup/email_duplication_check", {
    params: { email },
  });
  return res.data; // true/false
};

// ✅ 로그인
export const signin = async (dto: SigninRequestDto): Promise<UserResponseDto> => {
  const res = await api.post<UserResponseDto>("/auth/signin", dto);
  return res.data;
};

// ✅ 아이디 찾기
export const findId = async (name: string, email: string): Promise<UserResponseDto> => {
  const res = await api.get<UserResponseDto>("/auth/signin/find_id", {
    params: { name, email },
  });
  return res.data;
};

// ✅ 비밀번호 찾기
export const findPw = async (id: string, email: string): Promise<string> => {
  const res = await api.get<string>("/auth/signin/find_pw", {
    params: { id, email },
  });
  return res.data; // 성공/실패 메시지
};
