import { useRouter, usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const menuItems = [
  { label: "콘텐츠 업로드", path: "/admin/contentsUpload" },
  { label: "콘텐츠 관리", path: "/admin/contentsManagement" },
  { label: "임시 저장 리스트", path: "/admin/tempList" },
  { label: "업로드 예약", path: "/admin/scheduledUpload" },
  { label: "문의 답변 관리", path: "/admin/inquiryReplies" },
  { label: "통계 및 분석", path: "/admin/analytics" },
  { label: "홈으로 돌아가기", path: "/" },
];

const MobileMenu = ({ menuOpen, setMenuOpen }: MobileMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        menuOpen
          ? "bg-black/40 backdrop-blur-[2px]"
          : "bg-transparent pointer-events-none"
      }`}
      onClick={() => setMenuOpen(false)}
    >
      <aside
        className={`
          fixed top-0 left-0 h-full w-[260px] max-w-[80%]
          bg-white
          transition-transform duration-300 ease-out
          flex flex-col
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          ${menuOpen ? "shadow-2xl border-r border-gray-100" : "shadow-none border-r border-transparent"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-400 tracking-wide">
              ADMIN MENU
            </span>
            <span className="text-sm font-semibold text-gray-900">
              관리자 전용 메뉴
            </span>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* 메뉴 리스트 */}
        <ul className="flex-1 overflow-y-auto px-3 py-4 space-y-2 text-sm font-semibold">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <li key={item.label}>
                <button
                  onClick={() => handleClick(item.path)}
                  className={`
                    group w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-left
                    transition-colors duration-150
                    ${
                      isActive
                        ? "bg-red-50 text-red-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <span
                    className={`
                      h-6 w-0.5 rounded-full mr-1
                      ${
                        isActive
                          ? "bg-red-400"
                          : "bg-transparent group-hover:bg-gray-300"
                      }
                    `}
                  />
                  <span className="text-xs">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* 하단 카피 */}
        <div className="px-5 pb-4 pt-2 border-t border-gray-100">
          <span className="text-[10px] text-gray-400">
            © {new Date().getFullYear()} 관리자 페이지
          </span>
        </div>
      </aside>
    </div>
  );
};

export default MobileMenu;
