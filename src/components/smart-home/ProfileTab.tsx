import { useState } from "react";
import {
  CheckCircle2,
  Download,
  Edit2,
  ExternalLink,
  Figma,
  Flame,
  Github,
  GraduationCap,
  Linkedin,
  Radio,
  Share2,
  Sparkles,
  Terminal,
  User,
  X,
} from "lucide-react";
import { initialProfile, UserProfileData } from "./mockData";

export function ProfileTab() {
  const [profile, setProfile] = useState<UserProfileData>(initialProfile);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserProfileData>(initialProfile);
  const [skillsBackendInput, setSkillsBackendInput] = useState(
    initialProfile.skillsBackend.join(", "),
  );
  const [skillsIoTInput, setSkillsIoTInput] = useState(
    initialProfile.skillsIoT.join(", "),
  );
  const [activeModalTab, setActiveModalTab] = useState<
    "personal" | "education" | "links" | "skills" | "stats"
  >("personal");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEdit = () => {
    setEditForm(profile);
    setSkillsBackendInput(profile.skillsBackend.join(", "));
    setSkillsIoTInput(profile.skillsIoT.join(", "));
    setActiveModalTab("personal");
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfileData = {
      ...editForm,
      skillsBackend: skillsBackendInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      skillsIoT: skillsIoTInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setProfile(updatedProfile);
    setIsEditModalOpen(false);
    showToast("Đã cập nhật toàn bộ thông tin hồ sơ thành công!");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Đã sao chép link hồ sơ!");
    } else {
      showToast("Link: " + window.location.href);
    }
  };

  const handleDownloadCV = () => {
    showToast("Đang tải xuống CV PDF...");
  };

  return (
    <div className="space-y-4">
      {/* Header Profile - Compact Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card px-5 py-3.5 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 grid place-items-center text-lg font-bold text-primary shadow-xs">
            {profile.displayName
              .trim()
              .split(" ")
              .map((w) => w[0])
              .slice(-2)
              .join("")
              .toUpperCase() || "NA"}
            <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-bold text-foreground">
                {profile.displayName}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                <Sparkles className="h-3 w-3" />
                {profile.classYear}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {profile.school} • {profile.location}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:bg-secondary"
          >
            <Edit2 className="h-3.5 w-3.5 text-primary" />
            Sửa hồ sơ
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/80 px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:bg-secondary"
          >
            <Share2 className="h-3.5 w-3.5 text-primary" />
            Chia sẻ
          </button>
          <button
            onClick={handleDownloadCV}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90"
          >
            <Download className="h-3.5 w-3.5" />
            Tải CV
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary">
          <CheckCircle2 className="h-4 w-4" />
          {toastMessage}
        </div>
      )}

      {/* Grid Cards */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Cá Nhân */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-xs font-bold text-foreground">
            <User className="h-4 w-4 text-primary" />
            Thông Tin Cá Nhân
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã sinh viên:</span>
              <span className="font-mono font-semibold text-primary">{profile.studentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày sinh:</span>
              <span className="font-medium text-foreground">{profile.dateOfBirth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Giới tính:</span>
              <span className="font-medium text-foreground">{profile.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-mono text-foreground text-right truncate max-w-[170px]">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SĐT:</span>
              <span className="font-mono text-foreground">{profile.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Địa chỉ:</span>
              <span className="font-medium text-foreground text-right truncate max-w-[170px]">{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Học Tập */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-xs font-bold text-foreground">
            <GraduationCap className="h-4 w-4 text-indigo-500" />
            Thông Tin Học Tập
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trường:</span>
              <span className="font-semibold text-foreground text-right truncate max-w-[180px]">{profile.school}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Khóa:</span>
              <span className="font-medium text-foreground">{profile.classYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngành:</span>
              <span className="font-semibold text-primary text-right truncate max-w-[180px]">{profile.major}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Niên khóa:</span>
              <span className="font-medium text-foreground">{profile.startYear} - {profile.expectedGradYear}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Liên Kết */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-xs font-bold text-foreground">
            <ExternalLink className="h-4 w-4 text-sky-500" />
            Liên Kết & Portfolio
          </div>
          <div className="space-y-1.5 text-xs">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-secondary/60 px-2.5 py-1.5 transition-colors hover:bg-secondary hover:text-primary"
            >
              <div className="flex items-center gap-2">
                <Github className="h-3.5 w-3.5" />
                <span>GitHub Repository</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </a>

            <a
              href={profile.figma}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-secondary/60 px-2.5 py-1.5 transition-colors hover:bg-secondary hover:text-purple-600"
            >
              <div className="flex items-center gap-2">
                <Figma className="h-3.5 w-3.5 text-purple-500" />
                <span>Figma UI Design</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </a>

            <a
              href={profile.portfolio}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-secondary/60 px-2.5 py-1.5 transition-colors hover:bg-secondary hover:text-primary"
            >
              <div className="flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-primary" />
                <span>Smart Home IoT Hub</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-secondary/60 px-2.5 py-1.5 transition-colors hover:bg-secondary hover:text-primary"
            >
              <div className="flex items-center gap-2">
                <Linkedin className="h-3.5 w-3.5 text-sky-600" />
                <span>LinkedIn Profile</span>
              </div>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </a>
          </div>
        </div>

        {/* Card 4: Kỹ Năng */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-xs font-bold text-foreground">
            <Terminal className="h-4 w-4 text-amber-500" />
            Kỹ Năng & Công Nghệ
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-semibold text-muted-foreground block mb-1">Backend & DB:</span>
              <div className="flex flex-wrap gap-1">
                {profile.skillsBackend.map((t) => (
                  <span key={t} className="rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-muted-foreground block mb-1">IoT & Embedded:</span>
              <div className="flex flex-wrap gap-1">
                {profile.skillsIoT.map((t) => (
                  <span key={t} className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Thống Kê */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-xs font-bold text-foreground">
            <Flame className="h-4 w-4 text-emerald-500" />
            Thống Kê Hoạt Động
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dự án hoàn thành:</span>
              <span className="font-bold text-foreground">{profile.stats.completedProjects}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GitHub Commits:</span>
              <span className="font-bold text-primary">{profile.stats.githubCommits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contribution Streak:</span>
              <span className="font-bold text-success">{profile.stats.streakDays} ngày</span>
            </div>
            <div className="flex justify-between border-t border-border/40 pt-1 text-muted-foreground">
              <span>Tham gia: {profile.stats.joinedDate}</span>
              <span>Lab: {profile.stats.learningHours}+ giờ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Chỉnh Sửa Toàn Bộ Hồ Sơ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Chỉnh Sửa Toàn Bộ Hồ Sơ Cá Nhân
                </h3>
                <p className="text-xs text-muted-foreground">
                  Cập nhật tất cả các trường thông tin hiển thị trên hồ sơ
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-xl p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Section Tabs */}
            <div className="flex border-b border-border/60 px-6 overflow-x-auto gap-2 py-2">
              {[
                { id: "personal", label: "Cá nhân & Liên hệ" },
                { id: "education", label: "Học tập" },
                { id: "links", label: "Liên kết & Mạng XH" },
                { id: "skills", label: "Kỹ năng" },
                { id: "stats", label: "Thống kê" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveModalTab(tab.id as typeof activeModalTab)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    activeModalTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProfile} className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                {/* Tab 1: Cá Nhân */}
                {activeModalTab === "personal" && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Tên hiển thị:</label>
                        <input
                          type="text"
                          required
                          value={editForm.displayName}
                          onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Mã sinh viên:</label>
                        <input
                          type="text"
                          value={editForm.studentId}
                          onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium font-mono focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Ngày sinh:</label>
                        <input
                          type="text"
                          placeholder="VD: 15/10/2003"
                          value={editForm.dateOfBirth}
                          onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Giới tính:</label>
                        <input
                          type="text"
                          value={editForm.gender}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Email:</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Số điện thoại:</label>
                        <input
                          type="text"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-foreground">Địa chỉ:</label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 2: Học Tập */}
                {activeModalTab === "education" && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="mb-1 block font-semibold text-foreground">Trường học:</label>
                      <input
                        type="text"
                        value={editForm.school}
                        onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Khóa học / Lớp:</label>
                        <input
                          type="text"
                          value={editForm.classYear}
                          onChange={(e) => setEditForm({ ...editForm, classYear: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Chuyên ngành:</label>
                        <input
                          type="text"
                          value={editForm.major}
                          onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Năm bắt đầu:</label>
                        <input
                          type="text"
                          value={editForm.startYear}
                          onChange={(e) => setEditForm({ ...editForm, startYear: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Năm tốt nghiệp dự kiến:</label>
                        <input
                          type="text"
                          value={editForm.expectedGradYear}
                          onChange={(e) => setEditForm({ ...editForm, expectedGradYear: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Liên Kết */}
                {activeModalTab === "links" && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="mb-1 block font-semibold text-foreground">Link GitHub:</label>
                      <input
                        type="text"
                        value={editForm.github}
                        onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-foreground">Link Figma:</label>
                      <input
                        type="text"
                        value={editForm.figma}
                        onChange={(e) => setEditForm({ ...editForm, figma: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-foreground">Link Portfolio / Hub:</label>
                      <input
                        type="text"
                        value={editForm.portfolio}
                        onChange={(e) => setEditForm({ ...editForm, portfolio: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-foreground">Link LinkedIn:</label>
                      <input
                        type="text"
                        value={editForm.linkedin}
                        onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 4: Kỹ Năng */}
                {activeModalTab === "skills" && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="mb-1 block font-semibold text-foreground">
                        Kỹ năng Backend & Database (phân cách bằng dấu phẩy):
                      </label>
                      <input
                        type="text"
                        value={skillsBackendInput}
                        onChange={(e) => setSkillsBackendInput(e.target.value)}
                        placeholder="Java, Spring Boot, PostgreSQL, Supabase..."
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-foreground">
                        Kỹ năng IoT & Embedded (phân cách bằng dấu phẩy):
                      </label>
                      <input
                        type="text"
                        value={skillsIoTInput}
                        onChange={(e) => setSkillsIoTInput(e.target.value)}
                        placeholder="ESP32, MQTT, DHT11, BH1750, C++..."
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 5: Thống Kê */}
                {activeModalTab === "stats" && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Dự án hoàn thành:</label>
                        <input
                          type="number"
                          value={editForm.stats.completedProjects}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              stats: { ...editForm.stats, completedProjects: Number(e.target.value) },
                            })
                          }
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">GitHub Commits:</label>
                        <input
                          type="number"
                          value={editForm.stats.githubCommits}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              stats: { ...editForm.stats, githubCommits: Number(e.target.value) },
                            })
                          }
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Contribution Streak (ngày):</label>
                        <input
                          type="number"
                          value={editForm.stats.streakDays}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              stats: { ...editForm.stats, streakDays: Number(e.target.value) },
                            })
                          }
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-foreground">Giờ Lab:</label>
                        <input
                          type="number"
                          value={editForm.stats.learningHours}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              stats: { ...editForm.stats, learningHours: Number(e.target.value) },
                            })
                          }
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-foreground">Ngày tham gia (YYYY-MM-DD):</label>
                      <input
                        type="text"
                        value={editForm.stats.joinedDate}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            stats: { ...editForm.stats, joinedDate: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-border/80 px-6 py-4">
                <span className="text-xs text-muted-foreground">
                  * Nhấn Lưu để cập nhật tức thì toàn bộ thông tin
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Lưu Toàn Bộ Thay Đổi
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
