/*
Functions with no side effects.
formatTime(clockFormat, date)
*/
export function formatTime(dateString: string, clockFormat: "12h" | "24h") {
  const date = new Date(dateString);

  if (clockFormat === "24h") {
    return date.toLocaleTimeString("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
