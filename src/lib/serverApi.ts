import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const buildUrl = (path: string) => {
  if (API_BASE && API_BASE !== "/") {
    return `${API_BASE.replace(/\/$/, "")}${path}`;
  }
  return path;
};

type ServerGetOptions = {
  revalidate?: number;
};

export const serverGet = async <T>(
  path: string,
  options: ServerGetOptions = {}
): Promise<T> => {
  const token = cookies().get("accessToken")?.value;

  const res = await fetch(buildUrl(path), {
    method: "GET",
    headers: token
      ? {
          Authorization: `Bearer ${decodeURIComponent(token)}`,
        }
      : undefined,
    // Admin 데이터는 유저별로 다를 수 있어 SSR 우선.
    // 필요하면 호출부에서 revalidate 값을 지정.
    next:
      typeof options.revalidate === "number"
        ? { revalidate: options.revalidate }
        : undefined,
  });

  if (!res.ok) {
    throw new Error(`Server GET failed: ${path} (${res.status})`);
  }

  return (await res.json()) as T;
};
