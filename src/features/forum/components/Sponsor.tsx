// src/features/.../components/Sponsor.tsx
import React, { useEffect, useMemo, useState } from "react";

type SponsorItem = {
  id: string | number;
  image: string;
  title: string;
  description: string;
  label?: string; // mặc định "Sponsored"
};

const defaultItems: SponsorItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    title: "Email marketing",
    description:
      "Supercharge your marketing with a powerful, easy-to-use platform built for results.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    title: "Analytics Suite",
    description:
      "Understand users with funnels, retention, and cohorts. Get insights in minutes.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    title: "Developer Tools",
    description:
      "Ship faster with CI/CD, preview deployments, and built-in performance checks.",
  },
];

const Sponsor: React.FC<{ items?: SponsorItem[]; intervalMs?: number }> = ({
  items,
  intervalMs = 5000,
}) => {
  const data = useMemo(
    () => (items && items.length ? items : defaultItems),
    [items]
  );
  const [idx, setIdx] = useState(0);

  // Auto-rotate
  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % data.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [data.length, intervalMs]);

  const goTo = (i: number) => setIdx(i % data.length);

  const cur = data[idx];

  return (
    <div className="w-full">
      <div className="bg-white p-3 rounded-lg shadow-md">
        {/* Label */}
        <div className="text-lg font-medium text-gray-500 mb-2">Sponsored</div>

        {/* Image */}
        <div className="relative overflow-hidden rounded-xl">
          {/* giữ tỉ lệ & tránh giật layout */}
          <div className="aspect-[16/10] w-full">
            <img
              src={cur.image}
              alt={cur.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Dots */}
          <div className="absolute bottom-2 right-2 flex gap-1.5">
            {data.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-4 bg-white" : "w-2 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <h4 className="mt-3 text-base font-semibold text-gray-900">
          {cur.title}
        </h4>

        {/* Description */}
        <p className="mt-1 text-sm text-gray-500 leading-relaxed">
          {cur.description}
        </p>
      </div>
    </div>
  );
};

export default Sponsor;
