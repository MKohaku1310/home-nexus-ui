export interface SensorDataRecord {
  id: string;
  sensorName: string;
  sensorType: "TEMPERATURE" | "HUMIDITY" | "LIGHT" | "DISTANCE";
  room: string;
  value: number;
  unit: string;
  timestamp: string;
  status: "NORMAL" | "WARNING" | "CRITICAL";
  topic: string;
  rawPayload: Record<string, unknown>;
}

export interface ActionRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: "FAN" | "LIGHT" | "AC";
  action: "ON" | "OFF" | "MODE_CHANGE" | "SPEED_CHANGE";
  status: "ON" | "OFF" | "LOADING" | "SUCCESS" | "FAILED";
  sentTime: string; // TG gửi lệnh (TG bật)
  responseTime: string; // TG phản hồi từ Hardware ACK
  performedBy: string; // User / Automation
  detail: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  room: string;
  sensorType: string;
  operator: ">" | "<" | "=" | "≥" | "≤";
  thresholdValue: number;
  unit: string;
  targetDevice: string;
  actionOnTrigger: "ON" | "OFF";
  isActive: boolean;
  lastTriggered?: string;
}

export interface UserProfileData {
  displayName: string;
  studentId: string;
  classYear: string;
  dateOfBirth: string;
  gender: string;
  school: string;
  major: string;
  startYear: string;
  expectedGradYear: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  portfolio: string;
  linkedin: string;
  figma: string;
  twitter: string;
  skillsBackend: string[];
  skillsIoT: string[];
  stats: {
    completedProjects: number;
    githubCommits: number;
    repositories: number;
    streakDays: number;
    learningHours: number;
    joinedDate: string;
  };
}

export const initialProfile: UserProfileData = {
  displayName: "Ngọc Anh",
  studentId: "B21DCCN000",
  classYear: "K67 (Class 2023)",
  dateOfBirth: "15/10/2003",
  gender: "Nữ",
  school: "Học viện Công nghệ Bưu chính Viễn thông (PTIT)",
  major: "Computer Science - IoT & Backend Development",
  startYear: "2023",
  expectedGradYear: "2027",
  email: "ngocanh.iot@ptit.edu.vn",
  phone: "0987 654 321",
  location: "Hà Đông, Hà Nội, Việt Nam",
  github: "https://github.com/ngocanh-iot",
  portfolio: "https://home-nexus-iot.ptit.dev",
  linkedin: "https://linkedin.com/in/ngocanh-developer",
  figma: "https://www.figma.com/@ngocanh_iot_ui",
  twitter: "https://twitter.com/ngocanh_iot",
  skillsBackend: ["Java", "Spring Boot", "PostgreSQL", "Supabase"],
  skillsIoT: ["ESP32", "MQTT", "DHT11", "BH1750", "C++"],
  stats: {
    completedProjects: 12,
    githubCommits: 456,
    repositories: 24,
    streakDays: 45,
    learningHours: 520,
    joinedDate: "2023-09-01",
  },
};

export const initialChartData = [
  { time: "08:00:00", temp: 20.2, hum: 78, lux: 450 },
  { time: "09:00:00", temp: 21.0, hum: 76, lux: 620 },
  { time: "10:00:00", temp: 22.4, hum: 74, lux: 850 },
  { time: "11:00:00", temp: 24.1, hum: 71, lux: 980 },
  { time: "12:00:00", temp: 26.5, hum: 68, lux: 1120 },
  { time: "13:00:00", temp: 27.8, hum: 65, lux: 1050 },
  { time: "14:00:00", temp: 28.5, hum: 69, lux: 1000 },
  { time: "15:00:00", temp: 26.2, hum: 75, lux: 920 },
  { time: "16:00:00", temp: 23.8, hum: 80, lux: 740 },
];

