import { useState, useMemo } from "react";
import {
  AirVent,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Cpu,
  Fan,
  Filter,
  Lightbulb,
  Loader2,
  Search,
  UserCheck,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { initialActionRecords, ActionRecord } from "./mockData";

export function ActionHistoryTab() {
  const [records] = useState<ActionRecord[]>(initialActionRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Sorting
  const [sortField, setSortField] = useState<keyof ActionRecord>("sentTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (field: keyof ActionRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        const matchesSearch =
          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.sentTime.includes(searchTerm);

        const matchesDevice =
          selectedDevice === "ALL" || r.deviceType === selectedDevice;

        const matchesStatus =
          selectedStatus === "ALL" || r.status === selectedStatus;

        return matchesSearch && matchesDevice && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === "string") {
          return sortOrder === "asc"
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }
        return 0;
      });
  }, [records, searchTerm, selectedDevice, selectedStatus, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Nhật ký hành động
            </h2>
            <p className="text-xs text-muted-foreground">
              Lịch sử điều khiển thiết bị và phản hồi trạng thái phần cứng
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Độ trễ trung bình: ~0.9s
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm hành động, thiết bị..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-border bg-background py-2.5 pl-10 pr-4 text-xs font-medium placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Device Filter */}
          <div>
            <select
              value={selectedDevice}
              onChange={(e) => {
                setSelectedDevice(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">Tất cả thiết bị</option>
              <option value="FAN">Quạt</option>
              <option value="LIGHT">Đèn</option>
              <option value="AC">Điều hòa</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ON">🟢 ON (Bật)</option>
              <option value="OFF">⚪ OFF (Tắt)</option>
              <option value="LOADING">⏳ Đang gửi</option>
              <option value="SUCCESS">✓ Thành công</option>
              <option value="FAILED">✗ Thất bại</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-secondary/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <th
                  onClick={() => handleSort("id")}
                  className="cursor-pointer px-6 py-4 transition-colors hover:text-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <span>ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("deviceName")}
                  className="cursor-pointer px-6 py-4 transition-colors hover:text-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Thiết bị</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Hành động</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th
                  onClick={() => handleSort("sentTime")}
                  className="cursor-pointer px-6 py-4 transition-colors hover:text-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Thời gian gửi</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Thời gian phản hồi</th>
                <th className="px-6 py-4">Thực hiện bởi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-primary">{r.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-secondary text-foreground">
                          {r.deviceType === "FAN" && <Fan className="h-4 w-4" />}
                          {r.deviceType === "LIGHT" && <Lightbulb className="h-4 w-4 text-amber-500" />}
                          {r.deviceType === "AC" && <AirVent className="h-4 w-4 text-sky-500" />}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{r.deviceName}</p>
                          <p className="text-xs text-muted-foreground">{r.detail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-lg px-2 py-0.5 font-mono text-xs font-bold",
                          r.action === "ON" && "bg-success/15 text-success",
                          r.action === "OFF" && "bg-secondary text-muted-foreground",
                          r.action === "MODE_CHANGE" && "bg-primary/15 text-primary",
                        )}
                      >
                        {r.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {r.status === "ON" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" />
                          ON
                        </span>
                      )}
                      {r.status === "OFF" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                          OFF
                        </span>
                      )}
                      {r.status === "LOADING" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-semibold text-warning-foreground">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Loading...
                        </span>
                      )}
                      {r.status === "SUCCESS" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                          <CheckCircle2 className="h-3 w-3" />
                          Thành công
                        </span>
                      )}
                      {r.status === "FAILED" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                          <AlertTriangle className="h-3 w-3" />
                          Thất bại
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {r.sentTime}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-medium text-foreground">
                      {r.responseTime}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        {r.performedBy.includes("Tự động") ? (
                          <Cpu className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <span>{r.performedBy}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    Không có nhật ký nào thỏa mãn bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/80 px-6 py-4 sm:flex-row">
          <div className="text-xs text-muted-foreground">
            Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, filteredRecords.length)} trên tổng số{" "}
            {filteredRecords.length} hành động
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40"
            >
              « Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "h-7 w-7 rounded-xl text-xs font-semibold transition-colors",
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-muted-foreground",
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40"
            >
              Sau »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
