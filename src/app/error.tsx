"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: connect to your logging service if needed
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md rounded-lg border border-gray-200 p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          문제가 발생했습니다
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          잠시 후 다시 시도해 주세요. 계속되면 관리자에게 문의해 주세요.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
