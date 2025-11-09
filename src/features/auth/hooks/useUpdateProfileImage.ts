import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileImage } from "../api/authApi";
// import { updateProfileImage } from "@/features/user/api/authApi";


export function useUpdateProfileImage() {
  const qc = useQueryClient();
  // 서버는 "이미 업로드된 이미지 URL"을 받는 구조로 가정
  return useMutation({
    mutationFn: (imageUrl: string) => updateProfileImage(imageUrl),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}
