# Smart Home Hub

Hãy thiết kế và viết code giao diện (HTML và CSS) cho một trang web "Bảng Điều Khiển Giám Sát & Điều Khiển Smart Home" chuyên nghiệp, có thiết kế hiện đại, responsive và trực quan.

Mô tả chi tiết cấu trúc và các thành phần của trang web như sau:

1. BỐ CỤC CHUNG (Layout):

   - Sử dụng layout chia làm 2 phần chính: Sidebar bên trái và Khu vực nội dung chính bên phải.

   - Sidebar bên trái:

     + Phía trên là Logo và tên hệ thống ("Cổng IOT - Node ESP32-S3").

     + Danh sách menu điều hướng dạng tab gồm 4 mục: "Bảng điều khiển", "Dữ liệu cảm biến", "Lịch sử hoạt động", "Cài đặt hệ thống".

     + Phía dưới cùng hiển thị trạng thái kết nối hệ thống (Supabase: Online/Offline, MQTT: Online/Offline).

   - Nội dung chính bên phải:

     + Header: Hiển thị tiêu đề của trang hiện tại, nút chuông thông báo (nhấn vào hiện dropdown các cảnh báo gần đây), và thông tin tài khoản admin (Avatar + Tên).

     + Khung hiển thị nội dung động thay đổi theo menu tab được chọn.

2. CÁC THÀNH PHẦN CHI TIẾT TRONG TỪNG TAB:

   - TAB 1: BẢNG ĐIỀU KHIỂN (Dashboard chính)

     * Alert Banner (Chỉ hiện khi có lỗi/cảnh báo): Banner màu đỏ hoặc vàng cam thông báo trạng thái vượt ngưỡng của cảm biến.

     * Khu vực cảm biến: Gồm 3 card hiển thị 3 thông số (Nhiệt độ, Độ ẩm, Ánh sáng) dạng chữ lớn kèm icon tương ứng. Mỗi card có một badge trạng thái ("Bình thường" màu xanh lá hoặc "Vượt ngưỡng" màu đỏ/vàng).

     * Khu vực điều khiển thiết bị: Gồm 3 card tương ứng cho: "Điều hòa" (AC), "Quạt" (Fan), và "Đèn" (Light). Mỗi card có:

       + Tên thiết bị, icon đặc trưng và dòng chữ trạng thái thực tế ("BẬT" hoặc "TẮT").

       + Một nút gạt (Switch Toggle) dạng iOS để bật/tắt thủ công.

       + Hai nút chuyển đổi chế độ hoạt động: "Thủ công" (Manual) và "Tự động" (Auto).

     * Khu vực đồ thị: Chiếm diện tích lớn phía dưới, là một khung vẽ biểu đồ đường (Line Chart) biểu diễn sự biến động của Nhiệt độ, Độ ẩm, Ánh sáng.

   - TAB 2: DỮ LIỆU CẢM BIẾN (Lịch sử đo đạc)

     * Một bảng (Table) được thiết kế sạch sẽ, hiển thị lịch sử các bản ghi cảm biến gồm các cột: STT, Thời gian, Nhiệt độ (°C), Độ ẩm (%), Ánh sáng (lx), Thiết bị gửi.

   - TAB 3: LỊCH SỬ HOẠT ĐỘNG (Activity Log)

     * Danh sách (List) hiển thị các dòng sự kiện hoạt động của hệ thống, mỗi dòng ghi rõ: Thời gian, Loại hành động, Nội dung sự kiện chi tiết, Người thực hiện (Hệ thống tự động / Người dùng), Trạng thái (Thành công / Thất bại).

   - TAB 4: CÀI ĐẶT HỆ THỐNG (Settings)

     * Các bảng cấu hình ngưỡng tự động hóa cho các cảm biến. Mỗi cảm biến có 1 thanh kéo (Slider) và 1 ô nhập số (Input) để điều chỉnh ngưỡng bật thiết bị.

3. YÊU CẦU PHONG CÁCH & THẨM MỸ (Aesthetic Guidelines):

   - Phong cách: Hướng tới sự tối giản, hiện đại (như giao diện Apple Home) hoặc giao diện kính mờ (Glassmorphism) với các card bo tròn góc, có đổ bóng mờ mịn màng.

   - Hiệu ứng: Các nút bấm và switch toggle khi hover hoặc click cần có chuyển động mượt mà (transition nhẹ).

   - Responsive: Hiển thị đẹp mắt trên màn hình Desktop và tự động co giãn, xếp dọc các card khi xem trên màn hình Mobile.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://home-nexus-ui.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c664561a-04c2-4b8b-947d-eb03c8b867d1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
