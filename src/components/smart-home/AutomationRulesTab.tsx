import { useState } from "react";
import {
  AirVent,
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Droplets,
  Edit2,
  Fan,
  Lightbulb,
  Plus,
  Power,
  Sun,
  Thermometer,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { initialAutomationRules, AutomationRule } from "./mockData";

export function AutomationRulesTab() {
  const [rules, setRules] = useState<AutomationRule[]>(initialAutomationRules);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Rule Form State
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleRoom, setNewRuleRoom] = useState("Phòng 1 (Phòng Khách)");
  const [newRuleSensor, setNewRuleSensor] = useState("Nhiệt độ (DHT11)");
  const [newRuleOperator, setNewRuleOperator] = useState<">" | "<" | "=" | "≥" | "≤">(">");
  const [newRuleValue, setNewRuleValue] = useState<number>(30);
  const [newRuleUnit, setNewRuleUnit] = useState("°C");
  const [newRuleDevice, setNewRuleDevice] = useState("Điều hòa (AC)");
  const [newRuleAction, setNewRuleAction] = useState<"ON" | "OFF">("ON");

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)),
    );
  };

  const handleDeleteRule = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa quy tắc tự động hóa này?")) {
      setRules((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const newRule: AutomationRule = {
      id: `rule_${Date.now()}`,
      name: newRuleName,
      room: newRuleRoom,
      sensorType: newRuleSensor,
      operator: newRuleOperator,
      thresholdValue: Number(newRuleValue),
      unit: newRuleUnit,
      targetDevice: newRuleDevice,
      actionOnTrigger: newRuleAction,
      isActive: true,
      lastTriggered: "Chưa kích hoạt",
    };

    setRules((prev) => [newRule, ...prev]);
    setIsAddModalOpen(false);
    setNewRuleName("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Quy tắc tự động
          </h2>
          <p className="text-xs text-muted-foreground">
            Tự động kích hoạt thiết bị theo điều kiện cảm biến
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Thêm quy tắc mới
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {rules.map((r) => (
          <div
            key={r.id}
            className={cn(
              "relative flex flex-col justify-between rounded-3xl border p-6 shadow-sm transition-all duration-200",
              r.isActive
                ? "border-primary/30 bg-card hover:border-primary/60 hover:shadow-md"
                : "border-border/60 bg-secondary/30 opacity-70",
            )}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-2xl",
                      r.isActive ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground",
                    )}
                  >
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{r.name}</h3>
                    <p className="text-xs text-muted-foreground">{r.room}</p>
                  </div>
                </div>

                {/* Active Switch Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={r.isActive}
                  onClick={() => handleToggleRule(r.id)}
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    r.isActive ? "bg-success" : "bg-muted-foreground/30",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-all duration-300 ease-out",
                      r.isActive ? "left-5.5" : "left-0.5",
                    )}
                  />
                </button>
              </div>

              {/* Logic Box (IF - THEN) */}
              <div className="mt-4 rounded-2xl bg-secondary/50 p-3.5 text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-primary">IF:</span>
                  <span className="font-semibold text-foreground">
                    {r.sensorType} {r.operator} {r.thresholdValue} {r.unit}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 font-mono border-t border-border/40 pt-1.5">
                  <span className="font-bold text-success">THEN:</span>
                  <span className="font-semibold text-foreground">
                    {r.targetDevice} ={" "}
                    <span className={r.actionOnTrigger === "ON" ? "text-success" : "text-destructive"}>
                      {r.actionOnTrigger}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Status & Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Lần chạy: {r.lastTriggered || "Chưa kích hoạt"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteRule(r.id)}
                  className="rounded-xl p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Xóa quy tắc"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Thêm Quy Tắc Mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-display text-base font-bold text-foreground">
                Tạo Quy Tắc Tự Động Hóa Mới (IF-THEN)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddRule} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-foreground">
                  Tên quy tắc:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tự động bật quạt khi trời nồm..."
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-foreground">Phòng:</label>
                  <select
                    value={newRuleRoom}
                    onChange={(e) => setNewRuleRoom(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium"
                  >
                    <option value="Phòng 1 (Phòng Khách)">Phòng 1 (Phòng Khách)</option>
                    <option value="Phòng 2 (Phòng Ngủ)">Phòng 2 (Phòng Ngủ)</option>
                    <option value="Ban công">Ban công</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-semibold text-foreground">Cảm biến:</label>
                  <select
                    value={newRuleSensor}
                    onChange={(e) => {
                      setNewRuleSensor(e.target.value);
                      if (e.target.value.includes("Nhiệt độ")) {
                        setNewRuleUnit("°C");
                        setNewRuleValue(28);
                      } else if (e.target.value.includes("Độ ẩm")) {
                        setNewRuleUnit("%");
                        setNewRuleValue(75);
                      } else {
                        setNewRuleUnit("Lux");
                        setNewRuleValue(200);
                      }
                    }}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium"
                  >
                    <option value="Nhiệt độ (DHT11)">Nhiệt độ (DHT11)</option>
                    <option value="Độ ẩm (DHT11)">Độ ẩm (DHT11)</option>
                    <option value="Ánh sáng (BH1750)">Ánh sáng (BH1750)</option>
                  </select>
                </div>
              </div>

              {/* Condition Section */}
              <div className="rounded-2xl bg-secondary/50 p-3">
                <p className="mb-2 font-bold text-primary uppercase tracking-wider">Điều Kiện (IF):</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-muted-foreground">Toán tử:</label>
                    <select
                      value={newRuleOperator}
                      onChange={(e) => setNewRuleOperator(e.target.value as any)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium"
                    >
                      <option value=">">Lớn hơn (&gt;)</option>
                      <option value="<">Nhỏ hơn (&lt;)</option>
                      <option value="≥">Lớn hơn hoặc bằng (&ge;)</option>
                      <option value="≤">Nhỏ hơn hoặc bằng (&le;)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-muted-foreground">Giá trị ngưỡng ({newRuleUnit}):</label>
                    <input
                      type="number"
                      required
                      value={newRuleValue}
                      onChange={(e) => setNewRuleValue(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="rounded-2xl bg-secondary/50 p-3">
                <p className="mb-2 font-bold text-success uppercase tracking-wider">Hành Động (THEN):</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-muted-foreground">Thiết bị tác động:</label>
                    <select
                      value={newRuleDevice}
                      onChange={(e) => setNewRuleDevice(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium"
                    >
                      <option value="Điều hòa (AC)">Điều hòa (AC)</option>
                      <option value="Quạt (Fan)">Quạt (Fan)</option>
                      <option value="Đèn (Light)">Đèn (Light)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-muted-foreground">Trạng thái:</label>
                    <select
                      value={newRuleAction}
                      onChange={(e) => setNewRuleAction(e.target.value as any)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium font-bold text-success"
                    >
                      <option value="ON">BẬT (ON)</option>
                      <option value="OFF">TẮT (OFF)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-border/80 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Lưu Quy Tắc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
