# Hướng dẫn Test Admin User Management - Hoạt động 3

## 🎯 Phân quyền RBAC (Role-Based Access Control)

### Roles:
- **`user`** - Người dùng thường (mặc định khi đăng ký)
- **`admin`** - Quản trị viên (có full quyền)

---

## 📋 API Endpoints - Admin Only

### 1. **LẤY DANH SÁCH TẤT CẢ USER (Admin only)**

**Endpoint:** `GET http://localhost:3000/api/users`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json
```

**Response thành công (200):**
```json
{
  "success": true,
  "count": 5,
  "data": {
    "users": [
      {
        "_id": "673f123...",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin",
        "avatar": "https://via.placeholder.com/150",
        "createdAt": "2025-11-09T10:00:00.000Z",
        "updatedAt": "2025-11-09T10:00:00.000Z"
      },
      {
        "_id": "673f456...",
        "name": "Normal User",
        "email": "user@example.com",
        "role": "user",
        "avatar": "https://via.placeholder.com/150",
        "createdAt": "2025-11-09T10:30:00.000Z",
        "updatedAt": "2025-11-09T10:30:00.000Z"
      }
    ]
  }
}
```

**Response lỗi - Không phải admin (403):**
```json
{
  "success": false,
  "message": "Bạn không có quyền truy cập"
}
```

---

### 2. **LẤY THÔNG TIN 1 USER THEO ID (Admin only)**

**Endpoint:** `GET http://localhost:3000/api/users/:id`

**Ví dụ:** `GET http://localhost:3000/api/users/673f123abc456def`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json
```

**Response thành công (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "673f123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "avatar": "https://via.placeholder.com/150",
      "createdAt": "2025-11-09T10:30:00.000Z",
      "updatedAt": "2025-11-09T10:30:00.000Z"
    }
  }
}
```

**Response lỗi - User không tồn tại (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy user"
}
```

---

### 3. **CẬP NHẬT ROLE USER (Admin only)**

**Endpoint:** `PUT http://localhost:3000/api/users/:id/role`

**Headers:**
```
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json
```

**Body - Nâng lên Admin:**
```json
{
  "role": "admin"
}
```

**Body - Hạ xuống User:**
```json
{
  "role": "user"
}
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Đã cập nhật role thành admin",
  "data": {
    "user": {
      "_id": "673f456...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "avatar": "https://via.placeholder.com/150",
      "createdAt": "2025-11-09T10:30:00.000Z",
      "updatedAt": "2025-11-09T11:00:00.000Z"
    }
  }
}
```

**Response lỗi - Admin tự hạ quyền (400):**
```json
{
  "success": false,
  "message": "Không thể tự hạ quyền admin của chính mình"
}
```

**Response lỗi - Role không hợp lệ (400):**
```json
{
  "success": false,
  "message": "Role phải là \"user\" hoặc \"admin\""
}
```

---

### 4. **XÓA USER (Admin hoặc tự xóa)**

**Endpoint:** `DELETE http://localhost:3000/api/users/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Xóa user thành công",
  "data": {}
}
```

**Response lỗi - Không có quyền (403):**
```json
{
  "success": false,
  "message": "Bạn không có quyền xóa user này"
}
```

**Response lỗi - Xóa admin cuối cùng (400):**
```json
{
  "success": false,
  "message": "Không thể xóa admin cuối cùng trong hệ thống"
}
```

---

### 5. **TỰ XÓA TÀI KHOẢN (DELETE ME)**

**Endpoint:** `DELETE http://localhost:3000/api/users/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Tài khoản của bạn đã được xóa",
  "data": {}
}
```

**Response lỗi - Admin cuối cùng (400):**
```json
{
  "success": false,
  "message": "Bạn là admin cuối cùng, không thể tự xóa tài khoản"
}
```

---

## 🧪 Test Cases - Hoạt động 3

### Setup: Tạo test users

1. **Tạo Admin user:**
```json
POST /api/auth/signup
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "123456"
}
```
→ Lưu token, sau đó dùng MongoDB/Code để set role = 'admin'

2. **Tạo Normal user:**
```json
POST /api/auth/signup
{
  "name": "Normal User",
  "email": "user@test.com",
  "password": "123456"
}
```
→ Lưu token (role mặc định là 'user')

3. **Tạo thêm 2-3 users nữa để test**

---

### ✅ Test 1: Admin xem danh sách users

**Steps:**
1. Login với admin account → lấy admin token
2. `GET /api/users` với admin token
3. ➡️ Trả về danh sách tất cả users

**Expected:** Status 200, list của users

---

### ❌ Test 2: User thường xem danh sách (Forbidden)

**Steps:**
1. Login với user account → lấy user token
2. `GET /api/users` với user token
3. ➡️ Error 403: "Bạn không có quyền truy cập"

**Expected:** Status 403

---

### ✅ Test 3: Admin xem thông tin 1 user cụ thể

**Steps:**
1. Login admin → lấy admin token
2. Copy `_id` của 1 user từ danh sách
3. `GET /api/users/:id` với admin token
4. ➡️ Trả về chi tiết user đó

**Expected:** Status 200, thông tin user

---

### ✅ Test 4: Admin nâng user lên admin

