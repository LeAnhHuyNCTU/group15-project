# Hướng dẫn Test Authentication API - Hoạt động 1

## ✅ Backend đã hoàn thành

### Files đã tạo/cập nhật:
1. **`backend/models/User.js`** - Thêm password, role, avatar, bcrypt
2. **`backend/controllers/authController.js`** - signup, login, logout, getMe
3. **`backend/middleware/auth.js`** - JWT authentication middleware
4. **`backend/routes/auth.js`** - Auth routes
5. **`backend/server.js`** - Mount auth routes
6. **`backend/.env`** - Thêm JWT_SECRET
7. **`backend/package.json`** - Thêm bcryptjs, jsonwebtoken

---

## 🚀 Cách chạy Backend

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Khởi động server
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

---

## 📡 Test API với Postman/Thunder Client

### 1. **ĐĂNG KÝ (Sign Up)**

**Endpoint:** `POST http://localhost:3000/api/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Nguyen Van A",
  "email": "vana@example.com",
  "password": "123456"
}
```

**Response thành công (201):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "_id": "...",
      "name": "Nguyen Van A",
      "email": "vana@example.com",
      "role": "user",
      "avatar": "https://via.placeholder.com/150"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. **ĐĂNG NHẬP (Login)**

**Endpoint:** `POST http://localhost:3000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "vana@example.com",
  "password": "123456"
}
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "_id": "...",
      "name": "Nguyen Van A",
      "email": "vana@example.com",
      "role": "user",
      "avatar": "https://via.placeholder.com/150"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Lưu ý:** Copy `token` để dùng cho các request tiếp theo!

---

### 3. **LẤY THÔNG TIN USER (Get Me)**

**Endpoint:** `GET http://localhost:3000/api/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Response thành công (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Nguyen Van A",
      "email": "vana@example.com",
      "role": "user",
      "avatar": "https://via.placeholder.com/150",
      "createdAt": "2025-11-09T..."
    }
  }
}
```

---

### 4. **ĐĂNG XUẤT (Logout)**

**Endpoint:** `POST http://localhost:3000/api/auth/logout`

**Headers:**
```
Content-Type: application/json
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

**Lưu ý:** Với JWT, logout chủ yếu xử lý ở frontend (xóa token khỏi localStorage).

---

## 🧪 Test Cases

### ✅ Test Đăng ký thành công
- Nhập đầy đủ name, email, password
- Email chưa tồn tại
- Password >= 6 ký tự
- ➡️ Trả về user + token

### ❌ Test Đăng ký thất bại
- Email đã tồn tại → Error 400
- Thiếu trường bắt buộc → Error 400
- Email không hợp lệ → Error 500 (MongoDB validation)
- Password < 6 ký tự → Error 500

### ✅ Test Đăng nhập thành công
- Email và password đúng
- ➡️ Trả về user + token

### ❌ Test Đăng nhập thất bại
- Email không tồn tại → Error 401
- Password sai → Error 401
- Thiếu email/password → Error 400

### ✅ Test Get Me (có token)
- Header có Bearer token hợp lệ
- ➡️ Trả về thông tin user

### ❌ Test Get Me (không có token)
- Không có header Authorization → Error 401
- Token không hợp lệ → Error 401

---

## 📸 Sản phẩm nộp (Hoạt động 1)

1. ✅ **Code Backend:**
   - authController.js
   - auth.js (middleware)
   - auth.js (routes)
   - User.js (model với password)

2. 📸 **Screenshot Postman:**
   - Test Signup thành công
   - Test Login thành công
   - Test Get Me với token
   - Test Logout

3. 🔗 **Link GitHub:**
   - Branch: `backend-auth`
   - Pull Request: `backend-auth → main`

---

## 🔐 Security Features

- ✅ Password được mã hóa bằng **bcrypt** (10 salt rounds)
- ✅ JWT token hết hạn sau **7 ngày**
- ✅ Password không trả về trong response (select: false)
- ✅ Email validation với regex
- ✅ Protected routes với middleware `protect`

---

## 🎯 Tiếp theo: Frontend Authentication UI

Sau khi test backend xong, chuyển sang tạo giao diện đăng ký/đăng nhập ở frontend!
