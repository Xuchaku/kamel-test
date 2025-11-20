import { useMemo, type ReactElement } from "react";
import { ResponsiveContainer } from "recharts";
import type {
  ChartPoint,
  LineStyle,
  Variation,
  VariationId,
} from "../../types/abTest";
import { Box } from "@mui/material";
import { sxStyle } from "./style";
import { chooseGraphic, renderSeries } from "../../utils/renderMetric";

interface ConversionChartProps {
  data: ChartPoint[];
  variations: Variation[];
  selected: VariationId[];
  lineStyle?: LineStyle;
  chartRef?: React.RefObject<HTMLDivElement | null>;
}

export const ConversionChart = ({
  data,
  variations,
  selected,
  lineStyle = "line",
  chartRef,
}: ConversionChartProps) => {
  const variationLookup = useMemo(
    () =>
      variations.reduce<Record<VariationId, Variation>>((acc, variation) => {
        acc[variation.id] = variation;
        return acc;
      }, {}),
    [variations]
  );

  const chartProps = useMemo(
    () => ({
      data,
      margin: { top: 16, right: 24, left: 8, bottom: 60 },
    }),
    [data]
  );

  const CONTENT: Record<LineStyle, ReactElement> = useMemo(() => {
    return chooseGraphic(
      variations,
      selected,
      lineStyle,
      renderSeries,
      chartProps,
      variationLookup
    );
  }, [chartProps, lineStyle, selected, variations, variationLookup]);

  return (
    <Box sx={sxStyle} ref={chartRef}>
      <ResponsiveContainer width="100%" height="100%">
        {CONTENT[lineStyle]}
      </ResponsiveContainer>
    </Box>
  );
};
