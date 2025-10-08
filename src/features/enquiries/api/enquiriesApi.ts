import api from "@/lib/apiClient";
import { EnquiryRequestDto, EnquiryResponseDto, PaginatedResponse } from "../types";

// ✅ 전체 문의 조회 (페이지네이션)
export const fetchEnquiries = async (
  page: number,
  size: number,
  sortBy?: string,
  direction?: "asc" | "desc"
): Promise<PaginatedResponse<EnquiryResponseDto>> => {
  const res = await api.get<PaginatedResponse<EnquiryResponseDto>>("/enquiries", {
    params: { page, size, sortBy, direction },
  });
  return res.data;
};

// ✅ 내 문의 조회 (페이지네이션)
export const fetchMyEnquiries = async (
  page: number,
  size: number,
  sortBy?: string,
  direction?: "asc" | "desc"
): Promise<PaginatedResponse<EnquiryResponseDto>> => {
  const res = await api.get<PaginatedResponse<EnquiryResponseDto>>("/enquiries/my", {
    params: { page, size, sortBy, direction },
  });
  return res.data;
};

// ✅ 특정 문의 상세 조회
export const fetchEnquiry = async (id: number): Promise<EnquiryResponseDto> => {
  const res = await api.get<EnquiryResponseDto>(`/enquiries/${id}`);
  return res.data;
};

// ✅ 문의 작성
export const createEnquiry = async (dto: EnquiryRequestDto): Promise<EnquiryResponseDto> => {
  const res = await api.post<EnquiryResponseDto>("/enquiries", dto);
  return res.data;
};

// ✅ 문의 수정
export const updateEnquiry = async (
  id: number,
  dto: EnquiryRequestDto
): Promise<EnquiryResponseDto> => {
  const res = await api.put<EnquiryResponseDto>(`/enquiries/${id}`, dto);
  return res.data;
};

// ✅ 문의 삭제
export const deleteEnquiry = async (id: number): Promise<void> => {
  await api.delete(`/enquiries/${id}`);
};
