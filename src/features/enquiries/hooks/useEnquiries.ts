// features/enquiries/hooks/useEnquiries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchEnquiries } from "../api/enquiriesApi";
import { EnquiryResponseDto } from "../types";

export function useEnquiries() {
  return useQuery<EnquiryResponseDto[]>({
    queryKey: ["enquiries"],
    queryFn: fetchEnquiries,
    staleTime: 10_000,
  });
}
