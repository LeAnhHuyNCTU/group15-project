# 🔐 Quản lý Token - Hướng dẫn đơn giản

## 📋 Luồng hoạt động của Token

### 1️⃣ Khi đăng ký/đăng nhập:

```javascript
// Backend trả về:
{
  "success": true,
  "data": {
    "user": { _id, name, email, role, avatar },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// Frontend lưu token:
localStorage.setItem('token', response.data.data.token);
```

### 2️⃣ Khi gửi request đến API cần xác thực:

```javascript
// Lấy token từ localStorage
const token = localStorage.getItem('token');

// Gửi trong header Authorization
axios.get('/api/auth/profile', {
  headers: { 
    Authorization: `Bearer ${token}` 
  }
});
```

### 3️⃣ Khi token hết hạn (401 error):

```javascript
// Axios interceptor tự động:
- Xóa token khỏi localStorage
- Đăng xuất user
- Hiển thị thông báo "Phiên đăng nhập đã hết hạn"
```

### 4️⃣ Khi đăng xuất:

```javascript
// Xóa token
localStorage.removeItem('token');

// Reset state
setToken('');
setIsLoggedIn(false);
setCurrentUser(null);
```

## 🔍 Kiểm tra Token trong Console

### Xem token hiện tại:
```javascript
localStorage.getItem('token')
```

### Xóa token thủ công:
```javascript
localStorage.removeItem('token');
location.reload();
```

### Kiểm tra token có hợp lệ không:
```javascript
fetch('http://localhost:3000/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(console.log)
```

## ✅ Checklist hoạt động đúng:

- [ ] Sau khi đăng nhập, token được lưu vào localStorage
- [ ] Mỗi request đến API đều gửi kèm token trong header
- [ ] Khi token hết hạn, tự động đăng xuất
- [ ] Khi refresh trang, token vẫn còn và tự động đăng nhập lại
- [ ] Khi đăng xuất, token bị xóa hoàn toàn

## 🐛 Debug khi có lỗi:

### Lỗi: "Token không hợp lệ"
```javascript
// 1. Kiểm tra token có tồn tại không:
console.log('Token:', localStorage.getItem('token'));

// 2. Kiểm tra độ dài token (phải > 100 ký tự):
console.log('Length:', localStorage.getItem('token')?.length);

// 3. Xóa token cũ và đăng nhập lại:
localStorage.removeItem('token');
location.reload();
```

### Lỗi: "Token đã hết hạn"
```javascript
// Token JWT có thời hạn 7 ngày
// Giải pháp: Đăng xuất và đăng nhập lại
```

### Lỗi: "No token, cannot fetch users"
```javascript
// Token chưa được lưu vào localStorage
// Kiểm tra hàm handleLoginSuccess có gọi localStorage.setItem chưa
```

## 📝 Code quan trọng

### App.js - Lưu token sau khi đăng nhập:
```javascript
const handleLoginSuccess = (user, userToken) => {
  console.log('🔐 Login success - Saving token');
  localStorage.setItem('token', userToken); // ✅ LƯU TOKEN
  setCurrentUser(user);
  setToken(userToken);
  setIsLoggedIn(true);
}
```

### Auth.jsx - Lấy token từ response:
```javascript
const response = await axios.post(`${API_URL}/auth/login`, { email, password });

const token = response.data.data.token; // ✅ Backend: { data: { user, token } }
const user = response.data.data.user;

localStorage.setItem('token', token);
onLoginSuccess(user, token);
```

### Profile.jsx - Sử dụng token:
```javascript
// Lấy token từ prop hoặc localStorage
const activeToken = token || localStorage.getItem('token');

// Gửi kèm mỗi request
const response = await axios.put(
  `${API_URL}/auth/profile`,
  updateData,
  { headers: { Authorization: `Bearer ${activeToken}` } }
);
```

## 🎯 Lưu ý quan trọng:

1. **Token được lưu 2 nơi:**
   - `localStorage.getItem('token')` - Persistent, tồn tại sau khi refresh
   - `token` state trong App.js - Temporary, mất khi refresh

2. **Luôn kiểm tra token trước khi gửi request:**
   ```javascript
   if (!token) {
     setError('Vui lòng đăng nhập lại');
     return;
   }
   ```

3. **Token format phải đúng:**
   - Bắt đầu bằng `eyJ...` (JWT standard)
   - Có 3 phần ngăn cách bởi dấu `.`
   - Độ dài > 100 ký tự

4. **Khi gặp lỗi 401:**
   - Axios interceptor tự động xử lý
   - Không cần xử lý thủ công trong mỗi component

## 🚀 Test ngay:

1. **Mở Console** (F12)
2. **Xóa token cũ:**
   ```javascript
   localStorage.removeItem('token'); location.reload();
   ```
3. **Đăng nhập lại**
4. **Kiểm tra token đã lưu:**
   ```javascript
   console.log('Token saved:', !!localStorage.getItem('token'));
   console.log('Token length:', localStorage.getItem('token')?.length);
   ```
5. **Test request:**
   ```javascript
   fetch('http://localhost:3000/api/auth/me', {
     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
   }).then(r => r.json()).then(console.log)
   ```

✅ Nếu thấy user data → Token hoạt động tốt!
❌ Nếu lỗi 401 → Token không hợp lệ, đăng nhập lại!
