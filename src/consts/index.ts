import type { Granularity, LineStyle } from "../types/abTest";

export const options: { value: LineStyle; label: string }[] = [
  { value: "line", label: "Ломаная" },
  { value: "smooth", label: "Сглаженная" },
  { value: "area", label: "Область" },
];

export const optionsGranul: Granularity[] = ["day", "week"];
