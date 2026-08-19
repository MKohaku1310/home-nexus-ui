/* Mock domain data mirroring the IoT schema (Rooms, Sensors, Data_Sensor, Devices, Action, Thresholds). */

export type RoomId = "1" | "2";

export const rooms: { room_id: RoomId; room_name: string; room_location: string }[] = [
  { room_id: "1", room_name: "Phòng 1 · Phòng khách", room_location: "Tầng 1" },
  { room_id: "2", room_name: "Phòng 2 · Phòng ngủ", room_location: "Tầng 2" },
];

export type SensorType = "TEMPERATURE" | "HUMIDITY" | "LIGHT";

export const sensors: {
  sensor_id: string;
  sensor_name: string;
  sensor_type: SensorType;
  room_id: RoomId;
  unit: string;
}[] = [
  { sensor_id: "s1", sensor_name: "DHT11", sensor_type: "TEMPERATURE", room_id: "1", unit: "°C" },
  { sensor_id: "s2", sensor_name: "DHT11", sensor_type: "HUMIDITY", room_id: "1", unit: "%" },
  { sensor_id: "s3", sensor_name: "BH1750", sensor_type: "LIGHT", room_id: "1", unit: "Lux" },
  { sensor_id: "s4", sensor_name: "DHT11", sensor_type: "TEMPERATURE", room_id: "2", unit: "°C" },
  { sensor_id: "s5", sensor_name: "DHT11", sensor_type: "HUMIDITY", room_id: "2", unit: "%" },
  { sensor_id: "s6", sensor_name: "BH1750", sensor_type: "LIGHT", room_id: "2", unit: "Lux" },
];

export type DataStatus = "NORMAL" | "WARNING" | "CRITICAL";

export function tempStatus(v: number): DataStatus {
  if (v > 32 || v < 15) return "CRITICAL";
  if (v > 28) return "WARNING";
  return "NORMAL";
}
export function humStatus(v: number): DataStatus {
  if (v > 85 || v < 20) return "CRITICAL";
  if (v > 70 || v < 30) return "WARNING";
  return "NORMAL";
}
export function lightStatus(v: number): DataStatus {
  if (v > 1000 || v < 50) return "WARNING";
  return "NORMAL";
}

export function statusOf(type: SensorType, v: number): DataStatus {
  if (type === "TEMPERATURE") return tempStatus(v);
  if (type === "HUMIDITY") return humStatus(v);
  return lightStatus(v);
}

export const statusLabel: Record<DataStatus, string> = {
  NORMAL: "Bình thường",
  WARNING: "Cảnh báo",
  CRITICAL: "Nguy hiểm",
};

/* ------------------------------ time series ------------------------------ */

export type Point = { time: string; temp: number; hum: number; lux: number };

export const series: Record<RoomId, Point[]> = {
  "1": [
    { time: "08:00", temp: 27.4, hum: 68, lux: 210 },
    { time: "09:00", temp: 28.1, hum: 66, lux: 380 },
    { time: "10:00", temp: 29.6, hum: 63, lux: 540 },
    { time: "11:00", temp: 31.2, hum: 60, lux: 720 },
    { time: "12:00", temp: 33.5, hum: 57, lux: 860 },
    { time: "13:00", temp: 34.8, hum: 55, lux: 910 },
    { time: "14:00", temp: 33.9, hum: 58, lux: 780 },
    { time: "15:00", temp: 33.1, hum: 61, lux: 620 },
  ],
  "2": [
    { time: "08:00", temp: 25.2, hum: 72, lux: 90 },
    { time: "09:00", temp: 25.8, hum: 71, lux: 140 },
    { time: "10:00", temp: 26.4, hum: 69, lux: 220 },
    { time: "11:00", temp: 27.1, hum: 67, lux: 310 },
    { time: "12:00", temp: 27.6, hum: 66, lux: 420 },
    { time: "13:00", temp: 27.9, hum: 65, lux: 460 },
    { time: "14:00", temp: 27.4, hum: 66, lux: 380 },
    { time: "15:00", temp: 26.8, hum: 68, lux: 260 },
  ],
};

/* ---------------------------- sensor data rows ---------------------------- */

