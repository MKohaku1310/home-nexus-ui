import { AlertTriangle, CheckCircle2, Clock, Database, Radio } from "lucide-react";
import { useState, useEffect } from "react";

export function StatusBar({
  criticalCount = 0,
  warningCount = 1,
}: {
  criticalCount?: number;
  warningCount?: number;
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 py-2.5 text-xs shadow-xs">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* MQTT */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
          </span>
          <Radio className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-foreground">MQTT Broker:</span>
          <span className="font-medium text-success">Connected</span>
        </div>

        {/* Database */}
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <Database className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-foreground">Database:</span>
          <span className="font-medium text-success">Connected</span>
        </div>


      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Last updated */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
          <Clock className="h-3 w-3" />
          <span>{now.toLocaleTimeString("vi-VN")}</span>
        </div>

        {/* Alerts badge */}
        <div className="flex items-center gap-1.5">
          {criticalCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive">
              <AlertTriangle className="h-3 w-3" />
              {criticalCount} Critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground">
              <AlertTriangle className="h-3 w-3" />
              {warningCount} Cảnh báo
            </span>
          )}
          {criticalCount === 0 && warningCount === 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
              <CheckCircle2 className="h-3 w-3" />
              Bình thường
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
