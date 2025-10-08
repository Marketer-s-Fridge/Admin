// useIncreaseHit.ts
import { useMutation } from "@tanstack/react-query";
import { increaseHit } from "../api/postsApi";
import { PostHitResponseDto } from "../types";

export function useIncreaseHit() {
  return useMutation<PostHitResponseDto, Error, number>({
    mutationFn: increaseHit,
  });
}