export type DataRow = {
  data_id: string;
  timestamp: string;
  sensor_name: string;
  sensor_type: SensorType;
  room_id: RoomId;
  value: number;
  unit: string;
  topic: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export const dataRows: DataRow[] = (() => {
  const out: DataRow[] = [];
  let id = 1;
  (["1", "2"] as RoomId[]).forEach((room) => {
    series[room].forEach((p, i) => {
      const ts = `2026-08-19 ${p.time}:${pad((i * 13) % 60)}`;
      out.push({
        data_id: `d${id++}`,
        timestamp: ts,
        sensor_name: "DHT11",
        sensor_type: "TEMPERATURE",
        room_id: room,
        value: p.temp,
        unit: "°C",
        topic: "data/sensors",
      });
      out.push({
        data_id: `d${id++}`,
        timestamp: ts,
        sensor_name: "DHT11",
        sensor_type: "HUMIDITY",
        room_id: room,
        value: p.hum,
        unit: "%",
        topic: "data/sensors",
      });
      out.push({
        data_id: `d${id++}`,
        timestamp: ts,
        sensor_name: "BH1750",
        sensor_type: "LIGHT",
        room_id: room,
        value: p.lux,
        unit: "Lux",
        topic: "data/sensors",
      });
    });
  });
  return out.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
})();

/* --------------------------------- actions -------------------------------- */

export type ActionStatus = "SUCCESS" | "FAILED" | "PENDING";

export type ActionRow = {
  action_id: string;
  timestamp: string;
  device_name: string;
  room_id: RoomId;
  action_type: "ON" | "OFF" | "MODE_CHANGE";
  performed_by: string;
  is_automation: boolean;
  status: ActionStatus;
};

export const actionRows: ActionRow[] = [
  { action_id: "a1", timestamp: "2026-08-19 15:02:10", device_name: "AC Phòng 1", room_id: "1", action_type: "ON", performed_by: "Automation (Temp > 32°C)", is_automation: true, status: "SUCCESS" },
  { action_id: "a2", timestamp: "2026-08-19 14:41:33", device_name: "Light Phòng 1", room_id: "1", action_type: "MODE_CHANGE", performed_by: "user_admin", is_automation: false, status: "SUCCESS" },
  { action_id: "a3", timestamp: "2026-08-19 14:20:45", device_name: "Light Phòng 2", room_id: "2", action_type: "OFF", performed_by: "user_admin", is_automation: false, status: "SUCCESS" },
  { action_id: "a4", timestamp: "2026-08-19 14:19:30", device_name: "Fan Phòng 1", room_id: "1", action_type: "ON", performed_by: "Automation (Humidity > 70%)", is_automation: true, status: "FAILED" },
  { action_id: "a5", timestamp: "2026-08-19 13:58:47", device_name: "AC Phòng 2", room_id: "2", action_type: "OFF", performed_by: "user_admin", is_automation: false, status: "PENDING" },
  { action_id: "a6", timestamp: "2026-08-19 13:22:05", device_name: "Fan Phòng 2", room_id: "2", action_type: "ON", performed_by: "Automation (Temp > 28°C)", is_automation: true, status: "SUCCESS" },
  { action_id: "a7", timestamp: "2026-08-19 12:04:51", device_name: "Light Phòng 1", room_id: "1", action_type: "OFF", performed_by: "user_admin", is_automation: false, status: "SUCCESS" },
  { action_id: "a8", timestamp: "2026-08-19 11:36:12", device_name: "AC Phòng 1", room_id: "1", action_type: "OFF", performed_by: "Automation (Temp < 25°C)", is_automation: true, status: "SUCCESS" },
  { action_id: "a9", timestamp: "2026-08-19 10:58:02", device_name: "Fan Phòng 1", room_id: "1", action_type: "MODE_CHANGE", performed_by: "user_admin", is_automation: false, status: "SUCCESS" },
  { action_id: "a10", timestamp: "2026-08-19 10:12:40", device_name: "Light Phòng 2", room_id: "2", action_type: "ON", performed_by: "Automation (Light < 200 Lux)", is_automation: true, status: "SUCCESS" },
  { action_id: "a11", timestamp: "2026-08-19 09:44:19", device_name: "AC Phòng 2", room_id: "2", action_type: "ON", performed_by: "user_admin", is_automation: false, status: "FAILED" },
  { action_id: "a12", timestamp: "2026-08-19 09:01:55", device_name: "Fan Phòng 2", room_id: "2", action_type: "OFF", performed_by: "user_admin", is_automation: false, status: "SUCCESS" },
];

/* ------------------------------- devices --------------------------------- */

export type DeviceKind = "AC" | "FAN" | "LIGHT";

export type DeviceRow = {
  device_id: string;
  device_name: string;
  room_id: RoomId;
  kind: DeviceKind;
  on: boolean;
  auto: boolean;
  last_control: string;
  control_source: "Manual" | "Auto";
};

export const initialDevices: DeviceRow[] = [
  { device_id: "ac_1", device_name: "AC Phòng 1", room_id: "1", kind: "AC", on: true, auto: true, last_control: "5 phút trước", control_source: "Auto" },
  { device_id: "fan_1", device_name: "Fan Phòng 1", room_id: "1", kind: "FAN", on: true, auto: false, last_control: "18 phút trước", control_source: "Manual" },
  { device_id: "led_1", device_name: "Light Phòng 1", room_id: "1", kind: "LIGHT", on: false, auto: true, last_control: "1 giờ trước", control_source: "Auto" },
  { device_id: "ac_2", device_name: "AC Phòng 2", room_id: "2", kind: "AC", on: false, auto: false, last_control: "2 giờ trước", control_source: "Manual" },
  { device_id: "fan_2", device_name: "Fan Phòng 2", room_id: "2", kind: "FAN", on: false, auto: true, last_control: "3 giờ trước", control_source: "Auto" },
  { device_id: "led_2", device_name: "Light Phòng 2", room_id: "2", kind: "LIGHT", on: true, auto: false, last_control: "12 phút trước", control_source: "Manual" },
];

/* ------------------------------ automation -------------------------------- */

export type Rule = {
  threshold_id: string;
  name: string;
  room_id: RoomId;
  sensor_type: SensorType;
  condition_type: "GREATER_THAN" | "LESS_THAN";
  threshold_value: number;
  device_id: string;
  action_on_trigger: "ON" | "OFF";
  is_active: boolean;
};

export const initialRules: Rule[] = [
  { threshold_id: "t1", name: "AC Phòng 1 bật tự động", room_id: "1", sensor_type: "TEMPERATURE", condition_type: "GREATER_THAN", threshold_value: 28, device_id: "ac_1", action_on_trigger: "ON", is_active: true },
  { threshold_id: "t2", name: "Tắt quạt khi độ ẩm thấp", room_id: "1", sensor_type: "HUMIDITY", condition_type: "LESS_THAN", threshold_value: 50, device_id: "fan_1", action_on_trigger: "OFF", is_active: true },
  { threshold_id: "t3", name: "Bật đèn khi trời tối", room_id: "2", sensor_type: "LIGHT", condition_type: "LESS_THAN", threshold_value: 200, device_id: "led_2", action_on_trigger: "ON", is_active: false },
];

export const sensorTypeLabel: Record<SensorType, string> = {
  TEMPERATURE: "Nhiệt độ",
  HUMIDITY: "Độ ẩm",
  LIGHT: "Ánh sáng",
};

export const unitOf: Record<SensorType, string> = {
  TEMPERATURE: "°C",
  HUMIDITY: "%",
  LIGHT: "Lux",
};

/* ----------------------------- notifications ------------------------------ */

export type Notice = {
  id: string;
  title: string;
  desc: string;
  time: string;
  level: "info" | "warning" | "critical";
};

export const initialNotices: Notice[] = [
  { id: "n1", title: "Nhiệt độ vượt ngưỡng", desc: "Phòng 1: 33.1°C > 32°C — đã bật điều hòa", time: "2 phút trước", level: "critical" },
  { id: "n2", title: "Độ ẩm thấp", desc: "Phòng 1: 55% dưới mức khuyến nghị 60%", time: "18 phút trước", level: "warning" },
  { id: "n3", title: "Thiết bị không phản hồi", desc: "Fan Phòng 1 timeout sau 3 lần thử", time: "42 phút trước", level: "warning" },
  { id: "n4", title: "MQTT phục hồi", desc: "Broker cloud.mqtt.com kết nối lại thành công", time: "1 giờ trước", level: "info" },
];

export function toCsv(headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  return [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}

export function downloadFile(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
