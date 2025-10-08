// useDeleteEnquiry.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEnquiry } from "../api/enquiriesApi";

export function useDeleteEnquiry() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["myEnquiries"] });
    },
  });
}