export const initialSensorRecords: SensorDataRecord[] = [
  {
    id: "#DS-001",
    sensorName: "DHT11 (Nhiệt độ)",
    sensorType: "TEMPERATURE",
    room: "Phòng 1 (Phòng Khách)",
    value: 20.5,
    unit: "°C",
    timestamp: "2026-08-19 14:15:30",
    status: "NORMAL",
    topic: "data/sensors",
    rawPayload: { temp: 20.5, humidity: 80, light: 1000, room_id: "1", timestamp: 1787123730 },
  },
  {
    id: "#DS-002",
    sensorName: "DHT11 (Độ ẩm)",
    sensorType: "HUMIDITY",
    room: "Phòng 1 (Phòng Khách)",
    value: 80.0,
    unit: "%",
    timestamp: "2026-08-19 14:15:30",
    status: "WARNING",
    topic: "data/sensors",
    rawPayload: { temp: 20.5, humidity: 80, light: 1000, room_id: "1", timestamp: 1787123730 },
  },
  {
    id: "#DS-003",
    sensorName: "BH1750 (Ánh sáng)",
    sensorType: "LIGHT",
    room: "Phòng 1 (Phòng Khách)",
    value: 1000,
    unit: "Lux",
    timestamp: "2026-08-19 14:15:30",
    status: "NORMAL",
    topic: "data/sensors",
    rawPayload: { temp: 20.5, humidity: 80, light: 1000, room_id: "1", timestamp: 1787123730 },
  },
  {
    id: "#DS-004",
    sensorName: "DHT11 (Nhiệt độ)",
    sensorType: "TEMPERATURE",
    room: "Phòng 2 (Phòng Ngủ)",
    value: 29.2,
    unit: "°C",
    timestamp: "2026-08-19 14:10:15",
    status: "WARNING",
    topic: "data/sensors",
    rawPayload: { temp: 29.2, humidity: 62, light: 420, room_id: "2", timestamp: 1787123415 },
  },
  {
    id: "#DS-005",
    sensorName: "BH1750 (Ánh sáng)",
    sensorType: "LIGHT",
    room: "Ban công",
    value: 1250,
    unit: "Lux",
    timestamp: "2026-08-19 14:05:00",
    status: "NORMAL",
    topic: "data/sensors",
    rawPayload: { temp: 28.0, humidity: 55, light: 1250, room_id: "3", timestamp: 1787123100 },
  },
  {
    id: "#DS-006",
    sensorName: "DHT11 (Nhiệt độ)",
    sensorType: "TEMPERATURE",
    room: "Phòng 1 (Phòng Khách)",
    value: 33.4,
    unit: "°C",
    timestamp: "2026-08-19 13:45:22",
    status: "CRITICAL",
    topic: "data/sensors",
    rawPayload: { temp: 33.4, humidity: 58, light: 890, room_id: "1", timestamp: 1787121922 },
  },
  {
    id: "#DS-007",
    sensorName: "DHT11 (Độ ẩm)",
    sensorType: "HUMIDITY",
    room: "Phòng 1 (Phòng Khách)",
    value: 86.0,
    unit: "%",
    timestamp: "2026-08-19 13:30:10",
    status: "CRITICAL",
    topic: "data/sensors",
    rawPayload: { temp: 22.1, humidity: 86, light: 750, room_id: "1", timestamp: 1787121010 },
  },
  {
    id: "#DS-008",
    sensorName: "HC-SR04 (Khoảng cách)",
    sensorType: "DISTANCE",
    room: "Cửa ra vào",
    value: 45,
    unit: "cm",
    timestamp: "2026-08-19 13:15:00",
    status: "NORMAL",
    topic: "data/sensors",
    rawPayload: { distance: 45, room_id: "4", timestamp: 1787120100 },
  },
];

