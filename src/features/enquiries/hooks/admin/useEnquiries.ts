import { useQuery } from "@tanstack/react-query";
import { fetchEnquiries } from "../../api/enquiriesApi";
import { EnquiryResponseDto, PaginatedResponse } from "../../types";

type Direction = "asc" | "desc";
type SortBy = "createdAt" | "updatedAt" | "title";

export function useEnquiries(
  page = 1,
  size = 10,
  sortBy: SortBy = "createdAt",
  direction: Direction = "desc"
) {
  return useQuery<
    EnquiryResponseDto[],                        // TQueryFnData: queryFn이 반환(배열)
    Error,                                       // TError
    PaginatedResponse<EnquiryResponseDto>        // TData: select 이후 최종 타입
  >({
    queryKey: ["enquiries", page, size, sortBy, direction],
    queryFn: () => fetchEnquiries(),             // 인자 없음. 배열 반환
    select: (rows) => {
      // 정렬
      const sorted = [...rows].sort((a, b) => {
        const av = a[sortBy] as unknown as string;
        const bv = b[sortBy] as unknown as string;
        const cmp = sortBy.includes("At")
          ? new Date(av).getTime() - new Date(bv).getTime()
          : av.localeCompare(bv);
        return direction === "asc" ? cmp : -cmp;
      });

      // 페이징
      const totalElements = sorted.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const start = (page - 1) * size;
      const content = sorted.slice(start, start + size);

      return { content, totalElements, totalPages, page, size };
    },
  });
}
