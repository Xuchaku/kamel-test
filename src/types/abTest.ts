export type VariationId = string;

export interface Variation {
  id: VariationId;
  name: string;
  color: string;
}

export interface RawVariation {
  id?: number;
  name: string;
}

export interface RawDataPoint {
  date: string;
  visits: Partial<Record<string, number>>;
  conversions: Partial<Record<string, number>>;
}

export interface VariationMetrics {
  visits: number | null;
  conversions: number | null;
  rate: number | null;
}

export interface ChartPoint {
  id: string;
  date: Date;
  label: string;
  tooltipLabel: string;
  rangeLabel?: string;
  values: Record<VariationId, number | null>;
  meta: Record<VariationId, VariationMetrics>;
}

export interface TooltipProps {
  active?: boolean;
  payload?: {
    dataKey: string | number;
    value?: number | null;
    color: string;
    payload: ChartPoint;
  }[];
  getName: (id: VariationId) => string;
}

export type Granularity = "day" | "week";

export type LineStyle = "line" | "smooth" | "area";
