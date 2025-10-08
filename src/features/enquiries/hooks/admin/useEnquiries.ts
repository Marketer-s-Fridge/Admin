// useEnquiries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchEnquiries } from "../../api/enquiriesApi";
import { PaginatedResponse, EnquiryResponseDto } from "../../types";

export function useEnquiries(page: number, size: number, sortBy?: string, direction?: "asc" | "desc") {
  return useQuery<PaginatedResponse<EnquiryResponseDto>>({
    queryKey: ["enquiries", page, size, sortBy, direction],
    queryFn: () => fetchEnquiries(page, size, sortBy, direction),
  });
}
