import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LineStyle, Variation, VariationId } from "../types/abTest";
import type { ReactElement } from "react";
import type { CartesianChartProps } from "recharts/types/util/types";
import { MetricTooltip } from "../components/MetricTooltip/MetricTooltip";

export const renderSeries =
  (variations: Variation[], selected: string[], lineStyle: LineStyle) =>
  (Component: typeof Line | typeof Area) =>
    variations
      .filter((variation) => selected.includes(variation.id))
      .map((variation) => {
        const props = {
          key: variation.id,
          dataKey: `values.${variation.id}`,
          stroke: variation.color,
          fill: variation.color,
          strokeWidth: 2.5,
          dot: false,
          isAnimationActive: false,
          connectNulls: false,
        };

        if (Component === Area) {
          return (
            <Area
              {...props}
              fillOpacity={0.15}
              type={lineStyle === "smooth" ? "monotone" : "linear"}
            />
          );
        }

        return (
          <Component
            {...props}
            type={
              lineStyle === "smooth"
                ? "monotone"
                : lineStyle === "line"
                ? "linear"
                : "step"
            }
          />
        );
      });

export const getName =
  (variations: Record<string, Variation>) => (id: VariationId) =>
    variations[id]?.name ?? id;
export const formatPercent = (value?: number | null) =>
  typeof value === "number" ? `${value.toFixed(2)}%` : "—";

export const extractVariationId = (dataKey: string | number): VariationId =>
  typeof dataKey === "string"
    ? (dataKey.split(".").pop() as VariationId)
    : String(dataKey);

export const chooseGraphic = (
  variations: Variation[],
  selected: string[],
  lineStyle: LineStyle,
  render: typeof renderSeries,
  chartProps: CartesianChartProps,
  variationLookup: Record<string, Variation>
) => {
  const smothAndLine: ReactElement = (
    <LineChart {...chartProps}>
      <CartesianGrid
        strokeDasharray="3 3"
        vertical={false}
        stroke="var(--grid-line)"
      />
      <XAxis
        dataKey="label"
        tick={{ fill: "var(--text-muted)", fontSize: 12 }}
        stroke="var(--border-subtle)"
      />
      <YAxis
        tickFormatter={(value: number) => `${value.toFixed(0)}%`}
        domain={["auto", "auto"]}
        tick={{ fill: "var(--text-muted)", fontSize: 12 }}
        stroke="var(--border-subtle)"
        width={48}
      />
      <Tooltip
        content={<MetricTooltip getName={getName(variationLookup)} />}
        cursor={{ stroke: "var(--cursor)", strokeWidth: 1 }}
        wrapperStyle={{ outline: "none" }}
      />
      {render(variations, selected, lineStyle)(Line)}
    </LineChart>
  );
  return {
    line: smothAndLine,
    smooth: smothAndLine,
    area: (
      <AreaChart {...chartProps}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--grid-line)"
        />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          stroke="var(--border-subtle)"
        />
        <YAxis
          tickFormatter={(value: number) => `${value.toFixed(0)}%`}
          domain={["auto", "auto"]}
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          stroke="var(--border-subtle)"
          width={48}
        />
        <Tooltip
          content={<MetricTooltip getName={getName(variationLookup)} />}
          cursor={{ stroke: "var(--cursor)", strokeWidth: 1 }}
          wrapperStyle={{ outline: "none" }}
        />
        {render(variations, selected, lineStyle)(Area)}
      </AreaChart>
    ),
  };
};
