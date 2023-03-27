export type Color = {
  name: string;
  hex: string;
};

export const colors: Color[] = [
  { name: "Neon Purple", hex: "#C724B1" },
  { name: "Andes Sky", hex: "#71DBD4" },
  { name: "Imperial Purple", hex: "#642F6C" },
  { name: "Explorer Blue", hex: "#58A7AF" },
  { name: "Filtered Light", hex: "#B3B0C4" },
  { name: "Magic Night", hex: "#3A3A59" },
  { name: "Fig Purple", hex: "#502B3A" },
  { name: "Punky Pink", hex: "#B04A5A" },
  { name: "Salmon Orange", hex: "#FF8D6D" },
  { name: "Grapefruit", hex: "#FF585D" },
  { name: "Orange Delight", hex: "#FFC658" },
  { name: "Pasta Luego", hex: "#F9E27D" },
];

export const fillColors: Color[] = [
  { name: "No fill", hex: "transparent" },
  ...colors,
];
