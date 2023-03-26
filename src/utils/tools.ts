export const tools = ["line", "rect"] as const;

export type Tool = typeof tools[number];
