# 🇻🇳 VN Proxy - Chrome Extension

**VN Proxy** là công cụ giúp bạn tìm kiếm, kiểm tra và quản lý Proxy Việt Nam (HTTP/SOCKS4) trực tiếp ngay trên trình duyệt Chrome.

Với phiên bản cải tiến này, bạn có toàn quyền kiểm soát quy trình: **Quét danh sách -> Kiểm tra độ ổn định -> Chọn Proxy tốt nhất -> Kết nối.**

## ✨ Các tính năng mới

* **Quy trình chủ động:** Tách biệt nút "Tìm kiếm" và "Kết nối". Bạn có thể quét danh sách, xem kết quả Ping, sau đó chọn con proxy ưng ý nhất.
* **Kiểm tra thực tế:** Extension tự động thực hiện truy vấn đến `ipify` để xác nhận proxy không chỉ "sống" mà còn có khả năng truy cập Internet thực sự.
* **Ghi nhớ danh sách:** Danh sách proxy sau khi tìm kiếm được lưu lại cục bộ. Bạn có thể đóng popup và mở lại mà không cần quét lại từ đầu.
* **Đồng hồ thời gian thực:** Theo dõi chính xác thời gian bạn đã duy trì kết nối với proxy.
* **Trạng thái trực quan:** Hiển thị rõ số lượng proxy tìm thấy và thông tin IP/Ping của proxy đang sử dụng.

## 🚀 Hướng dẫn cài đặt

1. Tải toàn bộ mã nguồn về máy.
2. Mở Chrome, truy cập: `chrome://extensions/`.
3. Bật **Developer mode** (góc trên bên phải).
4. Nhấn **Load unpacked** và chọn thư mục chứa mã nguồn của extension.

## 🛠 Cách sử dụng

1. **Tìm kiếm:**
* Chọn loại proxy mong muốn (**HTTP** hoặc **SOCKS4**).
* Nhấn **Tìm kiếm proxy**. Hệ thống sẽ quét danh sách và loại bỏ những con proxy chết hoặc phản hồi chậm.


2. **Chọn và Kết nối:**
* Sau khi quét xong, danh sách các proxy "sống" kèm thông tin Ping sẽ hiện ra trong menu thả xuống.
* Chọn một proxy từ danh sách.
* Nhấn **Kết nối** để áp dụng cấu hình proxy cho trình duyệt.


3. **Quản lý:**
* Bạn có thể xem IP hiện tại và thời gian kết nối ngay trên Popup.
* Nhấn **Tạm dừng** để ngắt kết nối và quay trở lại IP gốc của bạn.

## 📝 Lưu ý khi sử dụng

* **Hiệu năng:** Quá trình "Tìm kiếm" sẽ thực hiện test tuần tự. Hãy kiên nhẫn đợi một chút để hệ thống lọc ra những proxy chất lượng nhất.
* **Proxy miễn phí:** Danh sách proxy được lấy từ nguồn mở. Độ ổn định có thể thay đổi tùy thời điểm. Nếu proxy bị ngắt kết nối (IncompleteRead), hãy thực hiện "Tìm kiếm" lại để làm mới danh sách.
* **Quyền riêng tư:** Extension này chỉ thay đổi cài đặt Proxy của trình duyệt Chrome và không thu thập bất kỳ dữ liệu cá nhân nào của bạn.

---

*Phát triển bởi [Vincentng295](https://www.google.com/search?q=https://github.com/vincentng295). Nếu bạn thấy hữu ích, hãy để lại một ⭐ trên GitHub!*