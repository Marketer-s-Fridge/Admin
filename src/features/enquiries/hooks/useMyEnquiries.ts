// useMyEnquiries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchMyEnquiries } from "../api/enquiriesApi";
import { PaginatedResponse, EnquiryResponseDto } from "../types";

export function useMyEnquiries(page: number, size: number, sortBy?: string, direction?: "asc" | "desc") {
  return useQuery<PaginatedResponse<EnquiryResponseDto>>({
    queryKey: ["myEnquiries", page, size, sortBy, direction],
    queryFn: () => fetchMyEnquiries(page, size, sortBy, direction),
  });
}
