# 👨‍💼 Hướng dẫn sử dụng tính năng Admin

## 🎯 Tổng quan

Tài khoản Admin có quyền:
- ✅ Xem danh sách tất cả users
- ✅ Xem thông tin chi tiết từng user
- ✅ Thay đổi role của user (user ↔ admin)
- ✅ Xóa user khỏi hệ thống
- ✅ Xem thống kê (tổng số user, admin, user thường)

---

## 📝 Bước 1: Tạo tài khoản Admin

### Cách 1: Dùng file HTML có sẵn ⭐ (Đơn giản nhất)

1. Mở file: `create-admin.html` bằng trình duyệt
2. Hoặc truy cập: `file:///d:/group15-project/create-admin.html`
3. Điền thông tin:
   - **Tên:** Admin
   - **Email:** admin@example.com
   - **Mật khẩu:** admin123
4. Click **"Tạo Admin"**
5. Chờ thông báo thành công!

### Cách 2: Dùng PowerShell

Mở PowerShell và chạy:

```powershell
$body = @{
    name = "Admin"
    email = "admin@example.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/setup-admin" -Method POST -Body $body -ContentType "application/json"
```

### Cách 3: Dùng Browser Console (F12)

Paste vào Console:

```javascript
fetch('http://localhost:3000/api/setup-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Tạo admin thành công:', data);
  alert('Admin đã được tạo!\nEmail: admin@example.com\nPassword: admin123');
})
.catch(err => console.error('❌ Lỗi:', err));
```

---

## 🔐 Bước 2: Đăng nhập với tài khoản Admin

1. Truy cập: `http://localhost:3001`
2. Click tab **"Đăng nhập"**
3. Nhập:
   - **Email:** `admin@example.com`
   - **Password:** `admin123`
4. Click **"Đăng nhập"**

✅ Sau khi đăng nhập thành công, bạn sẽ thấy nút **"Admin"** xuất hiện trên thanh navigation!

---

## 🎛️ Bước 3: Sử dụng trang Admin

### Giao diện Admin Management

Sau khi đăng nhập, click nút **"🔐 Admin"** trên thanh navigation.

Bạn sẽ thấy:

#### 📊 Thống kê Dashboard
```
┌─────────────────┬─────────────────┬─────────────────┐
│ 👥 Tổng số User │ 👑 Admin Count  │ 👤 User Count   │
│      10         │       2         │       8         │
└─────────────────┴─────────────────┴─────────────────┘
```

#### 📋 Danh sách Users

| Avatar | Tên | Email | Role | Actions |
|--------|-----|-------|------|---------|
| 🖼️ | John Doe | john@example.com | admin | 👁️ 🔄 🗑️ |
| 🖼️ | Jane Smith | jane@example.com | user | 👁️ 🔄 🗑️ |

**Các nút hành động:**
- 👁️ **"Chi tiết"** - Xem thông tin đầy đủ của user
- 🔄 **"Đổi role"** - Chuyển user ↔ admin
- 🗑️ **"Xóa"** - Xóa user khỏi hệ thống

---

## 🛠️ Chức năng chi tiết

### 1️⃣ Xem chi tiết User

Click nút **"Chi tiết"** → Hiển thị modal với:
- ID
- Tên
- Email  
- Role
- Avatar
- Ngày tạo tài khoản

### 2️⃣ Thay đổi Role

Click nút **"Đổi role"** → Hiển thị modal:

```
┌─────────────────────────────────────┐
│  Đổi role cho: john@example.com     │
├─────────────────────────────────────┤
│  Role hiện tại: user                │
│                                     │
│  [ ] User                           │
│  [✓] Admin                          │
│                                     │
│  [Hủy]  [Cập nhật Role]            │
└─────────────────────────────────────┘
```

- Chọn radio button để đổi role
- Click **"Cập nhật Role"** để lưu
- User sẽ được cập nhật ngay lập tức

### 3️⃣ Xóa User

Click nút **"Xóa"** → Hiển thị confirm:

```
⚠️ Bạn có chắc chắn muốn xóa user này?
   Email: john@example.com
   
   [Hủy]  [Xác nhận xóa]
```

**⚠️ Lưu ý:** Không thể xóa chính mình!

---

## 🔒 Phân quyền

### Tài khoản User thường:
- ✅ Xem và cập nhật profile của mình
- ✅ Đổi mật khẩu
- ✅ Upload avatar
- ❌ **KHÔNG thấy** nút "Admin" trên navigation
- ❌ **KHÔNG truy cập** được trang Admin Management

### Tài khoản Admin:
- ✅ **TẤT CẢ** quyền của User thường
- ✅ Xem trang Admin Management
- ✅ Quản lý tất cả users
- ✅ Thay đổi role của users khác
- ✅ Xóa users (trừ chính mình)

---

## 🧪 Test các tình huống

### Test 1: User thường cố truy cập trang Admin

**Kịch bản:**
1. Đăng nhập với tài khoản user thường
2. Không thấy nút "Admin" trên navigation
3. Nếu cố gắng gọi API admin → Lỗi 403 Forbidden

**Kết quả mong đợi:** ❌ Không được phép truy cập

