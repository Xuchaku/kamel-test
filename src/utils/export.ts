import html2canvas from "html2canvas";

export const handleExport = async (
  chartRef: React.RefObject<HTMLDivElement | null>
) => {
  if (!chartRef.current) return;

  chartRef.current.setAttribute("data-exporting", "true");

  try {
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: "#020617",
      scale: 2,
    });
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `conversion-chart-${new Date().getTime()}.png`;
    link.href = url;
    link.click();
  } catch (error) {
    console.error("Failed to export chart:", error);
  } finally {
    chartRef.current.removeAttribute("data-exporting");
  }
};
