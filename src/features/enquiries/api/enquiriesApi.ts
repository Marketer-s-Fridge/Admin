import api from "@/lib/apiClient";
import { EnquiryRequestDto, EnquiryResponseDto, PaginatedResponse } from "../types";

// ✅ 전체 문의 조회
export const fetchEnquiries = async (
  page: number,
  size: number,
  sortBy?: string,
  direction?: "asc" | "desc"
): Promise<PaginatedResponse<EnquiryResponseDto>> => {
  console.log("📋 [전체 문의 조회 요청]", { page, size, sortBy, direction });
  try {
    const res = await api.get<PaginatedResponse<EnquiryResponseDto>>("/enquiries", {
      params: { page, size, sortBy, direction },
    });
    console.log("✅ [전체 문의 조회 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [전체 문의 조회 실패]", error);
    throw error;
  }
};

// ✅ 내 문의 조회
export const fetchMyEnquiries = async (
  page: number,
  size: number,
  sortBy?: string,
  direction?: "asc" | "desc"
): Promise<PaginatedResponse<EnquiryResponseDto>> => {
  console.log("🧍 [내 문의 조회 요청]", { page, size, sortBy, direction });
  try {
    const res = await api.get<PaginatedResponse<EnquiryResponseDto>>("/enquiries/my", {
      params: { page, size, sortBy, direction },
    });
    console.log("✅ [내 문의 조회 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [내 문의 조회 실패]", error);
    throw error;
  }
};

// ✅ 특정 문의 상세 조회
export const fetchEnquiry = async (id: number): Promise<EnquiryResponseDto> => {
  console.log(`📄 [문의 상세 조회 요청] ID=${id}`);
  try {
    const res = await api.get<EnquiryResponseDto>(`/enquiries/${id}`);
    console.log("✅ [문의 상세 조회 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [문의 상세 조회 실패]", error);
    throw error;
  }
};

// ✅ 문의 작성
export const createEnquiry = async (dto: EnquiryRequestDto): Promise<EnquiryResponseDto> => {
  console.log("📝 [문의 작성 요청]", dto);
  try {
    const res = await api.post<EnquiryResponseDto>("/enquiries", dto);
    console.log("✅ [문의 작성 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [문의 작성 실패]", error);
    throw error;
  }
};

// ✅ 문의 수정
export const updateEnquiry = async (
  id: number,
  dto: EnquiryRequestDto
): Promise<EnquiryResponseDto> => {
  console.log(`✏️ [문의 수정 요청] ID=${id}`, dto);
  try {
    const res = await api.put<EnquiryResponseDto>(`/enquiries/${id}`, dto);
    console.log("✅ [문의 수정 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [문의 수정 실패]", error);
    throw error;
  }
};

// ✅ 문의 삭제
export const deleteEnquiry = async (id: number): Promise<void> => {
  console.log(`🗑️ [문의 삭제 요청] ID=${id}`);
  try {
    await api.delete(`/enquiries/${id}`);
    console.log("✅ [문의 삭제 성공]");
  } catch (error) {
    console.error("🚨 [문의 삭제 실패]", error);
    throw error;
  }
};
