// src/features/.../components/Ads.tsx
import React, { useEffect, useMemo, useState } from "react";

type AdItem = {
  id: string | number;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  time: string;
};

const defaultAds: AdItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop",
    category: "PETCARE",
    title: "Giảm 30% gói bảo hiểm thú cưng",
    excerpt:
      "Bảo vệ thú cưng toàn diện, bồi thường nhanh – đối tác nhiều phòng khám.",
    time: "7:00 AM | April 14",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop",
    category: "VOUCHER",
    title: "Tặng voucher tiêm phòng khi nhận nuôi",
    excerpt:
      "Chương trình nhận nuôi có trách nhiệm – miễn phí chip ID và sổ sức khỏe.",
    time: "7:00 AM | April 14",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop",
    category: "HEALTH",
    title: "Khám tổng quát cho cún chỉ 199k",
    excerpt: "Gói kiểm tra 12 hạng mục, có kết quả trong ngày tại PetCare Clinic.",
    time: "7:00 AM | April 14",
  },
];

const categoryColor = (cat: string) => {
  const key = cat.toUpperCase();
  if (key === "FINANCE") return "text-rose-600";
  if (key === "POLITICS") return "text-indigo-600";
  if (key === "HEALTH") return "text-emerald-600";
  return "text-blue-600";
};

const Ads: React.FC<{
  items?: AdItem[];
  intervalMs?: number; // 3000ms mặc định
  pauseOnHover?: boolean;
}> = ({ items, intervalMs = 3000, pauseOnHover = true }) => {
  const data = useMemo(() => (items && items.length ? items : defaultAds), [items]);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-rotate
  useEffect(() => {
    if (paused || data.length <= 1) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % data.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [data.length, intervalMs, paused]);

  const cur = data[idx];

  return (
    <div
      className="w-full"
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      {/* Một item (cross-fade khi đổi) */}
      <div className="relative">
        <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 transition-opacity duration-300 ease-in-out opacity-100">
          {/* Thumbnail */}
          <div className="w-[92px] h-[64px] overflow-hidden rounded-md">
            <img
              src={cur.image}
              alt={cur.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="min-w-0">
            <div
              className={`text-[11px] font-extrabold tracking-wide ${categoryColor(
                cur.category
              )}`}
            >
              {cur.category.toUpperCase()}
            </div>
            <h5 className="mt-0.5 text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2">
              {cur.title}
            </h5>
            <p className="mt-0.5 text-sm text-gray-600 leading-snug line-clamp-2">
              {cur.excerpt}
            </p>
            <div className="mt-1 text-xs text-gray-400">{cur.time}</div>
          </div>
        </div>

        {/* Divider dưới item */}
        <div className="my-3 border-t border-gray-100" />

        {/* Dots điều hướng */}
        <div className="flex items-center justify-end gap-1.5">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Chuyển tới quảng cáo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-4 bg-gray-800" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ads;
