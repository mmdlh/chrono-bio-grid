import { useMemo, useState, type ReactNode } from "react";
import { EChart } from "@/components/EChart";
import {
  Activity,
  BellRing,
  Boxes,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  CloudCog,
  Droplets,
  Factory,
  Gauge,
  Leaf,
  Settings2,
  ShieldCheck,
  Sparkles,
  Thermometer,
  TrendingUp,
  TriangleAlert,
  Truck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import bioenergyBackground from "@/assets/bioenergy-command-bg.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewKey = "overview" | "production" | "materials" | "carbon" | "maintenance" | "business";

type ChartProps = { option: Record<string, unknown>; className?: string };

const chartColors = ["#39f3a2", "#26d9ef", "#ffce62", "#ff7c66", "#a98bff"];
const axisStyle = { axisLine: { lineStyle: { color: "rgba(147, 214, 203, .25)" } }, axisLabel: { color: "#91b8b0" }, splitLine: { lineStyle: { color: "rgba(147, 214, 203, .10)" } } };
const tooltip = { trigger: "axis", backgroundColor: "rgba(4, 25, 24, .92)", borderColor: "rgba(73, 243, 168, .45)", textStyle: { color: "#eafff8" } };
const topLegend = { top: 4, right: 10, textStyle: { color: "#a8c9c2" }, itemWidth: 14, itemHeight: 7 };

const navItems: { key: ViewKey; label: string; icon: LucideIcon }[] = [
  { key: "overview", label: "能源总览", icon: Gauge },
  { key: "production", label: "生产监控", icon: Factory },
  { key: "materials", label: "原料管理", icon: Boxes },
  { key: "carbon", label: "碳效分析", icon: Leaf },
  { key: "maintenance", label: "设备运维", icon: Wrench },
  { key: "business", label: "经营分析", icon: CircleDollarSign },
];

const pageInfo: Record<ViewKey, { eyebrow: string; title: string; summary: string }> = {
  overview: { eyebrow: "全域运行态势", title: "能源总览", summary: "聚合 12 座生物质能源站的实时产能、负荷与环境效益" },
  production: { eyebrow: "生产调度中心", title: "生产监控", summary: "洞察机组出力、蒸汽参数与全流程转化效率" },
  materials: { eyebrow: "供应链驾驶舱", title: "原料管理", summary: "追踪秸秆、林业废弃物与有机质的库存及热值" },
  carbon: { eyebrow: "绿色价值核算", title: "碳效分析", summary: "量化碳减排、替代化石能源与生态协同收益" },
  maintenance: { eyebrow: "智能设备中枢", title: "设备运维", summary: "预测故障风险，统筹检修计划与关键设备健康度" },
  business: { eyebrow: "经营决策中心", title: "经营分析", summary: "联动产量、成本与收益，识别高价值增长机会" },
};

function Chart({ option, className = "h-72" }: ChartProps) {
  return <EChart option={{ animationDuration: 900, color: chartColors, ...option }} className={className} />;
}

function GlassPanel({ title, subtitle, action, className, children }: { title: string; subtitle?: string; action?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={cn("glass-panel group relative min-w-0 overflow-hidden", className)}>
      <div className="panel-shimmer" aria-hidden="true" />
      <header className="relative z-10 mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action}
      </header>
      <div className="relative z-10 flex-1 min-h-0">{children}</div>
    </section>
  );
}

function MetricCard({ label, value, unit, delta, icon: Icon, tone = "primary" }: { label: string; value: string; unit: string; delta: string; icon: LucideIcon; tone?: "primary" | "cyan" | "amber" | "coral" }) {
  return (
    <article className={cn("metric-card glass-panel", `tone-${tone}`)}>
      <div className="flex items-start justify-between gap-3">
        <div className="metric-icon"><Icon /></div>
        <span className="metric-delta">{delta}</span>
      </div>
      <div className="mt-5 flex items-end gap-2">
        <strong className="metric-value">{value}</strong>
        <span className="mb-1 text-xs text-muted-foreground">{unit}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
    </article>
  );
}

function StatusPill({ status, tone = "ok" }: { status: string; tone?: "ok" | "warn" | "danger" | "info" }) {
  return <span className={cn("status-pill", `status-${tone}`)}><span className="status-dot" />{status}</span>;
}

function AppHeader({ active, onChange }: { active: ViewKey; onChange: (key: ViewKey) => void }) {
  const left = navItems.slice(0, 3);
  const right = navItems.slice(3);
  const renderItems = (items: typeof navItems) => items.map(({ key, label, icon: Icon }) => (
    <Button key={key} variant="ghost" onClick={() => onChange(key)} className={cn("nav-item", active === key && "nav-item-active")} aria-pressed={active === key}>
      <Icon /><span>{label}</span>
    </Button>
  ));

  return (
    <header className="app-nav">
      <nav className="nav-cluster" aria-label="左侧功能菜单">{renderItems(left)}</nav>
      <button className="brand-lockup" onClick={() => onChange("overview")} aria-label="返回能源总览">
        <span className="brand-mark"><Leaf /><Zap /></span>
        <span><strong>生物能管平台</strong><small>BIOENERGY NEXUS</small></span>
      </button>
      <nav className="nav-cluster nav-cluster-right" aria-label="右侧功能菜单">{renderItems(right)}</nav>
    </header>
  );
}

function PageHeading({ view }: { view: ViewKey }) {
  const info = pageInfo[view];
  return (
    <div className="page-heading animate-fade-in">
      <div>
        <p className="section-eyebrow"><Sparkles />{info.eyebrow}</p>
        <h1>{info.title}</h1>
        <p>{info.summary}</p>
      </div>
      <div className="system-live"><span className="live-orbit" /><div><strong>系统运行正常</strong><small>数据更新于 10:21:36</small></div></div>
    </div>
  );
}

const loadOption = {
  tooltip,
  legend: { ...topLegend, data: ["生物质发电", "沼气发电", "蒸汽输出"] },
  grid: { left: 45, right: 22, top: 52, bottom: 28 },
  xAxis: { type: "category", data: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"], ...axisStyle },
  yAxis: { type: "value", ...axisStyle },
  series: [
    { name: "生物质发电", type: "line", smooth: true, symbol: "none", areaStyle: { opacity: .16 }, data: [48, 52, 61, 78, 86, 82, 75] },
    { name: "沼气发电", type: "line", smooth: true, symbol: "none", data: [28, 31, 36, 42, 46, 45, 41] },
    { name: "蒸汽输出", type: "line", smooth: true, symbol: "none", data: [34, 38, 51, 63, 68, 64, 59] },
  ],
};

function Overview() {
  return <div className="dashboard-grid animate-fade-in">
    <div className="metric-strip col-span-full">
      <MetricCard label="实时综合功率" value="128.6" unit="MW" delta="↑ 8.4%" icon={Zap} />
      <MetricCard label="今日绿色产能" value="2,846" unit="MWh" delta="↑ 12.7%" icon={Factory} tone="cyan" />
      <MetricCard label="碳减排累计" value="18.42" unit="万吨" delta="↑ 6.2%" icon={Leaf} tone="amber" />
      <MetricCard label="设备在线率" value="98.7" unit="%" delta="稳定" icon={ShieldCheck} tone="coral" />
    </div>
    <GlassPanel title="全网能源负荷" subtitle="今日 24 小时 · MW" className="lg:col-span-8 h-[350px]">
      <Chart option={loadOption} className="h-[280px]" />
    </GlassPanel>
    <GlassPanel title="能源转化构成" subtitle="实时产出占比" className="lg:col-span-4 h-[350px]">
      <Chart className="h-[280px]" option={{ tooltip: { trigger: "item" }, legend: { bottom: 0, textStyle: { color: "#a8c9c2" } }, series: [{ type: "pie", radius: ["46%", "72%"], center: ["50%", "43%"], label: { color: "#d9fff2", formatter: "{d}%" }, data: [{ value: 48, name: "秸秆" }, { value: 27, name: "沼气" }, { value: 16, name: "林废" }, { value: 9, name: "其他" }] }] }} />
    </GlassPanel>
    <GlassPanel title="核心站点态势" subtitle="按实时贡献率排序" className="lg:col-span-7">
      <div className="site-list">
        {([['华东一号综合能源站','31.8 MW','96%','运行'],['南岭农林循环中心','27.4 MW','89%','运行'],['江北沼气示范站','19.6 MW','78%','调峰'],['滨湖生物质热电厂','17.1 MW','67%','关注']] as [string, string, string, string][]).map((r, i) => <div className="site-row" key={r[0]}><span className="rank">0{i+1}</span><div><strong>{r[0]}</strong><small>{r[1]}</small></div><div className="progress-track"><span style={{ width: r[2] }} /></div><StatusPill status={r[3]} tone={i === 3 ? "warn" : i === 2 ? "info" : "ok"} /></div>)}
      </div>
    </GlassPanel>
    <GlassPanel title="实时告警" subtitle="全网事件流" className="lg:col-span-5">
      <DataTable headers={["时间", "站点 / 事件", "等级"]} rows={[["10:18","江北 · 进料压力偏高",<StatusPill status="中级" tone="warn" />],["09:42","南岭 · 料仓湿度波动",<StatusPill status="提示" tone="info" />],["08:56","滨湖 · 循环泵振动",<StatusPill status="高级" tone="danger" />],["08:20","华东 · 并网校验完成",<StatusPill status="已恢复" />]]} />
    </GlassPanel>
  </div>;
}

function Production() {
  return <div className="production-layout animate-fade-in">
    <GlassPanel title="全链路生产曲线" subtitle="产能、计划与转化效率 · 最近 12 小时" className="production-main h-[420px]">
      <Chart className="h-[350px]" option={{ ...loadOption, legend: { ...topLegend, data: ["实际产能", "计划产能", "转化效率"] }, xAxis: { type: "category", data: ["0h","2h","4h","6h","8h","10h","12h"], ...axisStyle }, yAxis: [{ type: "value", ...axisStyle }, { type: "value", max: 100, ...axisStyle }], series: [{ name: "实际产能", type: "bar", barWidth: 22, data: [64,69,72,78,91,96,94], itemStyle: { borderRadius: [4,4,0,0] } }, { name: "计划产能", type: "line", smooth: true, data: [68,70,75,80,88,92,95] }, { name: "转化效率", type: "line", yAxisIndex: 1, smooth: true, data: [80,82,83,86,89,91,90] }] }} />
    </GlassPanel>
    <div className="production-side">
      <GlassPanel title="机组实时出力" subtitle="额定功率占比">
        <div className="gauge-stack">{[["1# 汽轮机",92,"38.4 MW"],["2# 汽轮机",84,"34.7 MW"],["沼气机组",76,"19.6 MW"],["余热机组",68,"12.8 MW"]].map(([n,v,w]) => <div key={String(n)}><div className="flex justify-between text-xs"><span>{n}</span><strong>{w}</strong></div><div className="bar-track"><span style={{ width: `${v}%` }} /></div></div>)}</div>
      </GlassPanel>
      <GlassPanel title="关键工艺参数" subtitle="实时采样">
        <div className="parameter-grid"><MiniStat icon={Thermometer} label="炉膛温度" value="892°C"/><MiniStat icon={Droplets} label="蒸汽压力" value="9.6MPa"/><MiniStat icon={Activity} label="发酵 pH" value="7.23"/><MiniStat icon={Zap} label="电网频率" value="50.02Hz"/></div>
      </GlassPanel>
    </div>
    <GlassPanel title="班组生产实绩" subtitle="当前班次 · 08:00—16:00" className="production-table">
      <DataTable headers={["生产单元","当班产量","能耗","完成率","责任班组","状态"]} rows={[["秸秆预处理","326.8 t","18.2 kWh/t","108%","甲班",<StatusPill status="领先"/>],["厌氧发酵","1,240 m³","6.8 kWh/m³","96%","乙班",<StatusPill status="正常"/>],["锅炉燃烧","684 t/h","21.4 kgce/t","92%","甲班",<StatusPill status="正常"/>],["烟气净化","98.6 万m³","4.2 kWh/km³","87%","丙班",<StatusPill status="关注" tone="warn"/>]]}/>
    </GlassPanel>
  </div>;
}

function Materials() {
  return <div className="materials-layout animate-fade-in">
    <GlassPanel title="原料储备总览" subtitle="可支撑连续生产 26.4 天" className="materials-hero">
      <div className="stock-number"><strong>42,680</strong><span>吨 / 当前库存</span></div>
      <div className="warehouse-bars">{[["A1 秸秆仓",84],["A2 林废仓",71],["B1 稻壳仓",63],["B2 混合仓",48]].map(([n,v]) => <div key={String(n)}><span>{n}</span><div><i style={{ width: `${v}%` }} /></div><strong>{v}%</strong></div>)}</div>
    </GlassPanel>
    <GlassPanel title="原料结构" subtitle="库存质量占比" className="materials-pie h-[340px]"><Chart className="h-[270px]" option={{ tooltip: { trigger: "item" }, series: [{ type: "pie", radius: ["30%","70%"], roseType: "radius", label: { color: "#d9fff2" }, data: [{ value: 42, name: "玉米秸秆" },{ value: 25, name: "林业废料" },{ value: 18, name: "稻壳" },{ value: 10, name: "畜禽粪污" },{ value: 5, name: "其他" }] }] }} /></GlassPanel>
    <GlassPanel title="品质能力雷达" subtitle="标准值对比" className="materials-radar h-[340px]"><Chart className="h-[270px]" option={{ legend: { ...topLegend, data: ["当前批次","优质标准"] }, radar: { indicator: [{name:"热值",max:100},{name:"含水率",max:100},{name:"灰分",max:100},{name:"稳定性",max:100},{name:"可加工性",max:100}], splitLine: { lineStyle: { color: "rgba(147,214,203,.16)" } }, axisName: { color: "#a8c9c2" } }, series: [{ type: "radar", data: [{ value:[88,74,82,91,86], name:"当前批次", areaStyle:{opacity:.24} },{ value:[90,88,90,86,90], name:"优质标准" }] }] }} /></GlassPanel>
    <GlassPanel title="近七日到货与消耗" subtitle="吨 / 日" className="materials-flow h-[340px]"><Chart className="h-[270px]" option={{ tooltip, legend:{...topLegend,data:["到货量","消耗量"]}, grid:{left:45,right:20,top:50,bottom:25}, xAxis:{type:"category",data:["周四","周五","周六","周日","周一","周二","今天"],...axisStyle}, yAxis:{type:"value",...axisStyle}, series:[{name:"到货量",type:"bar",data:[1620,1890,1420,1180,2050,2280,1960]},{name:"消耗量",type:"line",smooth:true,data:[1480,1520,1580,1510,1690,1760,1810]}]}}/></GlassPanel>
    <GlassPanel title="供应商与到货计划" subtitle="未来 24 小时" className="materials-table"><DataTable headers={["供应商","物料","计划到场","数量","质量预判","物流状态"]} rows={[["丰源农业合作社","玉米秸秆","11:30","680 t","A",<StatusPill status="运输中" tone="info"/>],["青山林业集团","木片/枝桠","14:10","420 t","A-",<StatusPill status="已发车"/>],["新禾循环科技","稻壳","17:40","360 t","B+",<StatusPill status="待装车" tone="warn"/>]]}/></GlassPanel>
  </div>;
}

function Carbon() {
  return <div className="carbon-layout animate-fade-in">
    <div className="carbon-score glass-panel"><span>年度绿色贡献指数</span><strong>92.8</strong><div className="score-ring"><Leaf/><i>卓越</i></div><p>超过同规模项目 <b>96%</b></p></div>
    <div className="carbon-kpis"><MetricCard label="年度碳减排" value="18.42" unit="万吨CO₂e" delta="↑ 11.6%" icon={Leaf}/><MetricCard label="替代标准煤" value="7.38" unit="万吨" delta="↑ 8.9%" icon={Zap} tone="amber"/><MetricCard label="碳资产估值" value="1,486" unit="万元" delta="↑ 15.2%" icon={TrendingUp} tone="cyan"/></div>
    <GlassPanel title="碳减排绩效曲线" subtitle="月度目标与实际减排量 · tCO₂e" className="carbon-trend h-[380px]"><Chart className="h-[310px]" option={{tooltip,legend:{...topLegend,data:["实际减排","计划目标","累计增速"]},grid:{left:48,right:45,top:52,bottom:26},xAxis:{type:"category",data:["1月","2月","3月","4月","5月","6月","7月","8月"],...axisStyle},yAxis:[{type:"value",...axisStyle},{type:"value",...axisStyle}],series:[{name:"实际减排",type:"bar",data:[1240,1360,1520,1480,1710,1860,1940,2080]},{name:"计划目标",type:"line",smooth:true,data:[1300,1380,1450,1530,1640,1750,1880,2000]},{name:"累计增速",type:"line",yAxisIndex:1,smooth:true,data:[3,4,6,7,9,11,12,14]}]}}/></GlassPanel>
    <GlassPanel title="减排来源分布" subtitle="按技术路径核算" className="carbon-source h-[380px]"><Chart className="h-[310px]" option={{tooltip:{trigger:"item"},series:[{type:"pie",radius:["42%","72%"],label:{color:"#d9fff2",formatter:"{b}\n{d}%"},data:[{name:"生物质替代",value:46},{name:"甲烷回收",value:28},{name:"余热利用",value:17},{name:"能效提升",value:9}]}]}}/></GlassPanel>
    <GlassPanel title="碳资产项目清单" subtitle="已完成第三方核证" className="carbon-projects"><DataTable headers={["项目编号","核算周期","签发量","核证机构","资产状态"]} rows={[["CCER-BE-2401","2026 Q2","32,860 t","华测认证",<StatusPill status="可交易"/>],["CCER-BE-2312","2026 Q1","28,420 t","中环联合",<StatusPill status="已入库" tone="info"/>],["VCS-CHN-8821","2025 Q4","19,760 t","SGS",<StatusPill status="已出售"/>]]}/></GlassPanel>
  </div>;
}

function Maintenance() {
  const devices = [["厌氧反应器 A","健康","98","振动 1.2 mm/s"],["汽轮发电机 1#","健康","96","轴温 62.4°C"],["循环水泵 P-07","预警","72","振动 4.8 mm/s"],["烟气风机 F-12","检修","58","已隔离"],["上料输送机 C-03","健康","91","电流 42.8 A"]];
  return <div className="maintenance-layout animate-fade-in">
    <aside className="device-rail glass-panel"><div className="flex items-center justify-between"><div><p className="section-eyebrow"><CloudCog/>设备网络</p><h2>2,486 台设备</h2></div><StatusPill status="98.7% 在线"/></div><div className="device-search">筛选：全部生产单元</div><div className="device-list">{devices.map((d,i)=><button key={d[0]} className={cn("device-item",i===2&&"device-selected")}><span className="device-symbol"><Settings2/></span><span><strong>{d[0]}</strong><small>{d[3]}</small></span><em>{d[2]}</em></button>)}</div></aside>
    <GlassPanel title="循环水泵 P-07 · 健康诊断" subtitle="设备编码 EW-P-07021 · 最近诊断 10:18" className="health-detail h-[420px]" action={<StatusPill status="需要关注" tone="warn"/>}><div className="health-split"><Chart className="h-[310px]" option={{radar:{indicator:[{name:"振动",max:100},{name:"温度",max:100},{name:"能耗",max:100},{name:"压力",max:100},{name:"流量",max:100},{name:"润滑",max:100}],splitLine:{lineStyle:{color:"rgba(147,214,203,.16)"}},axisName:{color:"#a8c9c2"}},series:[{type:"radar",data:[{value:[58,84,76,92,88,69],areaStyle:{opacity:.28}}]}]}}/><div className="diagnosis"><span>AI 诊断结论</span><strong>轴承早期磨损</strong><p>振动频谱在 2X 转频处出现峰值，建议 48 小时内安排润滑检查。</p><div><b>风险概率</b><em>68%</em></div></div></div></GlassPanel>
    <GlassPanel title="实时振动趋势" subtitle="mm/s · 过去 60 分钟" className="vibration h-[300px]"><Chart className="h-[230px]" option={{tooltip,legend:{...topLegend,data:["水平振动","垂直振动"]},grid:{left:42,right:20,top:50,bottom:24},xAxis:{type:"category",data:["09:20","09:30","09:40","09:50","10:00","10:10","10:20"],...axisStyle},yAxis:{type:"value",...axisStyle},series:[{name:"水平振动",type:"line",smooth:true,data:[2.1,2.4,2.8,3.1,3.8,4.2,4.8]},{name:"垂直振动",type:"line",smooth:true,data:[1.8,2.0,2.2,2.5,2.4,2.9,3.2]}]}}/></GlassPanel>
    <GlassPanel title="维护任务排程" subtitle="今日 8 项 · 已完成 3 项" className="maintenance-tasks"><div className="timeline">{[["10:30","P-07 循环泵润滑检查","处理中"],["13:00","1# 锅炉受热面巡检","待执行"],["15:30","C-03 输送机张力校准","待执行"]].map((t,i)=><div key={t[0]}><span className={cn("timeline-node",i===0&&"active")}/><time>{t[0]}</time><p><strong>{t[1]}</strong><small>{t[2]}</small></p></div>)}</div></GlassPanel>
  </div>;
}

function Business() {
  return <div className="business-layout animate-fade-in">
    <div className="business-banner glass-panel"><div><p className="section-eyebrow"><TrendingUp/>本月经营快报</p><strong>¥ 3,842.6 <small>万元</small></strong><span>综合经营收入</span></div><div className="profit-chip"><i>+18.6%</i><span>同比增长</span></div><div className="business-mini"><span>综合毛利率</span><b>32.8%</b><small>↑ 2.4pct</small></div><div className="business-mini"><span>单位发电成本</span><b>0.382</b><small>元 / kWh</small></div></div>
    <GlassPanel title="收入、成本与利润走势" subtitle="2026 财年 · 万元" className="business-chart h-[400px]"><Chart className="h-[330px]" option={{tooltip,legend:{...topLegend,data:["营业收入","运营成本","净利润"]},grid:{left:50,right:20,top:52,bottom:24},xAxis:{type:"category",data:["1月","2月","3月","4月","5月","6月","7月","8月"],...axisStyle},yAxis:{type:"value",...axisStyle},series:[{name:"营业收入",type:"bar",data:[2980,3120,3260,3480,3560,3710,3790,3843]},{name:"运营成本",type:"bar",data:[2140,2210,2290,2370,2410,2520,2540,2582]},{name:"净利润",type:"line",smooth:true,data:[580,650,710,790,860,920,1060,1120]}]}}/></GlassPanel>
    <GlassPanel title="业务收入结构" subtitle="本月占比" className="business-mix h-[400px]"><Chart className="h-[330px]" option={{tooltip:{trigger:"item"},series:[{type:"pie",radius:["38%","70%"],center:["50%","46%"],label:{color:"#d9fff2"},data:[{value:53,name:"电力销售"},{value:23,name:"热力供应"},{value:14,name:"碳资产"},{value:10,name:"副产品"}]}]}}/></GlassPanel>
    <GlassPanel title="项目经营排名" subtitle="按投资回报率排序" className="business-ranking"><div className="rank-list">{[["华东一号综合能源站","18.6%","¥ 1,286万"],["南岭农林循环中心","16.2%","¥ 946万"],["江北沼气示范站","14.8%","¥ 728万"],["滨湖生物质热电厂","12.4%","¥ 686万"]].map((r,i)=><div key={r[0]}><span>{i+1}</span><p><strong>{r[0]}</strong><small>{r[2]}</small></p><em>{r[1]}</em></div>)}</div></GlassPanel>
    <GlassPanel title="月度经营明细" subtitle="数据口径：财务结算日" className="business-table"><DataTable headers={["业务板块","收入","成本","毛利率","同比","经营状态"]} rows={[["生物质发电","2,036.4 万","1,428.2 万","29.9%","+16.8%",<StatusPill status="稳健"/>],["工业蒸汽","883.8 万","512.6 万","42.0%","+21.4%",<StatusPill status="增长"/>],["碳资产","538.0 万","86.2 万","84.0%","+31.7%",<StatusPill status="高价值"/>],["灰渣副产品","384.4 万","218.9 万","43.1%","+5.2%",<StatusPill status="稳定" tone="info"/>]]}/></GlassPanel>
  </div>;
}

function MiniStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) { return <div className="mini-stat"><Icon/><span>{label}</span><strong>{value}</strong></div>; }

function DataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export function BioEnergyPlatform() {
  const [active, setActive] = useState<ViewKey>("overview");
  const content = useMemo(() => ({ overview:<Overview/>, production:<Production/>, materials:<Materials/>, carbon:<Carbon/>, maintenance:<Maintenance/>, business:<Business/> })[active], [active]);
  return (
    <div className="bioenergy-app">
      <img src={bioenergyBackground} alt="生物质能源工厂与农作物构成的绿色能源园区" width={1920} height={1080} className="app-background" />
      <div className="background-grid" aria-hidden="true" />
      <AppHeader active={active} onChange={setActive} />
      <main className="app-main"><PageHeading view={active}/>{content}</main>
      <div className="corner-status"><span><i />数据链路正常</span><span>12 座能源站</span><button aria-label="查看系统通知"><BellRing/>3</button></div>
    </div>
  );
}