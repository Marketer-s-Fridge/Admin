// 공통 래퍼
export type ApiResponse<T> = {
  success: boolean;   // true/false
  code: string;       // "OK" 등
  data: T;            // 실제 페이로드
};

// 요청 DTO
export interface SignupRequestDto {
  id: string;
  pw: string;
  email: string;
  name: string;
  birthday?: string;  // "YYYY-MM-DD" 가정
  phone?: string;     // 하이픈 포함 문자열 가정
  nickname?: string;
}

export interface SigninRequestDto {
  id: string;
  pw: string;
}

// 응답 DTO
export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  birthday?: string;
  phone?: string;
  createdAt?: string; // 서버가 주면 사용, 아니면 무시
  profileImageUrl?: string;
}

// 엔드포인트별 전용 페이로드
export type SigninData = { token: string };     // /auth/signin
export type FindIdResponse = { id: string };    // /auth/signin/find_id
export type FindPwResponse = string;            // /auth/signin/find_pw: 메일 발송 결과 문자열
export type DuplicationCheckResponse = "Successful" | "Failed";
