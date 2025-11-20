import { Box, Stack, Typography } from "@mui/material";
import type { TooltipProps } from "../../types/abTest";
import { extractVariationId, formatPercent } from "../../utils/renderMetric";

export const MetricTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <Stack bgcolor={"#141416ff"} p={1.5} borderRadius={1}>
      <Stack>
        <Typography>{point.tooltipLabel}</Typography>
        {point.rangeLabel && <Typography>{point.rangeLabel}</Typography>}
      </Stack>
      <Stack direction={"column"} gap={0.5}>
        {payload.map((entry) => {
          const variationId = extractVariationId(entry.dataKey);
          const variationMeta = point.meta[variationId];

          return (
            <Box key={variationId} bgcolor={entry.color} borderRadius={2} p={1}>
              <Box>
                <Typography fontWeight={"bold"}>
                  {formatPercent(entry.value)}
                </Typography>
                {variationMeta && (
                  <Typography variant="subtitle2">
                    {variationMeta.conversions ?? "—"} конверсия{" "}
                    {variationMeta.visits ?? "—"} визитов
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};
