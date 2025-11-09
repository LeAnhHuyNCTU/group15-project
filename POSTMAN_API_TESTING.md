# 📮 Hướng dẫn Test API bằng Postman

## 🎯 Tổng quan

Hệ thống có 2 nhóm API chính:
1. **Authentication API** (`/api/auth/*`) - Public + Protected
2. **User Management API** (`/api/users/*`) - Admin only

---

## 🚀 Setup Postman

### Bước 1: Tạo Collection mới

1. Mở Postman
2. Click **"New"** → **"Collection"**
3. Đặt tên: `User Management System`
4. Click **"Create"**

### Bước 2: Tạo Environment Variable

1. Click **"Environments"** (bên trái)
2. Click **"+"** để tạo environment mới
3. Đặt tên: `Development`
4. Thêm variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3000/api` | `http://localhost:3000/api` |
| `token` | (để trống) | (sẽ tự động điền sau) |

5. Click **"Save"**
6. Chọn **"Development"** trong dropdown ở góc trên bên phải

---

## 📝 1. AUTHENTICATION APIs

### 1.1. Đăng ký tài khoản (Signup)

**Endpoint:** `POST {{base_url}}/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response mẫu (201 Created):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "_id": "673ff...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatar": ""
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Tests Script (auto save token):**
Vào tab **"Tests"** và paste:
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
    console.log("Token saved:", jsonData.data.token);
}
```

---

### 1.2. Đăng nhập (Login)

**Endpoint:** `POST {{base_url}}/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response mẫu (200 OK):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "_id": "673ff...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatar": ""
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Tests Script:**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
    console.log("✅ Login successful!");
    console.log("Token:", jsonData.data.token);
    console.log("User:", jsonData.data.user.name);
}
```

---

### 1.3. Lấy thông tin user hiện tại (Get Me)

**Endpoint:** `GET {{base_url}}/auth/me`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body:** None

**Response mẫu (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "673ff...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": ""
  }
}
```

**Tests Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has user data", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.have.property('email');
});
```

---

### 1.4. Cập nhật Profile

**Endpoint:** `PUT {{base_url}}/auth/profile`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

**Hoặc đổi mật khẩu cùng lúc:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "currentPassword": "123456",
  "newPassword": "newpass123"
}
```

**Response mẫu (200 OK):**
```json
{
  "success": true,
  "message": "Cập nhật profile thành công",
  "data": {
    "_id": "673ff...",
    "name": "John Updated",
    "email": "john.new@example.com",
    "role": "user",
    "avatar": ""
  }
}
```

---

### 1.5. Upload Avatar

**Endpoint:** `PUT {{base_url}}/auth/avatar`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "avatar": "https://i.imgur.com/abc123.jpg"
}
```

**Hoặc dùng parameter name khác:**
```json
{
  "avatarUrl": "https://i.imgur.com/abc123.jpg"
}
```

**Response mẫu (200 OK):**
```json
{
  "success": true,
  "message": "Upload avatar thành công",
  "data": {
    "_id": "673ff...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://i.imgur.com/abc123.jpg"
  }
}
```

**Test URLs mẫu:**
```
https://i.imgur.com/P6sJbhg.jpg
https://picsum.photos/200
https://via.placeholder.com/200
```

---

### 1.6. Đổi mật khẩu

**Endpoint:** `PUT {{base_url}}/auth/change-password`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "currentPassword": "123456",
  "newPassword": "newpassword123"
}
```

**Response mẫu (200 OK):**
```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công"
}
```

---

### 1.7. Quên mật khẩu - Bước 1: Request Reset Token

**Endpoint:** `POST {{base_url}}/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "john@example.com"
}
```

**Response mẫu (200 OK):**
```json
{
  "success": true,
  "message": "Reset token đã được tạo",
  "resetToken": "abc123def456..."
}
```

**⚠️ Lưu lại `resetToken` để dùng ở bước 2!**

---

### 1.8. Quên mật khẩu - Bước 2: Reset Password

**Endpoint:** `PUT {{base_url}}/auth/reset-password/:resetToken`

Thay `:resetToken` bằng token nhận được từ bước 1.

**Ví dụ:** `PUT {{base_url}}/auth/reset-password/abc123def456`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "newPassword": "newpassword123"
}
```

