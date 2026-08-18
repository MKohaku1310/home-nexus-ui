import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AirVent,
  Bell,
  ChevronRight,
  Cpu,
  Droplets,
  Fan,
  Gauge,
  History,
  LayoutDashboard,
  Lightbulb,
  Settings2,
  Sun,
  Table2,
  Thermometer,
  X,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bảng Điều Khiển Smart Home | Cổng IoT ESP32-S3" },
      {
        name: "description",
        content:
          "Bảng điều khiển giám sát và điều khiển Smart Home: theo dõi nhiệt độ, độ ẩm, ánh sáng và điều khiển điều hòa, quạt, đèn theo thời gian thực.",
      },
      { property: "og:title", content: "Bảng Điều Khiển Smart Home | Cổng IoT ESP32-S3" },
      {
        property: "og:description",
        content:
          "Giám sát cảm biến, điều khiển thiết bị và cấu hình ngưỡng tự động hóa cho ngôi nhà thông minh của bạn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmartHomeDashboard,
});

/* ---------------------------------- data --------------------------------- */

const TABS = [
  { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
  { id: "sensors", label: "Dữ liệu cảm biến", icon: Table2 },
  { id: "logs", label: "Lịch sử hoạt động", icon: History },
  { id: "settings", label: "Cài đặt hệ thống", icon: Settings2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

const chartData = [
  { time: "08:00", temp: 27.4, hum: 68, lux: 210 },
  { time: "09:00", temp: 28.1, hum: 66, lux: 380 },
  { time: "10:00", temp: 29.6, hum: 63, lux: 540 },
  { time: "11:00", temp: 31.2, hum: 60, lux: 720 },
  { time: "12:00", temp: 33.5, hum: 57, lux: 860 },
  { time: "13:00", temp: 34.8, hum: 55, lux: 910 },
  { time: "14:00", temp: 33.9, hum: 58, lux: 780 },
  { time: "15:00", temp: 32.1, hum: 61, lux: 620 },
];

const sensorRows = [
  { time: "18/08/2026 15:00:12", temp: 32.1, hum: 61, lux: 620, node: "ESP32-S3 · Phòng khách" },
  { time: "18/08/2026 14:30:07", temp: 33.4, hum: 59, lux: 705, node: "ESP32-S3 · Phòng khách" },
  { time: "18/08/2026 14:00:03", temp: 33.9, hum: 58, lux: 780, node: "ESP32-S3 · Phòng khách" },
  { time: "18/08/2026 13:30:55", temp: 34.6, hum: 56, lux: 845, node: "ESP32-C6 · Ban công" },
  { time: "18/08/2026 13:00:41", temp: 34.8, hum: 55, lux: 910, node: "ESP32-C6 · Ban công" },
  { time: "18/08/2026 12:30:18", temp: 34.1, hum: 56, lux: 888, node: "ESP32-S3 · Phòng khách" },
  { time: "18/08/2026 12:00:02", temp: 33.5, hum: 57, lux: 860, node: "ESP32-S3 · Phòng khách" },
  { time: "18/08/2026 11:30:44", temp: 32.3, hum: 59, lux: 795, node: "ESP32-C6 · Ban công" },
];

const activityLog = [
  {
    time: "15:02:10",
    type: "Điều khiển",
    detail: "Bật Điều hòa do nhiệt độ 34.8°C vượt ngưỡng 32°C",
    actor: "Hệ thống tự động",
    ok: true,
  },
  {
    time: "14:41:33",
    type: "Cấu hình",
    detail: "Cập nhật ngưỡng ánh sáng bật đèn: 180 lx → 150 lx",
    actor: "admin@smarthome.vn",
    ok: true,
  },
  {
    time: "14:15:09",
    type: "MQTT",
    detail: "Gửi lệnh fan/set = ON tới node ESP32-S3",
    actor: "admin@smarthome.vn",
    ok: true,
  },
  {
    time: "13:58:47",
    type: "Kết nối",
    detail: "Mất kết nối tạm thời tới broker MQTT (retry 3 lần)",
    actor: "Hệ thống tự động",
    ok: false,
  },
  {
    time: "13:22:05",
    type: "Cảm biến",
    detail: "Đồng bộ 42 bản ghi cảm biến lên Supabase",
    actor: "Hệ thống tự động",
    ok: true,
  },
  {
    time: "12:04:51",
    type: "Điều khiển",
    detail: "Tắt Đèn phòng khách (chế độ thủ công)",
    actor: "admin@smarthome.vn",
    ok: true,
  },
];

const notifications = [
  { title: "Nhiệt độ vượt ngưỡng", desc: "34.8°C > 32°C — đã bật điều hòa", time: "2 phút trước", tone: "danger" },
  { title: "Độ ẩm thấp", desc: "55% dưới mức khuyến nghị 60%", time: "18 phút trước", tone: "warning" },
  { title: "MQTT phục hồi", desc: "Broker kết nối lại thành công", time: "1 giờ trước", tone: "ok" },
];

/* ------------------------------- primitives ------------------------------ */

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-8 w-14 shrink-0 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        on ? "bg-success" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-6 w-6 rounded-full bg-background shadow-md transition-all duration-300 ease-out",
          on ? "left-7" : "left-1",
        )}
      />
    </button>
  );
}