### Test 2: Admin xem danh sách users

**Kịch bản:**
1. Đăng nhập với admin@example.com
2. Click nút "Admin" trên navigation
3. Thấy danh sách tất cả users

**Kết quả mong đợi:** ✅ Hiển thị đầy đủ danh sách

### Test 3: Admin đổi role của user

**Kịch bản:**
1. Ở trang Admin Management
2. Click "Đổi role" của một user
3. Chọn role mới
4. Click "Cập nhật Role"

**Kết quả mong đợi:** ✅ Role được cập nhật, danh sách refresh

### Test 4: Admin xóa user

**Kịch bản:**
1. Click nút "Xóa" của một user
2. Confirm xác nhận
3. User bị xóa khỏi database

**Kết quả mong đợi:** ✅ User biến mất khỏi danh sách

### Test 5: Admin không thể xóa chính mình

**Kịch bản:**
1. Admin cố gắng xóa chính mình
2. Backend trả về lỗi

**Kết quả mong đợi:** ❌ Thông báo lỗi "Không thể xóa chính mình"

---

## 💡 Tips & Tricks

### 1. Tạo nhiều Admin
```javascript
// Tạo admin thứ 2
fetch('http://localhost:3000/api/setup-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Admin 2',
    email: 'admin2@example.com',
    password: 'admin123'
  })
}).then(r => r.json()).then(console.log)
```

### 2. Chuyển user thường thành admin
- Đăng nhập với tài khoản admin hiện tại
- Vào trang Admin Management
- Tìm user muốn promote
- Click "Đổi role" → chọn "Admin"

### 3. Kiểm tra role trong Console
```javascript
// Xem thông tin user hiện tại
fetch('http://localhost:3000/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log('Role:', data.data.role))
```

### 4. Debug quyền Admin
```javascript
// Kiểm tra user có phải admin không
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
console.log('Is Admin?', currentUser.role === 'admin');
```

---

## ❌ Troubleshooting

### Lỗi: Không thấy nút "Admin" sau khi đăng nhập

**Nguyên nhân:** Tài khoản không có role admin

**Giải pháp:**
1. Kiểm tra role trong Console:
   ```javascript
   fetch('http://localhost:3000/api/auth/me', {
     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
   }).then(r => r.json()).then(console.log)
   ```
2. Nếu role !== 'admin', dùng admin khác để promote
3. Hoặc tạo admin mới bằng `/api/setup-admin`

### Lỗi: "Không có quyền truy cập" (403)

**Nguyên nhân:** Tài khoản không phải admin nhưng cố truy cập API admin

**Giải pháp:** Đăng nhập bằng tài khoản admin

### Lỗi: Danh sách users trống

**Nguyên nhân:** 
- Backend chưa chạy
- Token không hợp lệ
- Chưa có user nào trong database

**Giải pháp:**
1. Kiểm tra backend đang chạy: `http://localhost:3000`
2. Kiểm tra token: `console.log(localStorage.getItem('token'))`
3. Tạo thêm users bằng cách đăng ký

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Tạo admin (PowerShell)
$body = '{"name":"Admin","email":"admin@example.com","password":"admin123"}' 
Invoke-RestMethod -Uri "http://localhost:3000/api/setup-admin" -Method POST -Body $body -ContentType "application/json"

# 2. Mở ứng dụng
# Truy cập: http://localhost:3001

# 3. Đăng nhập
# Email: admin@example.com
# Password: admin123

# 4. Click nút "🔐 Admin" trên navigation

# 5. Quản lý users! 🎉
```

---

## 📸 Screenshots mô tả

### Navigation Bar (Admin)
```
┌────────────────────────────────────────────────────────┐
│ 🏠 User Management System                              │
│                                                        │
│  [🏠 Trang chủ]  [👤 Profile]  [🔐 Admin]            │
│                              User: Admin  [Đăng xuất] │
└────────────────────────────────────────────────────────┘
```

### Navigation Bar (User thường)
```
┌────────────────────────────────────────────────────────┐
│ 🏠 User Management System                              │
│                                                        │
│  [🏠 Trang chủ]  [👤 Profile]                         │
│                              User: John  [Đăng xuất]  │
└────────────────────────────────────────────────────────┘
```
*Chú ý: User thường KHÔNG thấy nút "Admin"*

---

## 📚 API Endpoints (Dành cho Admin)

### GET /api/users
Lấy danh sách tất cả users
- **Auth:** Yêu cầu token
- **Role:** Admin only
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "users": [...]
    }
  }
  ```

### GET /api/users/:id
Xem chi tiết một user
- **Auth:** Yêu cầu token
- **Role:** Admin only

### PUT /api/users/:id/role
Thay đổi role của user
- **Auth:** Yêu cầu token
- **Role:** Admin only
- **Body:**
  ```json
  { "role": "admin" }
  ```

### DELETE /api/users/:id
Xóa user
- **Auth:** Yêu cầu token
- **Role:** Admin only
- **Lưu ý:** Không thể xóa chính mình

---

✅ **Hoàn thành!** Bây giờ bạn có thể quản lý hệ thống với quyền Admin! 🎉