**Response mẫu (200 OK):**
```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công"
}
```

---

## 👥 2. USER MANAGEMENT APIs (Admin Only)

**⚠️ Lưu ý:** Các API sau yêu cầu role = `admin`

### 2.1. Lấy danh sách tất cả Users

**Endpoint:** `GET {{base_url}}/users`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body:** None

**Response mẫu (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "673ff...",
        "name": "Admin",
        "email": "admin@example.com",
        "role": "admin",
        "avatar": ""
      },
      {
        "_id": "673ff...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "avatar": ""
      }
    ]
  }
}
```

**Lỗi khi không phải admin (403 Forbidden):**
```json
{
  "success": false,
  "message": "User role `user` không được phép truy cập route này"
}
```

---

### 2.2. Lấy thông tin chi tiết một User

**Endpoint:** `GET {{base_url}}/users/:userId`

**Ví dụ:** `GET {{base_url}}/users/673ff1234567890abcdef`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body:** None

**Response mẫu (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "673ff...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "",
    "createdAt": "2025-11-09T10:30:00.000Z"
  }
}
```

---

### 2.3. Thay đổi Role của User

**Endpoint:** `PUT {{base_url}}/users/:userId/role`

**Ví dụ:** `PUT {{base_url}}/users/673ff1234567890abcdef/role`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw JSON):**

Chuyển thành admin:
```json
{
  "role": "admin"
}
```

Hoặc hạ xuống user:
```json
{
  "role": "user"
}
```

**Response mẫu (200 OK):**
```json
{
  "success": true,
  "message": "Cập nhật role thành công",
  "data": {
    "_id": "673ff...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "avatar": ""
  }
}
```

---

### 2.4. Xóa User

**Endpoint:** `DELETE {{base_url}}/users/:userId`

**Ví dụ:** `DELETE {{base_url}}/users/673ff1234567890abcdef`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body:** None

**Response mẫu (200 OK):**
```json
{
  "success": true,
  "message": "Xóa user thành công"
}
```

**Lỗi khi cố xóa chính mình (400 Bad Request):**
```json
{
  "success": false,
  "message": "Không thể xóa chính mình"
}
```

---

### 2.5. Tạo Admin (Setup Admin)

**Endpoint:** `POST {{base_url}}/setup-admin`

