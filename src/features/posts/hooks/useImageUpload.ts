// src/features/posts/hooks/useImageUpload.ts
import { useMutation } from "@tanstack/react-query";
import { uploadSingleImage } from "@/lib/upload";

export function useImageUpload() {
  return useMutation({
    mutationFn: uploadSingleImage,
  });
}
