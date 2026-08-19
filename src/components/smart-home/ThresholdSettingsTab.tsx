import { useState } from "react";
import {
  AirVent,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Gauge,
  RotateCcw,
  Save,
  Sun,
  Thermometer,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ThresholdConfig {
  acOnTemp: number;
  acOffTemp: number;
  tempAlertCritical: number;
  fanOnHum: number;
  fanOffHum: number;
  humAlertCritical: number;
  lightOnLux: number;
  lightOffLux: number;
  publishInterval: number;
}

const defaultThresholds: ThresholdConfig = {
  acOnTemp: 28,
  acOffTemp: 24,
  tempAlertCritical: 32,
  fanOnHum: 75,
  fanOffHum: 50,
  humAlertCritical: 85,
  lightOnLux: 200,
  lightOffLux: 800,
  publishInterval: 30,
};

export function ThresholdSettingsTab() {
  const [config, setConfig] = useState<ThresholdConfig>(defaultThresholds);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Khôi phục tất cả ngưỡng về cấu hình mặc định ban đầu?")) {
      setConfig(defaultThresholds);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Cài đặt ngưỡng tự động
          </h2>
          <p className="text-xs text-muted-foreground">
            Thiết lập giá trị kích hoạt thiết bị và ngưỡng cảnh báo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-secondary/50 px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Mặc định
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <Save className="h-3.5 w-3.5" />
            Lưu Cấu Hình
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-2xl border border-success/30 bg-success/10 p-4 text-xs font-semibold text-success animate-in fade-in duration-300">
          <CheckCircle2 className="h-4 w-4" />
          Đã lưu và đồng bộ cấu hình ngưỡng thành công!
        </div>
      )}

      {/* Grid Settings */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card 1: Nhiệt độ & Điều hòa */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-border/60 pb-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
              <Thermometer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Ngưỡng Nhiệt Độ (°C)</h3>
              <p className="text-xs text-muted-foreground">Điều khiển Điều hòa & Cảnh báo sốc nhiệt</p>
            </div>
          </div>

          {/* Bật AC */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground">Tự động BẬT Điều hòa khi &gt;</span>
              <span className="text-primary">{config.acOnTemp} °C</span>
            </div>
            <input
              type="range"
              min={18}
              max={38}
              step={0.5}
              value={config.acOnTemp}
              onChange={(e) => setConfig({ ...config, acOnTemp: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>18°C</span>
              <span>38°C</span>
            </div>
          </div>

          {/* Tắt AC */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground">Tự động TẮT Điều hòa khi &lt;</span>
              <span className="text-primary">{config.acOffTemp} °C</span>
            </div>
            <input
              type="range"
              min={16}
              max={30}
              step={0.5}
              value={config.acOffTemp}
              onChange={(e) => setConfig({ ...config, acOffTemp: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
            />
          </div>

          {/* Cảnh báo đỏ */}
          <div className="space-y-2 rounded-2xl bg-destructive/5 p-3.5 border border-destructive/20">
            <div className="flex justify-between text-xs font-semibold text-destructive">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Cảnh báo Nguy cấp (Critical) khi &gt;
              </span>
              <span>{config.tempAlertCritical} °C</span>
            </div>
            <input
              type="range"
              min={30}
              max={45}
              step={0.5}
              value={config.tempAlertCritical}
              onChange={(e) => setConfig({ ...config, tempAlertCritical: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-destructive/20 accent-destructive"
            />
          </div>
        </div>

        {/* Card 2: Độ ẩm & Quạt */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-border/60 pb-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sky-500/10 text-sky-500">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Ngưỡng Độ Ẩm (%)</h3>
              <p className="text-xs text-muted-foreground">Điều khiển Quạt thông gió & Cảnh báo ẩm mốc</p>
            </div>
          </div>

          {/* Bật Fan */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground">Tự động BẬT Quạt khi &gt;</span>
              <span className="text-primary">{config.fanOnHum} %</span>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              step={1}
              value={config.fanOnHum}
              onChange={(e) => setConfig({ ...config, fanOnHum: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>40%</span>
              <span>95%</span>
            </div>
          </div>

          {/* Tắt Fan */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground">Tự động TẮT Quạt khi &lt;</span>
              <span className="text-primary">{config.fanOffHum} %</span>
            </div>
            <input
              type="range"
              min={30}
              max={70}
              step={1}
              value={config.fanOffHum}
              onChange={(e) => setConfig({ ...config, fanOffHum: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
            />
          </div>

          {/* Cảnh báo đỏ */}
          <div className="space-y-2 rounded-2xl bg-warning/5 p-3.5 border border-warning/20">
            <div className="flex justify-between text-xs font-semibold text-warning-foreground">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Cảnh báo Độ ẩm cao (Nồm ẩm) khi &gt;
              </span>
              <span>{config.humAlertCritical} %</span>
            </div>
            <input
              type="range"
              min={75}
              max={100}
              step={1}
              value={config.humAlertCritical}
              onChange={(e) => setConfig({ ...config, humAlertCritical: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-warning/20 accent-warning"
            />
          </div>
        </div>

        {/* Card 3: Ánh sáng & Đèn */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-border/60 pb-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Ngưỡng Cường Độ Ánh Sáng (Lux)</h3>
              <p className="text-xs text-muted-foreground">Tự động bật tắt Đèn chiếu sáng thông minh</p>
            </div>
          </div>

          {/* Bật Đèn */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground">Tự động BẬT Đèn khi trời tối &lt;</span>
              <span className="text-primary">{config.lightOnLux} Lux</span>
            </div>
            <input
              type="range"
              min={20}
              max={500}
              step={10}
              value={config.lightOnLux}
              onChange={(e) => setConfig({ ...config, lightOnLux: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>20 Lux</span>
              <span>500 Lux</span>
            </div>
          </div>

          {/* Tắt Đèn */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground">Tự động TẮT Đèn khi đủ sáng &gt;</span>
              <span className="text-primary">{config.lightOffLux} Lux</span>
            </div>
            <input
              type="range"
              min={400}
              max={1500}
              step={50}
              value={config.lightOffLux}
              onChange={(e) => setConfig({ ...config, lightOffLux: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>400 Lux</span>
              <span>1500 Lux</span>
            </div>
          </div>
        </div>

        {/* Card 4: Chu kỳ Telemetry */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-border/60 pb-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Chu Kỳ Gửi Dữ Liệu</h3>
              <p className="text-xs text-muted-foreground">Tần suất cập nhật dữ liệu cảm biến</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-foreground">Chu kỳ gửi:</span>
              <span className="font-mono text-primary">{config.publishInterval}s</span>
            </div>
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={config.publishInterval}
              onChange={(e) => setConfig({ ...config, publishInterval: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5s</span>
              <span>120s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
