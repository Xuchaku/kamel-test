import { useCallback, useMemo, useRef, useState } from "react";
import { ConversionChart } from "./components/ConversionChart/ConversionChart";
import { GranularityToggle } from "./components/GranularityToggle/GranularityToggle";
import { LineStyleSelector } from "./components/LineStyleSelector/LineStyleSelector";
import { VariationSelector } from "./components/VariationSelector/VariationSelector";
import { dailyRows, variations } from "./data/abTestData";
import type { Granularity, LineStyle, VariationId } from "./types/abTest";
import { buildChartData, getVisibleData } from "./utils/transformData";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Button, Stack } from "@mui/material";
import { handleExport } from "./utils/export";

const chartData = buildChartData(dailyRows, variations);

const App = () => {
  const [selectedVariations, setSelectedVariations] = useState<VariationId[]>(
    () => variations.map((variation) => variation.id)
  );
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [lineStyle, setLineStyle] = useState<LineStyle>("line");

  const chartRef = useRef<HTMLDivElement>(null);
  const currentData = chartData[granularity];

  const visibleData = useMemo(
    () => getVisibleData(currentData, selectedVariations),
    [currentData, selectedVariations]
  );

  const handleVariationToggle = useCallback(
    (id: VariationId) => () => {
      setSelectedVariations((prev) => {
        if (prev.includes(id)) {
          return prev.length === 1 ? prev : prev.filter((item) => item !== id);
        }
        return [...prev, id];
      });
    },
    []
  );

  return (
    <Stack p={2} maxWidth={1400} margin={"auto"}>
      <Stack direction={"column"} gap={2}>
        <Stack
          direction="row"
          gap={2}
          alignItems={"center"}
          justifyContent={"flex-start"}
        >
          <LineStyleSelector value={lineStyle} onChange={setLineStyle} />
          <VariationSelector
            variations={variations}
            selected={selectedVariations}
            onToggle={handleVariationToggle}
          />
          <GranularityToggle value={granularity} onChange={setGranularity} />
          <Button
            variant={"contained"}
            onClick={() => handleExport(chartRef)}
            startIcon={<FileUploadIcon />}
            sx={{ marginLeft: "auto" }}
          >
            Экспорт
          </Button>
        </Stack>
        <ConversionChart
          data={visibleData}
          variations={variations}
          selected={selectedVariations}
          lineStyle={lineStyle}
          chartRef={chartRef}
        />
      </Stack>
    </Stack>
  );
};

export default App;
