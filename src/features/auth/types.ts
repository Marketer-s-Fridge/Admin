
// 유저

export interface SignupRequestDto {
    id: string;
    pw: string;
    email: string;
    name: string;
    birthday?: string;
    phone?: string;
    nickname?: string;
  }
  
  export interface SigninRequestDto {
    id: string;
    pw: string;
  }
  
  export interface UserResponseDto {
    id: string;
    email: string;
    name: string;
    nickname?: string;
    birthday?: string;
    phone?: string;
    createdAt?: string;
  }
  