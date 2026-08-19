import { useState, useRef, useEffect } from "react";
import {
  AirVent,
  AlertCircle,
  Droplets,
  Fan,
  Lightbulb,
  Sun,
  Thermometer,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { initialChartData } from "./mockData";

export interface DeviceState {
  id: string;
  name: string;
  type: "FAN" | "LIGHT" | "AC";
  on: boolean;
  auto: boolean;
  statusText: string;
  lastControlled: string;
}

export function DashboardTab() {
  const [sensors] = useState([
    {
      id: "temp",
      name: "Nhiệt độ",
      value: "20.5",
      unit: "°C",
      icon: Thermometer,
      status: "NORMAL",
      statusText: "Bình thường",
      badgeColor: "bg-success/15 text-success border-success/30",
      accentColor: "text-rose-500 bg-rose-500/10",
      trend: "+0.3°C / 10p",
    },
    {
      id: "humidity",
      name: "Độ ẩm",
      value: "80.0",
      unit: "%",
      icon: Droplets,
      status: "WARNING",
      statusText: "Cảnh báo cao",
      badgeColor: "bg-warning/15 text-warning-foreground border-warning/30",
      accentColor: "text-sky-500 bg-sky-500/10",
      trend: "+4% / 10p",
    },
    {
      id: "light",
      name: "Ánh sáng",
      value: "1000",
      unit: "Lux",
      icon: Sun,
      status: "NORMAL",
      statusText: "Đủ sáng",
      badgeColor: "bg-success/15 text-success border-success/30",
      accentColor: "text-amber-500 bg-amber-500/10",
      trend: "Ổn định",
    },
  ]);

  const [devices, setDevices] = useState<DeviceState[]>([
    {
      id: "fan_1",
      name: "Quạt thông gió",
      type: "FAN",
      on: true,
      auto: true,
      statusText: "BẬT",
      lastControlled: "Tự động kích hoạt (Độ ẩm > 75%)",
    },
    {
      id: "led_1",
      name: "Đèn chiếu sáng",
      type: "LIGHT",
      on: false,
      auto: false,
      statusText: "TẮT",
      lastControlled: "Tắt thủ công",
    },
    {
      id: "ac_1",
      name: "Điều hòa",
      type: "AC",
      on: true,
      auto: true,
      statusText: "BẬT",
      lastControlled: "Tự động kích hoạt",
    },
  ]);

  const [loadingDevice, setLoadingDevice] = useState<string | null>(null);

  const handleToggleDevice = (id: string) => {
    setLoadingDevice(id);
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((d) => {
          if (d.id === id) {
            const nextOn = !d.on;
            return {
              ...d,
              on: nextOn,
              statusText: nextOn ? "BẬT" : "TẮT",
              lastControlled: "Vừa xong",
            };
          }
          return d;
        }),
      );
      setLoadingDevice(null);
    }, 300);
  };

  const handleToggleAuto = (id: string, auto: boolean) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, auto, lastControlled: "Vừa đổi chế độ" } : d)),
    );
  };

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

  return (
    <div className="space-y-5">
      {/* Alert Banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-warning-foreground shadow-xs">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs font-medium">
          <strong>Cảnh báo:</strong> Độ ẩm đạt <strong>80.0%</strong> (vượt ngưỡng 75%). Đã bật quạt thông gió.
        </p>
      </div>

      {/* Sensor Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sensors.map((s) => (
          <div
            key={s.id}
            className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-muted-foreground">{s.name}</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold tracking-tight text-foreground">
                    {s.value}
                  </span>
                  <span className="text-base font-semibold text-muted-foreground">{s.unit}</span>
                </div>
              </div>
              <div className={cn("rounded-xl p-3", s.accentColor)}>
                <s.icon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-semibold", s.badgeColor)}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {s.statusText}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground font-medium">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                {s.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Devices */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left Column: Line Chart */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-xs lg:col-span-7 xl:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
            <h2 className="font-display text-base font-bold text-foreground">
              Biểu đồ biến động cảm biến
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span className="h-2 w-2 rounded-full bg-[var(--chart-1)]" />
                Nhiệt độ (°C)
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span className="h-2 w-2 rounded-full bg-[var(--chart-2)]" />
                Độ ẩm (%)
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <span className="h-2 w-2 rounded-full bg-[var(--chart-3)]" />
                Ánh sáng (Lux/10)
              </span>
            </div>
          </div>

          <div ref={chartRef} className="mt-4 h-[300px] w-full flex-1">
            {chartWidth > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={initialChartData.map((d) => ({ ...d, luxScaled: Math.round(d.lux / 10) }))}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                  <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} domain={[10, 120]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    name="Nhiệt độ (°C)"
                    stroke="var(--chart-1)"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: "var(--chart-1)" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hum"
                    name="Độ ẩm (%)"
                    stroke="var(--chart-2)"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: "var(--chart-2)" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="luxScaled"
                    name="Ánh sáng (Lux/10)"
                    stroke="var(--chart-3)"
                    strokeWidth={2.5}
                    dot={{ r: 2.5, fill: "var(--chart-3)" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Column: Device Control */}
        <div className="flex flex-col space-y-3 rounded-2xl border border-border/80 bg-card p-5 shadow-xs lg:col-span-5 xl:col-span-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <h2 className="font-display text-base font-bold text-foreground">
              Điều khiển thiết bị
            </h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" />
              Trực tiếp
            </span>
          </div>

          <div className="space-y-2.5">
            {devices.map((d) => {
              const isLoading = loadingDevice === d.id;
              return (
                <div
                  key={d.id}
                  className={cn(
                    "rounded-xl border p-3 transition-all duration-200",
                    d.on
                      ? "border-primary/30 bg-primary/[0.03]"
                      : "border-border/60 bg-secondary/20",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all",
                          d.on
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {d.type === "FAN" && (
                          <Fan className={cn("h-4 w-4", d.on && "animate-spin")} />
                        )}
                        {d.type === "LIGHT" && (
                          <Lightbulb
                            className={cn("h-4 w-4", d.on && "fill-amber-300 text-amber-300")}
                          />
                        )}
                        {d.type === "AC" && (
                          <AirVent className={cn("h-4 w-4", d.on && "animate-pulse")} />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{d.name}</p>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span
                            className={cn(
                              "font-bold",
                              isLoading
                                ? "text-amber-500"
                                : d.on
                                  ? "text-success"
                                  : "text-muted-foreground",
                            )}
                          >
                            {isLoading ? "Đang gửi..." : d.on ? "BẬT" : "TẮT"}
                          </span>
                          <span className="text-muted-foreground">• {d.auto ? "Tự động" : "Thủ công"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Switch Toggle */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={d.on}
                      disabled={isLoading}
                      onClick={() => handleToggleDevice(d.id)}
                      className={cn(
                        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        isLoading
                          ? "bg-amber-400 opacity-80"
                          : d.on
                            ? "bg-success"
                            : "bg-muted-foreground/30",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-xs transition-all duration-200 ease-out",
                          d.on ? "left-5.5" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>

                  {/* Mode switch */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2 text-xs">
                    <div className="flex rounded-lg bg-secondary/80 p-0.5">
                      <button
                        onClick={() => handleToggleAuto(d.id, false)}
                        className={cn(
                          "rounded-md px-2 py-0.5 font-medium transition-all",
                          !d.auto
                            ? "bg-background font-bold text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Thủ công
                      </button>
                      <button
                        onClick={() => handleToggleAuto(d.id, true)}
                        className={cn(
                          "rounded-md px-2 py-0.5 font-medium transition-all",
                          d.auto
                            ? "bg-primary font-bold text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Tự động
                      </button>
                    </div>

                    <span className="text-muted-foreground truncate max-w-[140px] text-xs">
                      {d.lastControlled}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
