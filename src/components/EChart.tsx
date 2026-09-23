import { useEffect, useRef } from "react";
import type { EChartsType } from "echarts";

type EChartProps = {
  option: Record<string, unknown>;
  className?: string;
};

/**
 * Browser-only ECharts wrapper. `echarts` is imported dynamically inside an
 * effect so it never runs during SSR (the Worker runtime has no DOM).
 */
export function EChart({ option, className }: EChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<EChartsType | null>(null);
  const optionRef = useRef(option);
  optionRef.current = option;

  useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | undefined;

    void (async () => {
      const echarts = await import("echarts");
      if (disposed || !containerRef.current) return;
      const chart = echarts.init(containerRef.current, undefined, { renderer: "canvas" });
      chartRef.current = chart;
      chart.setOption(optionRef.current as never);
      resizeObserver = new ResizeObserver(() => chart.resize());
      resizeObserver.observe(containerRef.current);
    })();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option as never, true);
  }, [option]);

  return <div ref={containerRef} className={className} style={{ height: "100%", width: "100%" }} />;
}

export default EChart;
