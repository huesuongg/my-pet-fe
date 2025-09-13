import React, { useEffect, useMemo, useState } from "react";

type Daily = {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max?: number[];
  apparent_temperature_max?: number[];
};

type Current = {
  temperature: number; // °C
  weathercode: number;
  apparent_temperature?: number; // °C
};

const WeatherSection: React.FC = () => {
  const [loc, setLoc] = useState<{ lat: number; lon: number } | null>(null);
  const [place, setPlace] = useState<string>("");
  const [current, setCurrent] = useState<Current | null>(null);
  const [daily, setDaily] = useState<Daily | null>(null);
  const [err, setErr] = useState<string>("");

  // Map Open-Meteo weathercode -> label & emoji
  const codeMap = useMemo(
    () => ({
      0: { label: "Sunny", icon: "☀️" },
      1: { label: "Mainly Clear", icon: "🌤️" },
      2: { label: "Partly Cloudy", icon: "⛅" },
      3: { label: "Overcast", icon: "☁️" },
      45: { label: "Fog", icon: "🌫️" },
      48: { label: "Fog", icon: "🌫️" },
      51: { label: "Light Drizzle", icon: "🌦️" },
      53: { label: "Drizzle", icon: "🌦️" },
      55: { label: "Heavy Drizzle", icon: "🌦️" },
      61: { label: "Light Rain", icon: "🌧️" },
      63: { label: "Rain", icon: "🌧️" },
      65: { label: "Heavy Rain", icon: "🌧️" },
      71: { label: "Light Snow", icon: "🌨️" },
      73: { label: "Snow", icon: "🌨️" },
      75: { label: "Heavy Snow", icon: "🌨️" },
      80: { label: "Rain Showers", icon: "🌧️" },
      81: { label: "Rain Showers", icon: "🌧️" },
      82: { label: "Heavy Showers", icon: "🌧️" },
      95: { label: "Thunderstorm", icon: "⛈️" },
      96: { label: "Thunder w/ hail", icon: "⛈️" },
      99: { label: "Thunder w/ hail", icon: "⛈️" },
    }),
    []
  );

  // 1) Lấy toạ độ GPS
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setErr("Trình duyệt không hỗ trợ GPS. Dùng vị trí mặc định Hà Nội.");
      setLoc({ lat: 21.0278, lon: 105.8342 });
      setTimeout(() => {
        setErr("");
        setPlace("Hà Nội");
      }, 3000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        setErr(
          "Không lấy được GPS (bạn có thể đang từ chối quyền). Dùng vị trí mặc định."
        );
        // fallback: Hà Nội
        setLoc({ lat: 21.0278, lon: 105.8342 });

        // sau 5s xoá lỗi và gán lại tiêu đề
        setTimeout(() => {
          setErr("");
          setPlace("Hà Nội");
        }, 5000);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // 2) Gọi Open-Meteo + reverse geocoding
  useEffect(() => {
    if (!loc) return;
    const run = async () => {
      try {
        const base = "https://api.open-meteo.com/v1/forecast";
        const qs = new URLSearchParams({
          latitude: String(loc.lat),
          longitude: String(loc.lon),
          current_weather: "true",
          hourly: "apparent_temperature,precipitation_probability",
          daily:
            "weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_probability_max",
          timezone: "auto",
        });
        const res = await fetch(`${base}?${qs.toString()}`);
        const data = await res.json();

        const cur: Current = {
          temperature: data.current_weather?.temperature ?? 0,
          weathercode: data.current_weather?.weathercode ?? 0,
          apparent_temperature:
            // lấy apparent_temperature gần nhất nếu có
            data.hourly?.apparent_temperature?.[
              data.hourly?.apparent_temperature?.length - 1
            ],
        };
        setCurrent(cur);
        setDaily(data.daily as Daily);

        // reverse geocoding để ra tên thành phố
        const rev = await fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${loc.lat}&longitude=${loc.lon}&language=vi`
        );
        const revData = await rev.json();
        const first = revData?.results?.[0];
        setPlace(
          first
            ? `${first.name}${first.admin1 ? ", " + first.admin1 : ""}${first.country ? ", " + first.country : ""}`
            : ""
        );
      } catch {
        // setErr("Không tải được dữ liệu thời tiết.");
      }
    };
    run();
  }, [loc]);

  const today = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const strip = useMemo(() => {
    if (!daily) return [];
    const items: { d: string; icon: string; t: string }[] = [];
    for (let i = 0; i < Math.min(6, daily.time.length); i++) {
      const code = daily.weathercode[i];
      const def = codeMap[code as keyof typeof codeMap] ?? {
        label: "N/A",
        icon: "❓",
      };
      const date = new Date(daily.time[i] + "T00:00:00");
      const day = date
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      items.push({
        d: day,
        icon: def.icon,
        t: `${Math.round(daily.temperature_2m_max[i])}°`,
      });
    }
    return items;
  }, [daily, codeMap]);

  const main = useMemo(() => {
    if (!current)
      return { temp: "--", label: "", icon: "❓", feel: "--", rain: "--" };
    const def = codeMap[current.weathercode as keyof typeof codeMap] ?? {
      label: "—",
      icon: "❓",
    };
    const feel =
      current.apparent_temperature != null
        ? Math.round(current.apparent_temperature) + "°"
        : Math.round(current.temperature) + "°";
    const rain =
      daily?.precipitation_probability_max?.[0] != null
        ? `${daily.precipitation_probability_max[0]}%`
        : "—";
    return {
      temp: Math.round(current.temperature) + "°",
      label: def.label,
      icon: def.icon,
      feel,
      rain,
    };
  }, [current, daily, codeMap]);

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: 12,
          padding: 16,
          color: "#fff",
          background: "linear-gradient(180deg,#38bdf8 0%,#2563eb 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.06)",
          minHeight: 240,
        }}
      >
        {/* menu */}
        <button
          type="button"
          aria-label="More"
          title="More"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: "9999px",
            background: "transparent",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          ⋮
        </button>

        {/* loading / error */}
        {!current && !err && (
          <div
            style={{ textAlign: "center", padding: "24px 0", opacity: 0.95 }}
          >
            Đang tải thời tiết…
          </div>
        )}
        {err && (
          <div
            style={{
              textAlign: "center",
              padding: "8px 0",
              background: "rgba(0,0,0,.15)",
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            {err}
          </div>
        )}

        {/* main temperature */}
        {current && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1 }}>
              {main.temp}
            </div>
            <div style={{ fontSize: 32, marginTop: 4 }}>{main.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
              {main.label}
            </div>
            <div style={{ fontSize: 14, marginTop: 8 }}>
              Real Feel: <strong>{main.feel}</strong> • Rain Chance:{" "}
              <strong>{main.rain}</strong>
            </div>
          </div>
        )}

        {/* 6-day forecast */}
        {strip.length > 0 && (
          <div
            style={{
              marginTop: 16,
              background: "rgba(255,255,255,.2)",
              borderRadius: 10,
              padding: "8px 10px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 8,
                alignItems: "center",
              }}
            >
              {strip.map((i) => (
                <div
                  key={i.d}
                  style={{ textAlign: "center", padding: "4px 0" }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.3,
                    }}
                  >
                    {i.d}
                  </div>
                  <div style={{ fontSize: 18, margin: "4px 0" }}>{i.icon}</div>
                  <div style={{ fontSize: 12 }}>{i.t}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* date & location */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div style={{ fontWeight: 700 }}>{today}</div>
          <div style={{ fontSize: 16, opacity: 0.95, marginTop: 4 }}>
            📍{" "}
            {place ||
              (loc ? `${loc.lat.toFixed(2)}, ${loc.lon.toFixed(2)}` : "")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherSection;
