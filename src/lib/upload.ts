// src/lib/upload.ts
import axios from "axios";

/** 단건 presign → S3 PUT → 공개 URL 반환 */
export async function uploadSingleImage(file: File) {
  const { data } = await axios.post("/api/uploads/presign", {
    contentType: file.type,
    size: file.size,
  });
  await axios.put(data.uploadUrl, file, {
    headers: data.headers ?? { "Content-Type": file.type },
  });
  return data.uploadUrl.split("?")[0];
}

/** 배치 presign → 병렬 PUT → 공개 URL 배열 반환 */
export async function uploadBatchImages(files: File[]) {
  if (!files.length) return [];
  const { data } = await axios.post("/api/uploads/presign-batch", {
    files: files.map((f) => ({ contentType: f.type, size: f.size })),
  });
  await Promise.all(
    data.uploads.map((u: any, i: number) =>
      axios.put(u.uploadUrl, files[i], {
        headers: u.headers ?? { "Content-Type": files[i].type },
      })
    )
  );
  return data.uploads.map((u: any) => u.uploadUrl.split("?")[0]);
}