**Steps:**
1. Login admin → lấy admin token
2. Copy `_id` của 1 user thường
3. `PUT /api/users/:id/role` với body: `{"role": "admin"}`
4. ➡️ User đó được nâng lên admin
5. Login lại với user đó → có quyền admin

**Expected:** Status 200, role = "admin"

---

### ✅ Test 5: Admin hạ admin xuống user

**Steps:**
1. Login admin A → lấy token
2. Copy `_id` của admin B (khác admin A)
3. `PUT /api/users/:id/role` với body: `{"role": "user"}`
4. ➡️ Admin B bị hạ xuống user

**Expected:** Status 200, role = "user"

---

### ❌ Test 6: Admin tự hạ quyền chính mình (Forbidden)

**Steps:**
1. Login admin → lấy token và user ID
2. `PUT /api/users/:own-id/role` với body: `{"role": "user"}`
3. ➡️ Error 400: "Không thể tự hạ quyền admin của chính mình"

**Expected:** Status 400

---

### ✅ Test 7: Admin xóa user thường

**Steps:**
1. Login admin → lấy admin token
2. Copy `_id` của 1 user thường
3. `DELETE /api/users/:id`
4. ➡️ User bị xóa
5. `GET /api/users` → user đó không còn trong list

**Expected:** Status 200, user bị xóa

---

### ✅ Test 8: User tự xóa tài khoản của mình

**Steps:**
1. Login user → lấy token
2. `DELETE /api/users/me`
3. ➡️ Tài khoản bị xóa
4. Thử login lại → fail

**Expected:** Status 200, không login được nữa

---

### ❌ Test 9: User xóa user khác (Forbidden)

**Steps:**
1. Login user A → lấy token A
2. Copy `_id` của user B
3. `DELETE /api/users/:id-of-B` với token A
4. ➡️ Error 403: "Bạn không có quyền xóa user này"

**Expected:** Status 403

---

### ❌ Test 10: Xóa admin cuối cùng (Forbidden)

**Steps:**
1. Chỉ có 1 admin duy nhất trong hệ thống
2. Admin đó thử tự xóa: `DELETE /api/users/me`
3. ➡️ Error 400: "Bạn là admin cuối cùng, không thể tự xóa"

**Expected:** Status 400

---

### ❌ Test 11: User không có token (Unauthorized)

**Steps:**
1. `GET /api/users` KHÔNG có header Authorization
2. ➡️ Error 401: "Vui lòng đăng nhập để truy cập"

**Expected:** Status 401

---

## 🔐 Security Features

- ✅ **RBAC**: Role-based access control (user/admin)
- ✅ **Middleware `protect`**: Yêu cầu JWT token hợp lệ
- ✅ **Middleware `authorize('admin')`**: Chỉ admin mới truy cập được
- ✅ **Self-delete protection**: User thường có thể tự xóa
- ✅ **Admin protection**: Không thể xóa admin cuối cùng
- ✅ **Self-demotion protection**: Admin không thể tự hạ quyền
- ✅ **Password hiding**: Không bao giờ trả về password trong response

---

## 📸 Sản phẩm nộp (Hoạt động 3)

### Backend Code:
1. ✅ `userController.js` - getAllUsers, getUserById, updateUserRole, deleteUser, deleteMe
2. ✅ `routes/user.js` - Admin routes với middleware protect & authorize
3. ✅ `middleware/auth.js` - authorize middleware

### Screenshots Postman:
1. 📸 Admin GET all users - Success
2. 📸 User GET all users - Forbidden (403)
3. 📸 Admin GET user by ID - Success
4. 📸 Admin nâng user lên admin - Success
5. 📸 Admin tự hạ quyền - Forbidden (400)
6. 📸 Admin xóa user - Success
7. 📸 User tự xóa tài khoản - Success
8. 📸 User xóa user khác - Forbidden (403)
9. 📸 Xóa admin cuối cùng - Forbidden (400)

---

## 🎯 Luồng Test hoàn chỉnh

### Scenario 1: Admin quản lý users
1. Tạo admin account (hoặc set role = admin trong DB)
2. Đăng ký 3-4 users thường
3. Admin login → GET danh sách users
4. Admin xem chi tiết 1 user
5. Admin nâng 1 user lên admin
6. Verify: Login user mới nâng → có quyền admin

### Scenario 2: Phân quyền
1. User thường login
2. Thử GET /api/users → 403 Forbidden
3. Admin login
4. GET /api/users → Success

### Scenario 3: Xóa user
1. Admin xóa 1 user thường → Success
2. User A thử xóa user B → 403 Forbidden
3. User tự xóa mình → Success

---

## 📝 Notes

### Cách tạo admin đầu tiên:
**Option 1: Dùng MongoDB Compass/Atlas**
- Tìm user trong collection
- Sửa field `role` từ `"user"` thành `"admin"`

**Option 2: Tạo script seed**
```javascript
// seed-admin.js
const User = require('./models/User');
const mongoose = require('mongoose');

mongoose.connect('your-mongodb-uri');

const createAdmin = async () => {
  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  });
  console.log('Admin created:', admin);
};

createAdmin();
```

---

## 🚀 Next: Frontend Integration

Tiếp theo có thể làm:
- Giao diện Admin Dashboard
- Bảng danh sách users với phân trang
- Form quản lý roles
- Confirmation dialog khi xóa user
