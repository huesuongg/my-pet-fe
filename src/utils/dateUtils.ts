export function formatDateTime(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  });
}
