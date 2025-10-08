// useCreateEnquiry.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEnquiry } from "../api/enquiriesApi";
import { EnquiryRequestDto, EnquiryResponseDto } from "../types";

export function useCreateEnquiry() {
  const queryClient = useQueryClient();

  return useMutation<EnquiryResponseDto, Error, EnquiryRequestDto>({
    mutationFn: createEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["myEnquiries"] });
    },
  });
}
