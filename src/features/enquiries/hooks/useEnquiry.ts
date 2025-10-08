// useEnquiry.ts
import { useQuery } from "@tanstack/react-query";
import { fetchEnquiry } from "../api/enquiriesApi";
import { EnquiryResponseDto } from "../types";

export function useEnquiry(id: number) {
  return useQuery<EnquiryResponseDto>({
    queryKey: ["enquiry", id],
    queryFn: () => fetchEnquiry(id),
    enabled: !!id,
  });
}

