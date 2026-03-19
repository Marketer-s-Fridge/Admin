import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md rounded-lg border border-gray-200 p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          요청하신 페이지가 없거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          대시보드로 이동
        </Link>
      </div>
    </div>
  );
}
