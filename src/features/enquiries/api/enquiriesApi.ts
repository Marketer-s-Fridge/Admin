import api from "@/lib/apiClient";
import { EnquiryRequestDto, EnquiryResponseDto } from "../types";
// 타입 통일
export type SortOrder = 'asc' | 'desc';

export type MyEnquiryParams = {
  page?: number;
  size?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: SortOrder; // 소문자
};

/** ✅ 내 문의 조회 (단순 List 응답) */
export const fetchMyEnquiries = async (): Promise<EnquiryResponseDto[]> => {
  console.log("🙋‍♀️ [내 문의 목록 조회 요청]");
  try {
    const res = await api.get<EnquiryResponseDto[]>("/api/enquiries/my");
    console.log("✅ [내 문의 목록 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [내 문의 목록 조회 실패]:", error);
    throw error;
  }
};


/** ✅ 전체 문의 조회 (스펙: 파라미터 없음, List 반환) */
export const fetchEnquiries = async (): Promise<EnquiryResponseDto[]> => {
  console.log("📋 [전체 문의 조회 요청]");
  try {
    const res = await api.get<EnquiryResponseDto[]>("/api/enquiries");
    console.log("✅ [전체 문의 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [전체 문의 조회 실패]:", error);
    throw error;
  }
};


/** ✅ 특정 문의 상세 조회 (스펙: 200 단건) */
export const fetchEnquiry = async (id: number): Promise<EnquiryResponseDto> => {
  console.log(`🔍 [문의 상세 조회 요청] enquiryId=${id}`);
  try {
    const res = await api.get<EnquiryResponseDto>(`/api/enquiries/${id}`);
    console.log("✅ [문의 상세 조회 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [문의 상세 조회 실패]:", error);
    throw error;
  }
};

/** ✅ 문의 작성 (스펙: Header 필요, Body: EnquiryRequestDto, 201) */
export const createEnquiry = async (dto: EnquiryRequestDto): Promise<EnquiryResponseDto> => {
  console.log("✉️ [문의 작성 요청]", dto);
  try {
    const res = await api.post<EnquiryResponseDto>("/api/enquiries", dto); // 토큰 필요
    console.log("✅ [문의 작성 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [문의 작성 실패]:", error);
    throw error;
  }
};

/** ✅ 문의 수정 (스펙: Path+JSON, 200) */
export const updateEnquiry = async (
  id: number,
  dto: EnquiryRequestDto
): Promise<EnquiryResponseDto> => {
  console.log(`🛠️ [문의 수정 요청] enquiryId=${id}`, dto);
  try {
    const res = await api.put<EnquiryResponseDto>(`/api/enquiries/${id}`, dto);
    console.log("✅ [문의 수정 성공]", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ [문의 수정 실패]:", error);
    throw error;
  }
};

/** ✅ 문의 삭제 (스펙: 204 No Content) */
export const deleteEnquiry = async (id: number): Promise<void> => {
  console.log(`🗑️ [문의 삭제 요청] enquiryId=${id}`);
  try {
    await api.delete(`/api/enquiries/${id}`); // ← 오타 수정
    console.log("✅ [문의 삭제 성공]");
  } catch (error: any) {
    console.error("❌ [문의 삭제 실패]:", error);
    throw error;
  }
};
