import { useEffect, useRef, useState } from "react";
import { AirVent, Droplets, Fan, Lightbulb, Sun, Thermometer, X } from "lucide-react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";
import {
  rooms,
  series,
  statusLabel,
  statusOf,
  type DeviceRow,
  type RoomId,
} from "@/lib/smart-home-data";
import { Button, DataStatusPill, Panel, Toggle } from "./ui";
import { Sparkline } from "./Sparkline";

const kindIcon = { AC: AirVent, FAN: Fan, LIGHT: Lightbulb } as const;

export function DashboardTab({
  room,
  onRoomChange,
  devices,
  setDevices,
}: {
  room: RoomId;
  onRoomChange: (r: RoomId) => void;
  devices: DeviceRow[];
  setDevices: (fn: (d: DeviceRow[]) => DeviceRow[]) => void;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [alertOpen, setAlertOpen] = useState(true);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const measure = () => setChartWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const data = series[room];
  const last = data[data.length - 1]!;
  const roomDevices = devices.filter((d) => d.room_id === room);

  const update = (id: string, patch: Partial<DeviceRow>) =>
    setDevices((list) =>
      list.map((x) => (x.device_id === id ? { ...x, ...patch, last_control: "vừa xong" } : x)),
    );

  const cards = [
    {
      name: "Nhiệt độ",
      value: last.temp.toFixed(1),
      unit: "°C",
      icon: Thermometer,
      status: statusOf("TEMPERATURE", last.temp),
      note: "Chuẩn 15–28°C",
      tint: "text-chart-1",
      color: "var(--chart-1)",
      trend: data.map((p) => p.temp),
    },
    {
      name: "Độ ẩm",
      value: String(last.hum),
      unit: "%",
      icon: Droplets,
      status: statusOf("HUMIDITY", last.hum),
      note: "Chuẩn 30–70%",
      tint: "text-chart-2",
      color: "var(--chart-2)",
      trend: data.map((p) => p.hum),
    },
    {
      name: "Ánh sáng",
      value: String(last.lux),
      unit: "Lux",
      icon: Sun,
      status: statusOf("LIGHT", last.lux),
      note: last.lux > 1000 ? "Bright" : last.lux > 500 ? "Normal" : last.lux > 50 ? "Dim" : "Off",
      tint: "text-chart-3",
      color: "var(--chart-3)",
      trend: data.map((p) => p.lux),
    },
  ];

  const critical = cards.find((c) => c.status === "CRITICAL");

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {critical && alertOpen && (
        <div className="animate-in slide-in-from-top-2 flex items-start gap-3 rounded-3xl border border-destructive/25 bg-destructive/10 p-4 text-destructive shadow-[var(--shadow-glass)] duration-300 sm:items-center">
          <span className="mt-0.5 text-lg sm:mt-0">⚠️</span>
          <p className="min-w-0 flex-1 text-sm font-medium">
            <strong>Cảnh báo nghiêm trọng:</strong> {critical.name} {rooms.find((r) => r.room_id === room)?.room_name} đạt{" "}
            <strong>
              {critical.value}
              {critical.unit}
            </strong>{" "}
            — vượt ngưỡng an toàn. Hệ thống đã kích hoạt thiết bị làm mát.
          </p>
          <button
            onClick={() => setAlertOpen(false)}
            aria-label="Đóng cảnh báo"
            className="shrink-0 rounded-lg p-1 hover:bg-destructive/15"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Phòng:</span>
        {rooms.map((r) => (
          <button
            key={r.room_id}
            onClick={() => onRoomChange(r.room_id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
              room === r.room_id
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-float)]"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {r.room_name}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((s) => (
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
            <div className="mt-4">
              <Sparkline values={s.trend} color={s.color} />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <DataStatusPill status={s.status}>{statusLabel[s.status]}</DataStatusPill>
              <span className="text-xs text-muted-foreground">{s.note}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Cập nhật: {last.time} · hôm nay</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {roomDevices.map((d) => {
          const Icon = kindIcon[d.kind];
          return (
            <Panel key={d.device_id} className="glass-hover p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-colors duration-300",
                      d.on ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground",
                    )}
                  >
                    <Icon className={cn("h-5 w-5", d.on && d.kind === "FAN" && "animate-spin")} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{d.device_name}</p>
                    <p
                      className={cn(
                        "text-xs font-bold tracking-wide",
                        d.on ? "text-success" : "text-muted-foreground",
                      )}
                    >
                      {d.on ? "ON" : "OFF"}
                    </p>
                  </div>
                </div>
                <Toggle
                  on={d.on}
                  label={`Bật tắt ${d.device_name}`}
                  onChange={(v) => update(d.device_id, { on: v, control_source: "Manual" })}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1">
                {[
                  { label: "Manual", auto: false },
                  { label: "Auto", auto: true },
                ].map((m) => (
                  <button
                    key={m.label}
                    onClick={() =>
                      update(d.device_id, {
                        auto: m.auto,
                        control_source: m.auto ? "Auto" : "Manual",
                      })
                    }
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
              <p className="mt-3 text-xs text-muted-foreground">
                Điều khiển cuối: {d.last_control} ·{" "}
                {d.control_source === "Auto" ? "by Automation" : "by User"}
              </p>
            </Panel>
          );
        })}
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
            <LineChart
              width={chartWidth}
              height={320}
              data={data}
              margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
            >
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
                name="Ánh sáng (Lux)"
                stroke="var(--chart-3)"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => onRoomChange(room === "1" ? "2" : "1")}>Xem phòng khác</Button>
        </div>
      </Panel>
    </div>
  );
}
