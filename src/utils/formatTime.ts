export function formatTime(date: Date | string, clockFormat: "12h" | "24h") {
  const d = typeof date === "string" ? new Date(date) : date;

  if (clockFormat === "24h") {
    return d.toLocaleTimeString("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