export const initialActionRecords: ActionRecord[] = [
  {
    id: "#ACT-101",
    deviceId: "fan_1",
    deviceName: "Quạt (Fan)",
    deviceType: "FAN",
    action: "ON",
    status: "ON",
    sentTime: "2026-08-19 14:15:30",
    responseTime: "2026-08-19 14:15:31 (1.0s)",
    performedBy: "Hệ thống tự động (Độ ẩm > 75%)",
    detail: "Bật quạt thông gió do độ ẩm đạt 80%",
  },
  {
    id: "#ACT-102",
    deviceId: "led_1",
    deviceName: "Đèn (Light)",
    deviceType: "LIGHT",
    action: "OFF",
    status: "OFF",
    sentTime: "2026-08-19 14:10:00",
    responseTime: "2026-08-19 14:10:01 (0.8s)",
    performedBy: "Người dùng (Admin)",
    detail: "Tắt đèn phòng khách từ Web Dashboard",
  },
  {
    id: "#ACT-103",
    deviceId: "ac_1",
    deviceName: "Điều hòa (AC)",
    deviceType: "AC",
    action: "ON",
    status: "ON",
    sentTime: "2026-08-19 13:45:22",
    responseTime: "2026-08-19 13:45:24 (1.5s)",
    performedBy: "Hệ thống tự động (Nhiệt độ > 28°C)",
    detail: "Bật điều hòa làm mát nhiệt độ phòng 33.4°C",
  },
  {
    id: "#ACT-104",
    deviceId: "fan_1",
    deviceName: "Quạt (Fan)",
    deviceType: "FAN",
    action: "OFF",
    status: "OFF",
    sentTime: "2026-08-19 12:30:15",
    responseTime: "2026-08-19 12:30:16 (0.9s)",
    performedBy: "Người dùng (Admin)",
    detail: "Tắt quạt thủ công",
  },
  {
    id: "#ACT-105",
    deviceId: "led_1",
    deviceName: "Đèn (Light)",
    deviceType: "LIGHT",
    action: "ON",
    status: "SUCCESS",
    sentTime: "2026-08-19 11:15:00",
    responseTime: "2026-08-19 11:15:01 (0.7s)",
    performedBy: "Hệ thống tự động (Ánh sáng < 200 Lux)",
    detail: "Tự động bật đèn khi trời tối",
  },
  {
    id: "#ACT-106",
    deviceId: "ac_1",
    deviceName: "Điều hòa (AC)",
    deviceType: "AC",
    action: "MODE_CHANGE",
    status: "SUCCESS",
    sentTime: "2026-08-19 10:00:00",
    responseTime: "2026-08-19 10:00:02 (1.2s)",
    performedBy: "Người dùng (Admin)",
    detail: "Chuyển sang chế độ ECO tiết kiệm điện",
  },
];

export const initialAutomationRules: AutomationRule[] = [
  {
    id: "rule_1",
    name: "Tự động bật Điều hòa khi trời nóng",
    room: "Phòng 1 (Phòng Khách)",
    sensorType: "Nhiệt độ (DHT11)",
    operator: ">",
    thresholdValue: 28,
    unit: "°C",
    targetDevice: "Điều hòa (AC)",
    actionOnTrigger: "ON",
    isActive: true,
    lastTriggered: "2026-08-19 13:45:22",
  },
  {
    id: "rule_2",
    name: "Bật Quạt khi độ ẩm không khí cao",
    room: "Phòng 1 (Phòng Khách)",
    sensorType: "Độ ẩm (DHT11)",
    operator: ">",
    thresholdValue: 75,
    unit: "%",
    targetDevice: "Quạt (Fan)",
    actionOnTrigger: "ON",
    isActive: true,
    lastTriggered: "2026-08-19 14:15:30",
  },
  {
    id: "rule_3",
    name: "Tự động bật Đèn khi trời tối",
    room: "Phòng 1 (Phòng Khách)",
    sensorType: "Ánh sáng (BH1750)",
    operator: "<",
    thresholdValue: 200,
    unit: "Lux",
    targetDevice: "Đèn (Light)",
    actionOnTrigger: "ON",
    isActive: true,
    lastTriggered: "2026-08-19 11:15:00",
  },
  {
    id: "rule_4",
    name: "Tắt Điều hòa khi phòng đủ mát",
    room: "Phòng 1 (Phòng Khách)",
    sensorType: "Nhiệt độ (DHT11)",
    operator: "<",
    thresholdValue: 24,
    unit: "°C",
    targetDevice: "Điều hòa (AC)",
    actionOnTrigger: "OFF",
    isActive: false,
  },
];
