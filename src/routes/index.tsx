import { createFileRoute } from "@tanstack/react-router";
import { BioEnergyPlatform } from "@/components/BioEnergyPlatform";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "生物能管平台｜全域能源运营中心" },
      { name: "description", content: "覆盖能源生产、原料、碳效、设备与经营的一体化生物能源管理平台。" },
      { property: "og:title", content: "生物能管平台｜全域能源运营中心" },
      { property: "og:description", content: "实时洞察生物能源全链路运行与绿色价值。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <BioEnergyPlatform />;
}
