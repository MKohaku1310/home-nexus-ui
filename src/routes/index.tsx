import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Cpu,
  History,
  LayoutDashboard,
  Radio,
  Settings2,
  Table2,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBar } from "@/components/smart-home/StatusBar";
import { DashboardTab } from "@/components/smart-home/DashboardTab";
import { SensorsTab } from "@/components/smart-home/SensorsTab";
import { ActionHistoryTab } from "@/components/smart-home/ActionHistoryTab";
import { ThresholdSettingsTab } from "@/components/smart-home/ThresholdSettingsTab";
import { ProfileTab } from "@/components/smart-home/ProfileTab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bảng Điều Khiển Smart Home IoT | Dashboard" },
      {
        name: "description",
        content:
          "Hệ thống giám sát và điều khiển Smart Home IoT qua MQTT: theo dõi nhiệt độ, độ ẩm, ánh sáng, nhật ký hành động và tự động hóa thiết bị.",
      },
      { property: "og:title", content: "Smart Home IoT Dashboard & MQTT" },
      {
        property: "og:description",
        content:
          "Giám sát cảm biến thời gian thực, điều khiển quạt, đèn, điều hòa và cấu hình ngưỡng tự động hóa cho ngôi nhà thông minh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmartHomeApp,
});

const TABS = [
  { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard, desc: "Giám sát & điều khiển thời gian thực" },
  { id: "sensors", label: "Dữ liệu cảm biến", icon: Table2, desc: "Bảng dữ liệu đo đạc & phân tích" },
  { id: "logs", label: "Nhật ký hành động", icon: History, desc: "Lịch sử điều khiển & phản hồi phần cứng" },
  { id: "settings", label: "Cài đặt ngưỡng", icon: Settings2, desc: "Cấu hình ngưỡng an toàn & cảnh báo" },
] as const;

type TabId = (typeof TABS)[number]["id"] | "profile";

const mockNotifications = [
  {
    id: 1,
    title: "Cảnh báo độ ẩm cao",
    desc: "Độ ẩm đạt 80.0% (> 75%) — đã kích hoạt Quạt thông gió",
    time: "2 phút trước",
    tone: "danger" as const,
  },
  {
    id: 2,
    title: "Tự động điều chỉnh",
    desc: "Nhiệt độ ổn định ở mức 20.5°C",
    time: "15 phút trước",
    tone: "ok" as const,
  },
  {
    id: 3,
    title: "MQTT Broker Connected",
    desc: "Đã đồng bộ 42 bản ghi telemetry qua MQTT",
    time: "1 giờ trước",
    tone: "ok" as const,
  },
];

function SmartHomeApp() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const currentTab =
    activeTab === "profile"
      ? { id: "profile", label: "Hồ sơ cá nhân", desc: "Thông tin nhà phát triển hệ thống" }
      : TABS.find((t) => t.id === activeTab) || TABS[0];

  const navContent = (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className="flex items-center gap-3.5 px-6 py-6 border-b border-border/40">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
          <Cpu className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-bold text-foreground">
            Cổng IoT Smart Home
          </p>
          <p className="truncate text-xs font-medium text-muted-foreground">
            Smart IoT Hub • MQTT
          </p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1.5 px-4 py-5 overflow-y-auto">
        {TABS.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setNavOpen(false);
              }}
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <t.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="min-w-0 flex-1 truncate text-left">{t.label}</span>
              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-transform",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                )}
              />
            </button>
          );
        })}
      </nav>

      {/* System Status Box */}
      <div className="m-4 space-y-2.5 rounded-2xl border border-border/60 bg-secondary/50 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Trạng Thái Kết Nối
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-foreground">MQTT Broker</span>
            <span className="inline-flex items-center gap-1 font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Online
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground">Database</span>
            <span className="inline-flex items-center gap-1 font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[270px] shrink-0 border-r border-border/80 bg-card shadow-xs lg:block">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
          <button
            aria-label="Đóng menu"
            className="absolute inset-0 bg-foreground/30 backdrop-blur-xs"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-card shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setNavOpen(false)}
              className="absolute right-3.5 top-6 rounded-xl p-2 text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
            {navContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Global Header */}
        <header className="sticky top-0 z-40 border-b border-border/80 bg-card/80 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNavOpen(true)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary lg:hidden"
                aria-label="Mở menu"
              >
                <LayoutDashboard className="h-4 w-4" />
              </button>
              <div>
                <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {currentTab.label}
                </h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  {currentTab.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Popover */}
              <div className="relative">
                <button
                  onClick={() => setBellOpen((v) => !v)}
                  className="relative grid h-10 w-10 place-items-center rounded-2xl border border-border bg-secondary/70 transition-all hover:bg-secondary"
                  aria-label="Thông báo"
                >
                  <Bell className="h-4 w-4 text-foreground" />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
                </button>

                {bellOpen && (
                  <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                      <p className="text-xs font-bold text-foreground">Cảnh Báo & Thông Báo</p>
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
                        1 mới
                      </span>
                    </div>
                    <ul className="divide-y divide-border/40">
                      {mockNotifications.map((n) => (
                        <li key={n.id} className="p-3.5 hover:bg-secondary/50 transition-colors">
                          <div className="flex items-start gap-2.5">
                            <span
                              className={cn(
                                "mt-1 h-2 w-2 shrink-0 rounded-full",
                                n.tone === "danger" && "bg-destructive",
                                n.tone === "ok" && "bg-success",
                              )}
                            />
                            <div>
                              <p className="text-xs font-semibold text-foreground">{n.title}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">{n.desc}</p>
                              <p className="mt-1 text-xs text-muted-foreground/80">{n.time}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* User Profile Quick Action */}
              <button
                onClick={() => setActiveTab("profile")}
                className={cn(
                  "flex items-center gap-2.5 rounded-2xl border py-1.5 pl-1.5 pr-3 transition-all hover:shadow-xs",
                  activeTab === "profile"
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : "border-border bg-secondary/70 hover:bg-secondary",
                )}
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-xs font-bold text-primary-foreground">
                  NA
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold text-foreground">Ngọc Anh</p>
                  <p className="text-xs text-muted-foreground">K67 • IoT System</p>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 space-y-6 px-4 py-6 sm:px-8 sm:py-8">
          {/* Top Status Bar on all screens */}
          <StatusBar criticalCount={0} warningCount={1} />

          {/* Active Tab View */}
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "sensors" && <SensorsTab />}
          {activeTab === "logs" && <ActionHistoryTab />}
          {activeTab === "settings" && <ThresholdSettingsTab />}
          {activeTab === "profile" && <ProfileTab />}
        </main>
      </div>
    </div>
  );
}
