export const tools = ["line", "rect", "circle", "ellipse"] as const;

export type Tool = typeof tools[number];
