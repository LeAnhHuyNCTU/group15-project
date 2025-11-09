# 🖼️ Hướng dẫn Upload Avatar

## ✅ Cách test Upload Avatar

### Bước 1: Đăng nhập
1. Đăng nhập vào hệ thống với tài khoản của bạn
2. Chọn tab **"Profile"** trên thanh navigation

### Bước 2: Lấy URL ảnh

#### Phương án 1: Dùng Imgur (Đơn giản nhất) ⭐
1. Truy cập: https://imgur.com
2. Click **"New post"** hoặc kéo thả ảnh vào trang
3. Upload ảnh của bạn
4. Sau khi upload, click chuột phải vào ảnh
5. Chọn **"Copy image address"** hoặc **"Copy image location"**
6. Dán link vào ô "Nhập URL avatar"

**Ví dụ URL từ Imgur:**
```
https://i.imgur.com/abc123.jpg
```

#### Phương án 2: Dùng Cloudinary (Chuyên nghiệp)
1. Đăng ký miễn phí tại: https://cloudinary.com
2. Vào **Media Library** → Upload ảnh
3. Click vào ảnh → Copy **Secure URL**
4. Dán link vào form

**Ví dụ URL từ Cloudinary:**
```
https://res.cloudinary.com/demo/image/upload/sample.jpg
```

#### Phương án 3: Dùng link ảnh công khai
- Tìm ảnh trên Google Images
- Click chuột phải → "Copy image address"
- **Lưu ý:** Chỉ dùng link công khai, không dùng link yêu cầu đăng nhập

### Bước 3: Upload
1. Dán URL vào ô input
2. Click nút **"📤 Upload"**
3. Chờ thông báo thành công
4. Avatar sẽ cập nhật ngay lập tức

## 🧪 Test URLs mẫu

### URL test nhanh (có thể dùng ngay):

```
https://i.imgur.com/P6sJbhg.jpg
https://i.imgur.com/4M5rYLJ.jpg
https://picsum.photos/200
https://via.placeholder.com/200
```

## ❌ Các lỗi thường gặp và cách sửa

### 1. "Token không hợp lệ hoặc đã hết hạn"
**Nguyên nhân:** Token đăng nhập đã hết hạn

**Giải pháp:**
- Click nút "Đăng xuất"
- Đăng nhập lại
- Thử upload lại

### 2. "URL avatar không hợp lệ"
**Nguyên nhân:** URL không đúng format

**Giải pháp:**
- Đảm bảo URL bắt đầu bằng `https://` hoặc `http://`
- URL phải trỏ trực tiếp đến file ảnh (kết thúc bằng .jpg, .png, .gif, etc.)
- Không dùng link đến trang web chứa ảnh

**URL đúng:**
```
✅ https://i.imgur.com/abc123.jpg
✅ https://example.com/images/avatar.png
```

**URL sai:**
```
❌ imgur.com/abc123 (thiếu https://)
❌ https://imgur.com/abc123 (link đến trang, không phải ảnh)
❌ C:\Users\Desktop\avatar.jpg (đường dẫn local)
```

### 3. "Lỗi khi upload avatar"
**Nguyên nhân:** Backend không kết nối được hoặc lỗi server

**Giải pháp:**
- Kiểm tra backend đang chạy: http://localhost:3000
- Mở Console (F12) xem chi tiết lỗi
- Kiểm tra kết nối internet

### 4. Avatar không hiển thị sau khi upload
**Nguyên nhân:** URL ảnh bị chặn hoặc không tồn tại

**Giải pháp:**
- Thử mở URL trong tab mới để kiểm tra ảnh có load được không
- Đảm bảo URL ảnh công khai (không yêu cầu đăng nhập)
- Dùng URL từ Imgur hoặc Cloudinary (đáng tin cậy hơn)

## 🔍 Debug với Console

Nếu gặp lỗi, mở Console (F12) và xem:

```javascript
// Kiểm tra token
localStorage.getItem('token')

// Test API trực tiếp
fetch('http://localhost:3000/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}).then(r => r.json()).then(console.log)
```

## 📝 Test với Postman

### Request:
```
PUT http://localhost:3000/api/auth/avatar
```

### Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

### Body (JSON):
```json
{
  "avatar": "https://i.imgur.com/abc123.jpg"
}
```

### Expected Response (Success):
```json
{
  "success": true,
  "message": "Upload avatar thành công",
  "data": {
    "_id": "...",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "avatar": "https://i.imgur.com/abc123.jpg"
  }
}
```

## 💡 Tips

1. **Dùng ảnh nhỏ:** Avatar nên có kích thước 200x200 đến 500x500 pixels
2. **Dùng format phổ biến:** JPG, PNG, GIF
3. **URL ngắn gọn:** Dùng Imgur để có URL ngắn, dễ quản lý
4. **Cache:** Sau khi upload, có thể cần refresh trang (F5) để thấy avatar mới
5. **HTTPS:** Ưu tiên URL HTTPS để bảo mật tốt hơn

## 🚀 Nâng cao: Upload file thực sự (Tương lai)

Hiện tại hệ thống dùng URL. Để upload file từ máy tính:

1. **Frontend:** Dùng `<input type="file">` với FormData
2. **Backend:** Cài đặt multer để xử lý multipart/form-data
3. **Storage:** Tích hợp Cloudinary SDK để upload lên cloud
4. **Response:** Trả về URL từ Cloudinary

Code mẫu sẽ được cập nhật sau!
