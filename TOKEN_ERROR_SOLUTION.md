# 🔧 Giải quyết lỗi "Token không hợp lệ"

## Nguyên nhân:
1. Token JWT đã hết hạn (mặc định: 7 ngày)
2. Backend server bị restart làm mất session
3. JWT_SECRET không khớp giữa lúc tạo token và lúc verify
4. Token không được lưu đúng trong localStorage

## ✅ Giải pháp:

### Cách 1: Đăng xuất và đăng nhập lại (Khuyến nghị)
1. Click nút "Đăng xuất" trên thanh navigation
2. Đăng nhập lại với email và password
3. Token mới sẽ được tạo và lưu

### Cách 2: Xóa token cũ trong localStorage
1. Mở Developer Tools (F12)
2. Chuyển sang tab "Application" hoặc "Storage"
3. Tìm "Local Storage" → "http://localhost:3001"
4. Xóa key "token"
5. Refresh lại trang (F5)
6. Đăng nhập lại

### Cách 3: Kiểm tra Backend
Đảm bảo backend đang chạy:
```bash
cd backend
node server.js
```

Kiểm tra JWT_SECRET trong file `.env`:
```
JWT_SECRET=group15-secret-key-2025-very-secure-random-string
```

### Cách 4: Test Token bằng Console
Mở Console (F12) và chạy:
```javascript
// Kiểm tra token
const token = localStorage.getItem('token');
console.log('Token:', token);
console.log('Token length:', token?.length);

// Xóa token cũ
localStorage.removeItem('token');

// Refresh
location.reload();
```

## 🔍 Debug:

### Kiểm tra token trong Console:
Khi upload avatar hoặc update profile, mở Console để xem:
- "Token being sent: Token exists" ✅
- "Token length: 200+" ✅  
- Nếu thấy "NO TOKEN!" ❌ → Đăng nhập lại

### Kiểm tra Backend logs:
Terminal backend sẽ hiển thị:
```
🔐 Auth Middleware:
- Authorization header: Present ✅
- Token extracted: Yes ✅
- Token decoded successfully for user ID: xxx
- ✅ User authenticated: user@email.com
```

Nếu thấy:
- "Authorization header: Missing" → Frontend không gửi token
- "Token verification failed" → Token không hợp lệ
- "User not found in database" → User đã bị xóa

## 🚀 Phòng ngừa:

### 1. Tăng thời gian hết hạn token
Sửa trong `backend/controllers/authController.js`:
```javascript
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Tăng lên 30 ngày
  });
};
```

### 2. Thêm Auto-refresh token
Tạo endpoint refresh token để gia hạn tự động khi sắp hết hạn.

### 3. Kiểm tra token trước mỗi request
Frontend có thể check expiry trước khi gửi request.

## 📌 Lưu ý:
- Token được mã hóa JWT, không thể đọc trực tiếp
- Mỗi lần đăng nhập = token mới
- Đăng xuất = xóa token khỏi localStorage
- Backend verify token mỗi request cần authentication
