// src/features/posts/hooks/useImageUpload.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadSingleImage, uploadBatchImages } from "@/lib/upload";

/** 단건 업로드 훅: File -> string */
export function useImageUpload() {
  return useMutation({
    mutationFn: uploadSingleImage,
  });
}

/** 여러 장 업로드 훅: File[] -> string[] */
export function useMultiImageUpload() {
  return useMutation({
    mutationFn: uploadBatchImages,
  });
}
