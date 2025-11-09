# Hướng dẫn Test Advanced Features - Hoạt động 4

## 🔐 Forgot Password & Reset Password

### 1. **QUÊN MẬT KHẨU (Forgot Password)**

**Endpoint:** `POST http://localhost:3000/api/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "user@example.com"
}
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Reset token đã được tạo. Trong production sẽ gửi qua email.",
  "data": {
    "resetToken": "a1b2c3d4e5f6g7h8i9j0...",
    "resetUrl": "http://localhost:3000/api/auth/reset-password/a1b2c3d4e5f6g7h8i9j0...",
    "expiresIn": "10 minutes"
  }
}
```

**Lưu ý:**
- Token hết hạn sau **10 phút**
- Trong production, `resetToken` sẽ được gửi qua email, không trả về trong response
- Copy `resetToken` để dùng cho bước tiếp theo

**Response lỗi - Email không tồn tại (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy user với email này"
}
```

---

### 2. **RESET MẬT KHẨU (Reset Password)**

**Endpoint:** `PUT http://localhost:3000/api/auth/reset-password/:resetToken`

**Ví dụ:** `PUT http://localhost:3000/api/auth/reset-password/a1b2c3d4e5f6g7h8i9j0...`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "password": "newpassword123"
}
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công",
  "data": {
    "user": {
      "_id": "673f123...",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "avatar": "https://via.placeholder.com/150"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Lưu ý:**
- Token tự động được tạo sau khi reset thành công → User tự động đăng nhập
- Mật khẩu mới phải >= 6 ký tự

**Response lỗi - Token không hợp lệ hoặc hết hạn (400):**
```json
{
  "success": false,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

**Response lỗi - Mật khẩu quá ngắn (400):**
```json
{
  "success": false,
  "message": "Mật khẩu phải có ít nhất 6 ký tự"
}
```

---

## 📸 Upload Avatar

### 3. **UPLOAD AVATAR (Simple Version - URL)**

**Endpoint:** `PUT http://localhost:3000/api/auth/avatar`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "avatarUrl": "https://i.pravatar.cc/150?img=15"
}
```

**Response thành công (200):**
```json
{
  "success": true,
  "message": "Upload avatar thành công",
  "data": {
    "user": {
      "_id": "673f123...",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "avatar": "https://i.pravatar.cc/150?img=15"
    }
  }
}
```

**Avatar URLs có thể dùng:**
- Placeholder: `https://via.placeholder.com/150`
- Random Avatar: `https://i.pravatar.cc/150?img=1` (thay số 1-70)
- UI Avatars: `https://ui-avatars.com/api/?name=John+Doe&size=150`
- Cloudinary (nếu có setup)

---

## 🧪 Test Cases - Hoạt động 4

### ✅ **Test Forgot Password - Thành công**

**Steps:**
1. Đăng ký user với email: `test@example.com`
2. `POST /forgot-password` với email: `test@example.com`
3. ➡️ Nhận được resetToken trong response
4. Copy resetToken

**Expected:** Status 200, có resetToken và resetUrl

---

### ❌ **Test Forgot Password - Email không tồn tại**

**Steps:**
1. `POST /forgot-password` với email không tồn tại: `notexist@example.com`
2. ➡️ Error 404

**Expected:** Status 404: "Không tìm thấy user với email này"

---

### ✅ **Test Reset Password - Thành công**

**Steps:**
1. Lấy resetToken từ forgot password
2. `PUT /reset-password/:resetToken` với password mới
3. ➡️ Mật khẩu được đổi, nhận token mới
4. Login với mật khẩu mới → Thành công
5. Login với mật khẩu cũ → Thất bại

**Expected:** Status 200, có user và token mới

---

### ❌ **Test Reset Password - Token không hợp lệ**

**Steps:**
1. `PUT /reset-password/invalid-token-123` với password mới
2. ➡️ Error 400

**Expected:** Status 400: "Token không hợp lệ hoặc đã hết hạn"

---

### ❌ **Test Reset Password - Token hết hạn**

**Steps:**
1. Lấy resetToken từ forgot password
2. Đợi 11 phút (token hết hạn sau 10 phút)
3. `PUT /reset-password/:resetToken` với password mới
4. ➡️ Error 400

**Expected:** Status 400: "Token không hợp lệ hoặc đã hết hạn"

---

### ❌ **Test Reset Password - Mật khẩu quá ngắn**

**Steps:**
1. Lấy resetToken hợp lệ
2. `PUT /reset-password/:resetToken` với password = "12345" (< 6 ký tự)
3. ➡️ Error 400

**Expected:** Status 400: "Mật khẩu phải có ít nhất 6 ký tự"

---

### ✅ **Test Upload Avatar - Thành công**

**Steps:**
1. Login → lấy token
2. `PUT /avatar` với avatarUrl hợp lệ
3. ➡️ Avatar được cập nhật
4. `GET /profile` để verify avatar mới

**Expected:** Status 200, avatar đã thay đổi

---

### ❌ **Test Upload Avatar - Không có token**

**Steps:**
1. `PUT /avatar` KHÔNG có header Authorization
2. ➡️ Error 401

**Expected:** Status 401: "Vui lòng đăng nhập để truy cập"

---

## 🎯 Luồng Test hoàn chỉnh

### Scenario 1: Quên mật khẩu và reset

1. **Đăng ký user mới:**
   ```json
   POST /api/auth/signup
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "oldpass123"
   }
   ```

2. **Login với password cũ → Thành công**

3. **Quên mật khẩu:**
   ```json
   POST /api/auth/forgot-password
   {
     "email": "test@example.com"
   }
   ```
   → Copy `resetToken` từ response

4. **Reset password:**
   ```
   PUT /api/auth/reset-password/{resetToken}
   {
     "password": "newpass123"
   }
   ```
   → Nhận token mới

5. **Verify:**
   - Login với password mới → Thành công ✅
   - Login với password cũ → Thất bại ❌

---

### Scenario 2: Upload avatar

1. **Login:**
   ```json
   POST /api/auth/login
   {
     "email": "test@example.com",
     "password": "123456"
   }
   ```
   → Lưu token

2. **Xem profile hiện tại:**
   ```
   GET /api/auth/profile
   Authorization: Bearer {token}
   ```
   → Avatar mặc định: `https://via.placeholder.com/150`

3. **Upload avatar mới:**
   ```json
   PUT /api/auth/avatar
   Authorization: Bearer {token}
   {
     "avatarUrl": "https://i.pravatar.cc/150?img=20"
   }
   ```

4. **Verify:**
   ```
   GET /api/auth/profile
   ```
   → Avatar đã thay đổi ✅

---

## 🔐 Security Features

- ✅ Reset token được **hash** trước khi lưu vào DB (SHA256)
- ✅ Token hết hạn sau **10 phút**
- ✅ Token chỉ dùng được **1 lần** (bị xóa sau khi reset)
- ✅ Mật khẩu mới được **mã hóa bằng bcrypt** tự động
- ✅ Avatar upload yêu cầu **authentication** (JWT token)
- ✅ Validation mật khẩu mới >= 6 ký tự

---

## 📸 Sản phẩm nộp (Hoạt động 4)

### Backend Code:
1. ✅ `User.js` - Thêm resetPasswordToken, resetPasswordExpire, getResetPasswordToken()
2. ✅ `authController.js` - forgotPassword, resetPassword, uploadAvatar
3. ✅ `routes/auth.js` - Routes cho forgot/reset password và avatar

### Screenshots Postman:
1. 📸 Forgot Password - Thành công (có resetToken)
2. 📸 Forgot Password - Email không tồn tại (404)
3. 📸 Reset Password - Thành công
4. 📸 Reset Password - Token không hợp lệ (400)
5. 📸 Login với mật khẩu mới sau reset - Thành công
6. 📸 Login với mật khẩu cũ sau reset - Thất bại
7. 📸 Upload Avatar - Thành công
8. 📸 Get Profile sau upload - Avatar đã đổi

---

## 📝 Notes

### Về Forgot Password trong Production:

Trong production thực tế, bạn cần:

1. **Gửi email với reset link:**
```javascript
const nodemailer = require('nodemailer');

const sendResetEmail = async (email, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: 'noreply@yourapp.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Bạn đã yêu cầu reset mật khẩu</h1>
      <p>Click vào link dưới để reset:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Link hết hạn sau 10 phút.</p>
    `
  });
};
```

2. **Frontend reset password page:**
   - URL: `/reset-password/:token`
   - Form nhập mật khẩu mới
   - Gửi PUT request đến backend với token

### Về Avatar Upload với Cloudinary:

Để upload file thật (không phải URL), cần:

1. **Cài đặt packages:**
```bash
npm install cloudinary multer
```

2. **Setup Cloudinary:**
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

3. **Upload middleware:**
```javascript
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/avatar', 
  protect, 
  upload.single('avatar'), 
  uploadAvatarToCloudinary
);
```

---

## 🚀 Next Steps

1. ✅ Test tất cả endpoints với Postman
2. ✅ Commit và push code
3. ✅ Tạo Pull Request
4. 🎨 Frontend (optional):
   - Form Forgot Password
   - Page Reset Password
   - Avatar Upload UI
   - Image preview trước khi upload
