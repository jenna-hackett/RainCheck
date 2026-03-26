export function formatTemp(value: number, unit: "celsius" | "fahrenheit") {
  const rounded = Math.round(value);
  const symbol = unit === "celsius" ? "°C" : "°F";
  return `${rounded}${symbol}`;
}
