import { useRouter } from "next/navigation";
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
];

const MobileMenu = ({ menuOpen, setMenuOpen }: MobileMenuProps) => {
  const router = useRouter();

  return (
    <div
      className={`fixed inset-0 z-100 transition-all duration-300 ${
        menuOpen ? "bg-black/40" : "bg-transparent pointer-events-none"
      }`}
    >
      <aside
        className={`bg-white w-64 p-6 space-y-8 h-full shadow-md transform transition-all duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="text-right block ml-auto mb-4"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>
        <ul className="space-y-10 text-sm font-bold">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                router.push(item.path);
                setMenuOpen(false);
              }}
            >
              {/* <Image
                alt={item.label}
                src={item.icon}
                width={24}
                height={24}
                className="w-5 aspect-square"
              /> */}
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default MobileMenu;
