// src/lib/upload.ts
import axios from "axios";

/** presign + S3 PUT + 공개 URL 반환 (단건 공통 로직) */
async function presignAndUpload(file: File): Promise<string> {
  const { data } = await axios.post("/api/uploads/presign", {
    contentType: file.type,
    size: file.size,
  });

  await axios.put(data.uploadUrl, file, {
    headers: data.headers ?? { "Content-Type": file.type },
  });

  // 쿼리스트링 제거한 공개 URL만 반환
  return data.uploadUrl.split("?")[0];
}

/** 🔹 단건 이미지 업로드 */
export async function uploadSingleImage(file: File) {
  return presignAndUpload(file);
}

/** 🔹 여러 장 이미지 업로드 (presign 여러 번 호출) */
export async function uploadBatchImages(files: File[]) {
  if (!files.length) return [];
  // 각 파일마다 presign + 업로드 병렬 실행
  return Promise.all(files.map((file) => presignAndUpload(file)));
}
