import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Code,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { initialSensorRecords, SensorDataRecord } from "./mockData";

export function SensorsTab() {
  const [records, setRecords] = useState<SensorDataRecord[]>(initialSensorRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSensorType, setSelectedSensorType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedRecordForJson, setSelectedRecordForJson] = useState<SensorDataRecord | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<keyof SensorDataRecord>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (field: keyof SensorDataRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filtered and Sorted Records
  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        const matchesSearch =
          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.sensorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.timestamp.includes(searchTerm);

        const matchesType =
          selectedSensorType === "ALL" || r.sensorType === selectedSensorType;

        const matchesStatus =
          selectedStatus === "ALL" || r.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === "string") {
          return sortOrder === "asc"
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }
        if (typeof valA === "number") {
          return sortOrder === "asc"
            ? (valA as number) - (valB as number)
            : (valB as number) - (valA as number);
        }
        return 0;
      });
  }, [records, searchTerm, selectedSensorType, selectedStatus, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleExportCSV = () => {
    const headers = ["ID", "Tên Cảm Biến", "Phòng", "Giá Trị", "Đơn Vị", "Thời Gian (YYYY-MM-DD HH:mm:ss)", "Trạng Thái"];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.sensorName,
      r.room,
      r.value,
      r.unit,
      r.timestamp,
      r.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sensor_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Dữ liệu cảm biến
            </h2>
            <p className="text-xs text-muted-foreground">
              Bảng dữ liệu đo đạc chi tiết theo thời gian thực
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/70 px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <Download className="h-3.5 w-3.5 text-primary" />
              Xuất CSV
            </button>
            <button
              onClick={() => alert("Tính năng Xuất Excel đã sẵn sàng!")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/70 px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-success" />
              Xuất Excel
            </button>
            <button
              onClick={() => alert("Tính năng Xuất PDF đã sẵn sàng!")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/70 px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <FileText className="h-3.5 w-3.5 text-destructive" />
              Xuất PDF
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm cảm biến, vị trí..."
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

          {/* Filter theo loại cảm biến */}
          <div>
            <select
              value={selectedSensorType}
              onChange={(e) => {
                setSelectedSensorType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">Tất cả cảm biến</option>
              <option value="TEMPERATURE">Nhiệt độ (°C)</option>
              <option value="HUMIDITY">Độ ẩm (%)</option>
              <option value="LIGHT">Ánh sáng (Lux)</option>
              <option value="DISTANCE">Khoảng cách (cm)</option>
            </select>
          </div>

          {/* Filter theo trạng thái */}
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
              <option value="NORMAL">🟢 Bình thường</option>
              <option value="WARNING">🟡 Cảnh báo</option>
              <option value="CRITICAL">🔴 Nguy cấp</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSensorType("ALL");
                setSelectedStatus("ALL");
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-border/80 bg-secondary/50 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Xóa bộ lọc
            </button>
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
                  onClick={() => handleSort("sensorName")}
                  className="cursor-pointer px-6 py-4 transition-colors hover:text-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Tên cảm biến</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Vị trí</th>
                <th
                  onClick={() => handleSort("value")}
                  className="cursor-pointer px-6 py-4 transition-colors hover:text-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Giá trị</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("timestamp")}
                  className="cursor-pointer px-6 py-4 transition-colors hover:text-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Thời gian</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r) => (
                  <tr
                    key={r.id}
                    className="transition-colors hover:bg-secondary/40 cursor-pointer"
                    onClick={() => setSelectedRecordForJson(r)}
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-primary">{r.id}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">{r.sensorName}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{r.room}</td>
                    <td className="px-6 py-4">
                      <span className="font-display text-base font-bold text-foreground">
                        {r.value}
                      </span>{" "}
                      <span className="text-xs font-medium text-muted-foreground">{r.unit}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {r.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          r.status === "NORMAL" && "bg-success/15 text-success",
                          r.status === "WARNING" && "bg-warning/15 text-warning-foreground",
                          r.status === "CRITICAL" && "bg-destructive/15 text-destructive",
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {r.status === "NORMAL" && "Bình thường"}
                        {r.status === "WARNING" && "Cảnh báo"}
                        {r.status === "CRITICAL" && "Nguy cấp"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecordForJson(r);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Code className="h-3 w-3" />
                        JSON
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    Không tìm thấy bản ghi nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/80 px-6 py-4 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Hiển thị</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-medium"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>trong tổng số {filteredRecords.length} bản ghi</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
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
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sau »
            </button>
          </div>
        </div>
      </div>

      {/* Raw JSON MQTT Payload Modal */}
      {selectedRecordForJson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="font-display text-base font-bold text-foreground">
                  Chi tiết Bản ghi {selectedRecordForJson.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecordForJson(null)}
                className="rounded-xl p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">MQTT Topic:</span>
                <span className="font-mono font-semibold text-primary">{selectedRecordForJson.topic}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Cảm biến:</span>
                <span className="font-semibold text-foreground">{selectedRecordForJson.sensorName} ({selectedRecordForJson.room})</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Thời gian ghi nhận:</span>
                <span className="font-mono text-foreground">{selectedRecordForJson.timestamp}</span>
              </div>

              <div>
                <p className="mb-1 font-semibold text-foreground">Raw MQTT JSON Payload:</p>
                <pre className="rounded-2xl bg-secondary/80 p-4 font-mono text-xs text-foreground overflow-x-auto">
                  {JSON.stringify(selectedRecordForJson.rawPayload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedRecordForJson(null)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
