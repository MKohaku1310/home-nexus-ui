import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DataStatus, ActionStatus } from "@/lib/smart-home-data";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("glass-panel rounded-3xl", className)}>{children}</div>;
}

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
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

export function StatusBadge({ ok, children }: { ok: boolean; children: ReactNode }) {
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

const dataTone: Record<DataStatus, string> = {
  NORMAL: "bg-success/15 text-success",
  WARNING: "bg-warning/20 text-warning-foreground",
  CRITICAL: "bg-destructive/15 text-destructive",
};
const dataDot: Record<DataStatus, string> = {
  NORMAL: "bg-success",
  WARNING: "bg-warning",
  CRITICAL: "bg-destructive",
};

export function DataStatusPill({ status, children }: { status: DataStatus; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        dataTone[status],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dataDot[status])} />
      {children}
    </span>
  );
}

const actionTone: Record<ActionStatus, string> = {
  SUCCESS: "bg-success/15 text-success",
  FAILED: "bg-destructive/15 text-destructive",
  PENDING: "bg-warning/20 text-warning-foreground",
};
const actionText: Record<ActionStatus, string> = {
  SUCCESS: "✓ Thành công",
  FAILED: "✗ Thất bại",
  PENDING: "⏳ Đang chờ",
};

export function ActionStatusPill({ status }: { status: ActionStatus }) {
  return (
    <span
      className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", actionTone[status])}
    >
      {actionText[status]}
    </span>
  );
}

export const fieldClass =
  "h-10 w-full rounded-xl border border-input bg-background/80 px-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  ariaLabel?: string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={fieldClass}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Button({
  children,
  onClick,
  variant = "secondary",
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
        variant === "primary" && "bg-primary text-primary-foreground hover:opacity-90",
        variant === "secondary" && "bg-secondary text-foreground hover:bg-accent",
        variant === "ghost" && "text-muted-foreground hover:bg-secondary hover:text-foreground",
        variant === "danger" && "bg-destructive/12 text-destructive hover:bg-destructive/20",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SortableTh({
  label,
  active,
  dir,
  onClick,
  className,
}: {
  label: string;
  active?: boolean;
  dir?: "asc" | "desc";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <th className={cn("px-5 py-3 text-left font-semibold", className)}>
      {onClick ? (
        <button
          onClick={onClick}
          className={cn(
            "inline-flex items-center gap-1 transition-colors hover:text-foreground",
            active && "text-foreground",
          )}
        >
          {label}
          <span className="text-[10px]">{active ? (dir === "asc" ? "▲" : "▼") : "↕"}</span>
        </button>
      ) : (
        label
      )}
    </th>
  );
}

export function Pagination({
  page,
  pageCount,
  pageSize,
  total,
  onPage,
  onPageSize,
}: {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
  onPageSize: (n: number) => void;
}) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Hiển thị</span>
        <select
          aria-label="Số bản ghi mỗi trang"
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          className="h-9 rounded-xl border border-input bg-background/80 px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          {[10, 25, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>/ {total} bản ghi</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" onClick={() => onPage(Math.max(1, page - 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && p - (pages[i - 1] ?? 0) > 1 && (
              <span className="px-1 text-muted-foreground">…</span>
            )}
            <button
              onClick={() => onPage(p)}
              aria-current={p === page}
              className={cn(
                "h-9 min-w-9 rounded-xl px-3 text-sm font-semibold transition-colors",
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {p}
            </button>
          </span>
        ))}
        <Button variant="ghost" onClick={() => onPage(Math.min(pageCount, page + 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        aria-label="Đóng"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-popover p-6 shadow-[var(--shadow-float)] sm:rounded-3xl",
          wide ? "sm:max-w-2xl" : "sm:max-w-lg",
        )}
      >
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
