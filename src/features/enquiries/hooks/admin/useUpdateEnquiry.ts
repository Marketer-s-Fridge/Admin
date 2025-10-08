// useUpdateEnquiry.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEnquiry } from "../../api/enquiriesApi";
import { EnquiryRequestDto, EnquiryResponseDto } from "../../types";

export function useUpdateEnquiry() {
  const queryClient = useQueryClient();

  return useMutation<EnquiryResponseDto, Error, { id: number; dto: EnquiryRequestDto }>({
    mutationFn: ({ id, dto }) => updateEnquiry(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["enquiry", data.id] });
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["myEnquiries"] });
    },
  });
}
