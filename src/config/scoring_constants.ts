// scoringConstants.ts - Score bands and color mappings
export const SCORE_BANDS = [
  { min: 0, label: "WHITE", bg: "#ffffff", text: "text-gray-900", category: "needs attention" },
  { min: 49, label: "WHITE", bg: "#ffffff", text: "text-gray-900", category: "needs attention" },
  { min: 60, label: "YELLOW", bg: "#ffff00", text: "text-gray-900", category: "needs attention" },
  { min: 70, label: "ORANGE", bg: "#ffa500", text: "text-gray-900", category: "needs support" },
  { min: 80, label: "BLUE", bg: "#0000ff", text: "text-white", category: "needs support" },
  { min: 90, label: "PURPLE", bg: "#800080", text: "text-white", category: "needs support" },
  { min: 98, label: "BROWN", bg: "#8B4513", text: "text-white", category: "optimal" },
  { min: 99, label: "BLACK", bg: "#000000", text: "text-white", category: "optimal" },
  { min: 100, label: "RED", bg: "#ff0000", text: "text-white", category: "optimal" },
];

export function colorLabel(color: string) {
  switch ((color || "").toLowerCase()) {
    case "blue":
    case "green":
      return { text: "In range", className: "bg-gray-100 text-gray-800" };
    case "yellow":
      return { text: "Borderline", className: "bg-gray-100 text-gray-800" };
    case "red":
      return { text: "Out of range", className: "bg-gray-100 text-gray-800" };
    default:
      return { text: "No data", className: "bg-gray-100 text-gray-600" };
  }
}