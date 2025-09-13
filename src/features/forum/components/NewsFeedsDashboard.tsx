// src/features/.../components/NewsFeedsDashboard.tsx
import React, { useState } from "react";

// MUI icons (chỉ icons, không dùng component khác)
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PostModal from "./PostModal";

export type ItemKey = "Feed" | "Khám Phá" | "Marketplace" | "Profile";

type Props = {
  active?: ItemKey;
  onChange?: (key: ItemKey) => void;
};

const ITEMS: { key: ItemKey; label: string; Icon: React.ElementType }[] = [
  { key: "Feed", label: "Feed", Icon: HomeRoundedIcon },
  { key: "Khám Phá", label: "Khám Phá", Icon: TravelExploreIcon },
  { key: "Marketplace", label: "Marketplace", Icon: StorefrontIcon },
  { key: "Profile", label: "Profile", Icon: PersonOutlineIcon },
];

const NewsFeedsDashboard: React.FC<Props> = ({
  active = "Feed",
  onChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý modal

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="w-full">
      <nav className="flex flex-col gap-1.5">
        {ITEMS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange?.(key)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition
                ${isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50 text-gray-700"}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                sx={{
                  fontSize: 20, // 👈 nhỏ gọn, không phá bố cục
                  color: isActive ? "#2F80ED" : "#4B5563",
                }}
              />
              <span
                className={`font-medium ${isActive ? "text-indigo-700" : "text-gray-800"}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Nút Create Post gọn, không to quá */}
      <button
        type="button"
        className="mt-4 w-full rounded-lg py-2.5 text-white text-sm font-semibold shadow
                   bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:opacity-95
                   focus:outline-none focus:ring-2 focus:ring-indigo-300
                   inline-flex items-center justify-center gap-2"
        style={{
          position: "relative",
          width: "100%",
          borderRadius: 12,
          background: "linear-gradient(180deg,#38bdf8 0%,#2563eb 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.06)",
          minHeight: 50,
        }}
        onClick={handleOpenModal}
      >
        <AddCircleOutlineIcon
          sx={{ fontSize: 35 }}
          style={{ paddingRight: 5 }}
        />
        Thêm bài viết
      </button>
      {isModalOpen && <PostModal onClose={handleCloseModal} />}
    </div>
  );
};

export default NewsFeedsDashboard;
