# Hướng dẫn Test Profile Management API - Hoạt động 2

## 📋 API Endpoints mới

### 1. **XEM THÔNG TIN PROFILE (View Profile)**

**Endpoint:** `GET http://localhost:3000/api/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Lấy thông tin profile thành công",
  "data": {
    "user": {
      "_id": "673f123abc456def...",
      "name": "Nguyen Van A",
      "email": "vana@example.com",
      "role": "user",
      "avatar": "https://via.placeholder.com/150",
      "createdAt": "2025-11-09T10:30:00.000Z",
      "updatedAt": "2025-11-09T10:30:00.000Z"
    }
  }
}
```

---

### 2. **CẬP NHẬT THÔNG TIN PROFILE (Update Profile)**

**Endpoint:** `PUT http://localhost:3000/api/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

#### **Cập nhật Name và Avatar:**

**Body (JSON):**
```json
{
  "name": "Nguyen Van A Updated",
  "avatar": "https://i.pravatar.cc/150?img=12"
}
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Cập nhật profile thành công",
  "data": {
    "user": {
      "_id": "673f123abc456def...",
      "name": "Nguyen Van A Updated",
      "email": "vana@example.com",
      "role": "user",
      "avatar": "https://i.pravatar.cc/150?img=12",
      "createdAt": "2025-11-09T10:30:00.000Z",
      "updatedAt": "2025-11-09T11:00:00.000Z"
    }
  }
}
```

---

#### **Cập nhật Email:**

**Body (JSON):**
```json
{
  "email": "newemail@example.com"
}
```

**Lưu ý:** 
- Email mới không được trùng với user khác
- Email sẽ được chuyển thành lowercase

---

#### **Đổi Mật khẩu:**

**Body (JSON):**
```json
{
  "currentPassword": "123456",
  "newPassword": "newpassword123"
}
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Cập nhật profile thành công",
  "data": {
    "user": {
      "_id": "673f123abc456def...",
      "name": "Nguyen Van A",
      "email": "vana@example.com",
      "role": "user",
      "avatar": "https://via.placeholder.com/150",
      "createdAt": "2025-11-09T10:30:00.000Z",
      "updatedAt": "2025-11-09T11:15:00.000Z"
    }
  }
}
```

**Response lỗi - Sai mật khẩu hiện tại (401):**
```json
{
  "success": false,
  "message": "Mật khẩu hiện tại không đúng"
}
```

**Response lỗi - Mật khẩu mới quá ngắn (400):**
```json
{
  "success": false,
  "message": "Mật khẩu mới phải có ít nhất 6 ký tự"
}
```

---

#### **Cập nhật nhiều trường cùng lúc:**

**Body (JSON):**
```json
{
  "name": "New Full Name",
  "email": "newemail@example.com",
  "avatar": "https://i.pravatar.cc/150?img=20",
  "currentPassword": "123456",
  "newPassword": "newpass789"
}
```

---

## 🧪 Test Cases - Hoạt động 2

### ✅ **Test View Profile thành công**
1. Đăng nhập để lấy token
2. Gọi `GET /api/auth/profile` với Bearer token
3. ➡️ Trả về thông tin user đầy đủ

### ❌ **Test View Profile thất bại**
1. Không có token → Error 401: "Vui lòng đăng nhập để truy cập"
2. Token không hợp lệ → Error 401: "Token không hợp lệ"
3. Token hết hạn → Error 401

---

### ✅ **Test Update Profile - Name/Avatar**
1. Gọi `PUT /api/auth/profile` với token + name mới
2. ➡️ Trả về user với name đã cập nhật
3. Gọi lại `GET /api/auth/profile` để verify

### ✅ **Test Update Profile - Email**
1. Gọi `PUT /api/auth/profile` với email mới (chưa tồn tại)
2. ➡️ Email được cập nhật thành công
3. Test login với email mới

### ❌ **Test Update Profile - Email trùng**
1. Tạo user A với email `a@test.com`
2. Tạo user B với email `b@test.com`
3. User B cập nhật email thành `a@test.com`
4. ➡️ Error 400: "Email đã được sử dụng bởi người khác"

### ✅ **Test Update Profile - Đổi mật khẩu**
1. Gọi `PUT /api/auth/profile` với:
   - currentPassword: mật khẩu hiện tại đúng
   - newPassword: mật khẩu mới (>= 6 ký tự)
2. ➡️ Cập nhật thành công
3. Logout
4. Login lại với mật khẩu mới → Thành công
5. Login lại với mật khẩu cũ → Thất bại

### ❌ **Test Update Profile - Sai mật khẩu hiện tại**
1. Gọi `PUT /api/auth/profile` với currentPassword sai
2. ➡️ Error 401: "Mật khẩu hiện tại không đúng"

### ❌ **Test Update Profile - Mật khẩu mới quá ngắn**
1. Gọi `PUT /api/auth/profile` với newPassword < 6 ký tự
2. ➡️ Error 400: "Mật khẩu mới phải có ít nhất 6 ký tự"

---

## 📸 Sản phẩm nộp (Hoạt động 2)

### Backend:
1. ✅ Code: `authController.js` (viewProfile, updateProfile)
2. ✅ Code: `routes/auth.js` (GET /profile, PUT /profile)

### Screenshots Postman:
1. 📸 View Profile thành công (GET)
2. 📸 Update Name + Avatar thành công
3. 📸 Update Email thành công
4. 📸 Đổi mật khẩu thành công
5. 📸 Test lỗi: Email trùng
6. 📸 Test lỗi: Sai mật khẩu hiện tại
7. 📸 Test login với mật khẩu mới sau khi đổi

---

## 🔐 Security Features

- ✅ Chỉ user đã đăng nhập mới xem/sửa profile (middleware `protect`)
- ✅ User chỉ có thể xem/sửa profile của chính mình
- ✅ Kiểm tra email trùng khi cập nhật
- ✅ Yêu cầu mật khẩu hiện tại khi đổi password
- ✅ Mã hóa password mới bằng bcrypt
- ✅ Validation mật khẩu mới >= 6 ký tự

---

## 🎯 Luồng Test hoàn chỉnh

### Scenario 1: Cập nhật thông tin cơ bản
1. Đăng ký user mới
2. Đăng nhập → lấy token
3. Xem profile (`GET /profile`)
4. Cập nhật name + avatar (`PUT /profile`)
5. Xem lại profile để verify

### Scenario 2: Đổi mật khẩu
1. Đăng nhập → lấy token
2. Đổi password (`PUT /profile` với currentPassword + newPassword)
3. Logout
4. Login lại với password mới → Thành công ✅
5. Login với password cũ → Thất bại ❌

### Scenario 3: Cập nhật email
1. Đăng nhập user A
2. Cập nhật email mới
3. Logout
4. Login lại với email mới → Thành công ✅

---

## 📝 Notes

- Avatar có thể dùng link ảnh từ:
  - Placeholder: `https://via.placeholder.com/150`
  - Random avatar: `https://i.pravatar.cc/150?img=12` (thay số 12 bằng 1-70)
  - Cloudinary (nếu có setup)

- Không cần truyền tất cả các trường khi update, chỉ truyền trường nào muốn đổi

- Password luôn được mã hóa trước khi lưu vào database (bcrypt với 10 salt rounds)

---

## 🚀 Next: Hoạt động 3 - Admin User Management

Tiếp theo sẽ làm:
- Danh sách người dùng (chỉ Admin)
- Xóa tài khoản (Admin hoặc tự xóa)
- Phân quyền RBAC