function StatusBadge({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", ok ? "bg-success" : "bg-destructive")} />
      {children}
    </span>
  );
}

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass-panel rounded-3xl", className)}>{children}</div>;
}

/* -------------------------------- sections ------------------------------- */

type Device = { id: string; name: string; icon: typeof Fan; on: boolean; auto: boolean };

function DashboardTab() {
  const [devices, setDevices] = useState<Device[]>([
    { id: "ac", name: "Điều hòa", icon: AirVent, on: true, auto: true },
    { id: "fan", name: "Quạt", icon: Fan, on: true, auto: false },
    { id: "light", name: "Đèn", icon: Lightbulb, on: false, auto: true },
  ]);

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const measure = () => setChartWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const update = (id: string, patch: Partial<Device>) =>
    setDevices((d) => d.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const sensors = [
    {
      name: "Nhiệt độ",
      value: "34.8",
      unit: "°C",
      icon: Thermometer,
      ok: false,
      note: "Ngưỡng 32°C",
      tint: "text-chart-1",
    },
    {
      name: "Độ ẩm",
      value: "55",
      unit: "%",
      icon: Droplets,
      ok: true,
      note: "Ngưỡng 40–75%",
      tint: "text-chart-2",
    },
    {
      name: "Ánh sáng",
      value: "910",
      unit: "lx",
      icon: Sun,
      ok: true,
      note: "Ngưỡng bật đèn 150 lx",
      tint: "text-chart-3",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-3xl border border-destructive/25 bg-destructive/10 p-4 text-destructive shadow-[var(--shadow-glass)] sm:items-center">
        <Activity className="mt-0.5 h-5 w-5 shrink-0 sm:mt-0" />
        <p className="min-w-0 text-sm font-medium">
          Cảnh báo: Nhiệt độ phòng khách đạt <strong>34.8°C</strong>, vượt ngưỡng an toàn 32°C. Hệ
          thống đã tự động kích hoạt điều hòa.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {sensors.map((s) => (
          <Panel key={s.name} className="glass-hover p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-muted-foreground">{s.name}</p>
                <p className="mt-2 font-display text-5xl font-semibold tracking-tight">
                  {s.value}
                  <span className="ml-1 text-2xl font-medium text-muted-foreground">{s.unit}</span>
                </p>
              </div>
              <div className={cn("shrink-0 rounded-2xl bg-secondary p-3", s.tint)}>
                <s.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
              <StatusBadge ok={s.ok}>{s.ok ? "Bình thường" : "Vượt ngưỡng"}</StatusBadge>
              <span className="text-xs text-muted-foreground">{s.note}</span>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {devices.map((d) => (
          <Panel key={d.id} className="glass-hover p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-colors duration-300",
                    d.on ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground",
                  )}
                >
                  <d.icon className={cn("h-5 w-5", d.on && d.id === "fan" && "animate-spin")} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{d.name}</p>
                  <p
                    className={cn(
                      "text-xs font-bold tracking-wide",
                      d.on ? "text-success" : "text-muted-foreground",
                    )}
                  >
                    {d.on ? "BẬT" : "TẮT"}
                  </p>
                </div>
              </div>
              <Toggle on={d.on} onChange={(v) => update(d.id, { on: v })} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1">
              {[
                { label: "Thủ công", auto: false },
                { label: "Tự động", auto: true },
              ].map((m) => (
                <button
                  key={m.label}
                  onClick={() => update(d.id, { auto: m.auto })}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                    d.auto === m.auto
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate font-display text-lg font-semibold">Biến động cảm biến</h2>
            <p className="text-sm text-muted-foreground">Dữ liệu 8 giờ gần nhất</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3 text-xs text-muted-foreground">
            {[
              ["Nhiệt độ", "var(--chart-1)"],
              ["Độ ẩm", "var(--chart-2)"],
              ["Ánh sáng", "var(--chart-3)"],
            ].map(([label, color]) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div ref={chartRef} className="mt-6 h-[320px] w-full">
          {chartWidth > 0 && (
            <LineChart width={chartWidth} height={320} data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                yAxisId="left"
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis yAxisId="right" orientation="right" hide />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "1rem",
                  boxShadow: "var(--shadow-float)",
                  color: "var(--popover-foreground)",
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                name="Nhiệt độ (°C)"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="hum"
                name="Độ ẩm (%)"
                stroke="var(--chart-2)"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="lux"
                name="Ánh sáng (lx)"
                stroke="var(--chart-3)"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          )}
        </div>
      </Panel>
    </div>
  );
}

function SensorsTab() {
  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold">Lịch sử đo đạc</h2>
        <p className="text-sm text-muted-foreground">Bản ghi gần nhất từ các node cảm biến</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              {["STT", "Thời gian", "Nhiệt độ (°C)", "Độ ẩm (%)", "Ánh sáng (lx)", "Thiết bị gửi"].map(
                (h) => (
                  <th key={h} className="px-6 py-3 font-semibold">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {sensorRows.map((r, i) => (
              <tr
                key={r.time}
                className="border-t border-border/50 transition-colors hover:bg-secondary/60"
              >
                <td className="px-6 py-3.5 text-muted-foreground">{i + 1}</td>
                <td className="px-6 py-3.5 font-medium">{r.time}</td>
                <td
                  className={cn(
                    "px-6 py-3.5 font-semibold",
                    r.temp > 32 ? "text-destructive" : "text-foreground",
                  )}
                >
                  {r.temp.toFixed(1)}
                </td>
                <td className="px-6 py-3.5">{r.hum}</td>
                <td className="px-6 py-3.5">{r.lux}</td>
                <td className="px-6 py-3.5 text-muted-foreground">{r.node}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function LogsTab() {
  return (
    <Panel className="p-6">
      <h2 className="font-display text-lg font-semibold">Nhật ký hoạt động</h2>
      <p className="text-sm text-muted-foreground">Các sự kiện điều khiển và hệ thống</p>
      <ul className="mt-5 space-y-3">
        {activityLog.map((l) => (
          <li
            key={l.time}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-2xl bg-secondary/50 p-4 transition-colors hover:bg-secondary md:flex md:items-center"
          >
            <span className="hidden w-20 shrink-0 font-mono text-sm text-muted-foreground md:inline">
              {l.time}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/12 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {l.type}
                </span>
                <span className="font-mono text-xs text-muted-foreground md:hidden">{l.time}</span>
              </div>
              <p className="mt-1.5 text-sm font-medium">{l.detail}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Thực hiện bởi: {l.actor}</p>
            </div>
            <div className="shrink-0">
              <StatusBadge ok={l.ok}>{l.ok ? "Thành công" : "Thất bại"}</StatusBadge>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function ThresholdRow({
  label,
  icon: Icon,
  unit,
  min,
  max,
  step,
  initial,
  hint,
}: {
  label: string;
  icon: typeof Sun;
  unit: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  hint: string;
}) {
  const [value, setValue] = useState(initial);
  const pct = useMemo(() => ((value - min) / (max - min)) * 100, [value, min, max]);

  return (
    <Panel className="p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{label}</p>
            <p className="truncate text-xs text-muted-foreground">{hint}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-24 rounded-xl border border-input bg-background px-3 py-2 text-right text-sm font-semibold outline-none transition-shadow focus:ring-2 focus:ring-ring"
          />
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-primary [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110"
        style={{
          background: `linear-gradient(to right, var(--primary) ${pct}%, var(--muted) ${pct}%)`,
        }}
      />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
    </Panel>
  );
}

function SettingsTab() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ThresholdRow
        label="Ngưỡng nhiệt độ bật Điều hòa"
        icon={Thermometer}
        unit="°C"
        min={16}
        max={40}
        step={0.5}
        initial={32}
        hint="Điều hòa bật khi nhiệt độ vượt giá trị này"
      />
      <ThresholdRow
        label="Ngưỡng độ ẩm bật Quạt"
        icon={Droplets}
        unit="%"
        min={20}
        max={95}
        step={1}
        initial={70}
        hint="Quạt bật khi độ ẩm vượt giá trị này"
      />
      <ThresholdRow
        label="Ngưỡng ánh sáng bật Đèn"
        icon={Sun}
        unit="lx"
        min={0}
        max={1000}
        step={10}
        initial={150}
        hint="Đèn bật khi ánh sáng thấp hơn giá trị này"
      />
      <ThresholdRow
        label="Chu kỳ gửi dữ liệu cảm biến"
        icon={Gauge}
        unit="giây"
        min={5}
        max={300}
        step={5}
        initial={30}
        hint="Tần suất node ESP32 đẩy dữ liệu lên Cloud"
      />
    </div>
  );
}

/* --------------------------------- shell --------------------------------- */

function SmartHomeDashboard() {
  const [tab, setTab] = useState<TabId>("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const current = TABS.find((t) => t.id === tab)!;

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-float)]">
          <Cpu className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold">Cổng IOT</p>
          <p className="truncate text-xs text-muted-foreground">Node ESP32-S3</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setNavOpen(false);
            }}
            className={cn(
              "group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all duration-200",
              tab === t.id
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-float)]"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <t.icon className="h-[18px] w-[18px] shrink-0" />
            <span className="min-w-0 flex-1 truncate text-left">{t.label}</span>
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 transition-transform",
                tab === t.id ? "opacity-90" : "opacity-0 group-hover:opacity-60",
              )}
            />
          </button>
        ))}
      </nav>

      <div className="m-4 space-y-2 rounded-2xl bg-secondary/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Trạng thái kết nối
        </p>
        {[
          { name: "Supabase", online: true },
          { name: "MQTT Broker", online: true },
        ].map((c) => (
          <div key={c.name} className="flex items-center justify-between text-sm">
            <span className="truncate">{c.name}</span>
            <StatusBadge ok={c.online}>{c.online ? "Online" : "Offline"}</StatusBadge>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 border-r border-border/60 bg-sidebar/70 backdrop-blur-xl lg:block">
        {nav}
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Đóng menu"
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-sidebar shadow-[var(--shadow-float)]">
            <button
              onClick={() => setNavOpen(false)}
              className="absolute right-3 top-6 rounded-xl p-2 text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
            {nav}
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setNavOpen(true)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary lg:hidden"
                aria-label="Mở menu"
              >
                <LayoutDashboard className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {current.label}
                </h1>
                <p className="hidden text-sm text-muted-foreground sm:block">
                  Giám sát & điều khiển ngôi nhà thông minh theo thời gian thực
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="relative">
                <button
                  onClick={() => setBellOpen((v) => !v)}
                  className="relative grid h-10 w-10 place-items-center rounded-2xl bg-secondary transition-colors hover:bg-accent"
                  aria-label="Thông báo"
                >
                  <Bell className="h-[18px] w-[18px]" />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                </button>
                {bellOpen && (
                  <div className="absolute right-0 top-12 z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-border/60 bg-popover shadow-[var(--shadow-float)]">
                    <p className="border-b border-border/60 px-4 py-3 text-sm font-semibold">
                      Cảnh báo gần đây
                    </p>
                    <ul>
                      {notifications.map((n) => (
                        <li
                          key={n.title}
                          className="flex gap-3 border-b border-border/40 px-4 py-3 last:border-0 hover:bg-secondary/60"
                        >
                          <span
                            className={cn(
                              "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                              n.tone === "danger" && "bg-destructive",
                              n.tone === "warning" && "bg-warning",
                              n.tone === "ok" && "bg-success",
                            )}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.desc}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-secondary py-1.5 pl-1.5 pr-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                  AD
                </span>
                <div className="hidden min-w-0 leading-tight sm:block">
                  <p className="truncate text-sm font-semibold">Admin</p>
                  <p className="truncate text-xs text-muted-foreground">Quản trị hệ thống</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-8 sm:py-8">
          {tab === "dashboard" && <DashboardTab />}
          {tab === "sensors" && <SensorsTab />}
          {tab === "logs" && <LogsTab />}
          {tab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