**⚠️ Đặc biệt:** API này KHÔNG cần token!

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response mẫu (201 Created):**
```json
{
  "success": true,
  "message": "Tạo tài khoản admin thành công",
  "data": {
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Nếu email đã tồn tại:**
```json
{
  "success": true,
  "message": "User đã tồn tại, đã cập nhật role thành admin",
  "data": {
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## 🎯 Test Flow hoàn chỉnh

### Flow 1: User Registration → Profile Management

```
1. POST /auth/signup
   ↓ (save token)
2. GET /auth/me
   ↓
3. PUT /auth/profile
   ↓
4. PUT /auth/avatar
   ↓
5. PUT /auth/change-password
```

### Flow 2: Admin User Management

```
1. POST /setup-admin (tạo admin)
   ↓
2. POST /auth/login (đăng nhập admin)
   ↓ (save admin token)
3. GET /users (xem tất cả users)
   ↓
4. GET /users/:id (xem chi tiết)
   ↓
5. PUT /users/:id/role (đổi role)
   ↓
6. DELETE /users/:id (xóa user)
```

### Flow 3: Forgot Password

```
1. POST /auth/forgot-password
   ↓ (lưu resetToken)
2. PUT /auth/reset-password/:resetToken
   ↓
3. POST /auth/login (đăng nhập với mật khẩu mới)
```

---

## 🔧 Postman Collection Export

Bạn có thể import collection này vào Postman:

### Tạo Collection JSON:

1. Copy nội dung dưới đây
2. Lưu thành file `user-management-api.postman_collection.json`
3. Import vào Postman: **Import** → **File** → Chọn file

```json
{
  "info": {
    "name": "User Management System API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Signup",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"123456\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/signup",
              "host": ["{{base_url}}"],
              "path": ["auth", "signup"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@example.com\",\n  \"password\": \"admin123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          }
        },
        {
          "name": "Get Me",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": {
              "raw": "{{base_url}}/auth/me",
              "host": ["{{base_url}}"],
              "path": ["auth", "me"]
            }
          }
        }
      ]
    },
    {
      "name": "Users (Admin)",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": {
              "raw": "{{base_url}}/users",
              "host": ["{{base_url}}"],
              "path": ["users"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 📊 Test Cases

### ✅ Positive Test Cases

| Test Case | Endpoint | Expected |
|-----------|----------|----------|
| Đăng ký user mới | POST /auth/signup | 201 + token |
| Đăng nhập thành công | POST /auth/login | 200 + token |
| Lấy thông tin user | GET /auth/me | 200 + user data |
| Admin xem users | GET /users | 200 + user list |
| Admin đổi role | PUT /users/:id/role | 200 + updated |

### ❌ Negative Test Cases

| Test Case | Endpoint | Expected |
|-----------|----------|----------|
| Đăng ký email trùng | POST /auth/signup | 400 Bad Request |
| Login sai password | POST /auth/login | 401 Unauthorized |
| Get Me không có token | GET /auth/me | 401 Unauthorized |
| User xem users (không phải admin) | GET /users | 403 Forbidden |
| Admin xóa chính mình | DELETE /users/:id | 400 Bad Request |

---

## 🐛 Troubleshooting

### Lỗi: "Token không hợp lệ"

**Nguyên nhân:** Token sai hoặc hết hạn

**Giải pháp:**
1. Check token trong Environment: `{{token}}`
2. Đăng nhập lại để lấy token mới
3. Đảm bảo header: `Authorization: Bearer {{token}}`

### Lỗi: 403 Forbidden

**Nguyên nhân:** Tài khoản không có quyền admin

**Giải pháp:**
1. Tạo admin: POST `/api/setup-admin`
2. Đăng nhập với admin
3. Token mới sẽ có role admin

### Lỗi: Cannot connect to localhost:3000

**Nguyên nhân:** Backend chưa chạy

**Giải pháp:**
```bash
cd d:\group15-project\backend
npm start
```

---

## 💡 Tips & Tricks

### 1. Auto-save Token
Thêm vào tab **Tests** của Login/Signup:
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
}
```

### 2. Pre-request Script - Check Token
```javascript
const token = pm.environment.get("token");
if (!token) {
    console.log("⚠️ No token found! Please login first.");
}
```

### 3. Test Response Structure
```javascript
pm.test("Response structure is valid", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData).to.have.property('data');
});
```

### 4. Extract User ID
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("userId", jsonData.data._id);
    console.log("User ID saved:", jsonData.data._id);
}
```

---

## 🎓 Bài tập thực hành

### Bài 1: User Journey
1. Đăng ký user mới
2. Đăng nhập
3. Lấy thông tin profile
4. Cập nhật tên
5. Upload avatar
6. Đổi mật khẩu

### Bài 2: Admin Journey
1. Tạo admin
2. Đăng nhập admin
3. Xem tất cả users
4. Xem chi tiết 1 user
5. Promote user lên admin
6. Xóa user

### Bài 3: Error Handling
1. Thử đăng ký email trùng
2. Thử login sai password
3. Thử gọi API admin với user thường
4. Thử upload avatar URL không hợp lệ

---

✅ **Hoàn thành!** Bây giờ bạn có thể test toàn bộ API bằng Postman! 🚀
