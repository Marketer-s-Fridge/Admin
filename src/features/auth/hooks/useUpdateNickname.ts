import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNickname } from "../api/authApi";


export function useUpdateNickname() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (nickname: string) => updateNickname(nickname),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}
