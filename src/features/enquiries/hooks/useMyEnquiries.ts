// src/features/enquiries/hooks/useMyEnquiries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchMyEnquiries } from "../api/enquiriesApi";
import { EnquiryResponseDto, PaginatedResponse } from "../types";

type Direction = "asc" | "desc";
type SortBy = "createdAt" | "updatedAt" | "title";

export function useMyEnquiries(
  page = 1,
  size = 10,
  sortBy: SortBy = "createdAt",
  direction: Direction = "desc"
) {
  return useQuery<
    EnquiryResponseDto[],                 // TQueryFnData: queryFn 실제 반환(배열)
    Error,                                // TError
    PaginatedResponse<EnquiryResponseDto> // TData: select 이후 최종 형태
  >({
    queryKey: ["myEnquiries", page, size, sortBy, direction],
    queryFn: () => fetchMyEnquiries(),    // ← 인자 없이 호출, 배열 반환
    select: (rows) => {
      const sorted = [...rows].sort((a, b) => {
        const av = a[sortBy] as unknown as string;
        const bv = b[sortBy] as unknown as string;
        const cmp = sortBy.includes("At")
          ? new Date(av).getTime() - new Date(bv).getTime()
          : av.localeCompare(bv);
        return direction === "asc" ? cmp : -cmp;
      });

      const totalElements = sorted.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const start = (page - 1) * size;

      return {
        content: sorted.slice(start, start + size),
        totalElements,
        totalPages,
        page,
        size,
      };
    },
  });
}
