# Group15 Project - Ứng dụng Quản lý Người dùng

## 📋 Mô tả dự án
Ứng dụng web full-stack quản lý người dùng với chức năng CRUD đầy đủ (Create, Read, Update, Delete), kết nối MongoDB Atlas.

## 🛠️ Công nghệ sử dụng

| Lớp | Công nghệ | Chi tiết |
|------|-----------|----------|
| Database | MongoDB | Cơ sở dữ liệu NoSQL, lưu trữ dữ liệu người dùng |
| Backend | Express.js | Framework cho Node.js, xây dựng các API RESTful |
| Runtime | Node.js | Môi trường chạy mã Javascript phía máy chủ |
| Frontend | React | Thư viện Javascript để xây dựng giao diện người dùng động |
| Thư viện khác | Mongoose, Axios, Nodemon | Quản lý schema DB, gọi API, phát triển Backend |

## 🚀 Hướng dẫn cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd group15-project
```

### 2. Cài đặt Backend
```bash
cd backend
npm install
```

### 3. Cấu hình MongoDB
- Tạo file `.env` trong thư mục `backend` (nếu chưa có)
- Thêm connection string MongoDB của bạn:
```
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### 4. Chạy Backend
```bash
cd backend
npm start
```
Backend sẽ chạy tại: http://localhost:3000

### 5. Cài đặt Frontend
```bash
cd frontend
npm install
```

### 6. Chạy Frontend
```bash
cd frontend
npm start
```
Frontend sẽ chạy tại: http://localhost:3001

## 📁 Cấu trúc thư mục
```
group15-project/
├── backend/
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── user.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddUser.jsx
│   │   │   └── UserList.jsx
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users` | Lấy danh sách tất cả users |
| POST | `/api/users` | Tạo user mới |
| PUT | `/api/users/:id` | Cập nhật user theo ID |
| DELETE | `/api/users/:id` | Xóa user theo ID |

## 👥 Thành viên nhóm và Phân công

### Sinh viên 1: Backend (Node.js + Express)
- Hoạt động 2: Cài đặt Node.js & cấu trúc backend
- Hoạt động 3: Tạo REST API GET/POST User
- Hoạt động 7: Thêm API PUT/DELETE cho CRUD đầy đủ

### Sinh viên 2: Frontend (React)
- Hoạt động 4: Khởi tạo frontend + kết nối API GET/POST
- Hoạt động 6: Kết nối frontend với MongoDB
- Hoạt động 7: Thêm chức năng Sửa/Xóa user trên React
- Hoạt động 8: Quản lý state nâng cao & validation

### Sinh viên 3: Database (MongoDB)
- Hoạt động 5: Tích hợp MongoDB Atlas
- Tạo model User.js
- Cấu hình kết nối database

## ✅ Các hoạt động đã hoàn thành

- [x] Hoạt động 1: Chuẩn bị môi trường & khởi tạo dự án
- [x] Hoạt động 2: Cài đặt Node.js & cấu trúc backend
- [x] Hoạt động 3: Tạo REST API GET/POST User
- [x] Hoạt động 4: Khởi tạo frontend + kết nối API
- [x] Hoạt động 5: Tích hợp MongoDB Atlas
- [x] Hoạt động 6: Kết nối frontend với MongoDB
- [x] Hoạt động 7: CRUD nâng cao (PUT/DELETE)
- [x] Hoạt động 8: Quản lý state & validation
- [x] Hoạt động 9: Git nâng cao
- [x] Hoạt động 10: Hoàn thiện dự án & tổng hợp

## 📝 Ghi chú
- Đảm bảo MongoDB Atlas đã được cấu hình đúng
- Cần thay `<db_password>` trong file `.env` bằng mật khẩu thực tế
- Backend và Frontend cần chạy đồng thời để ứng dụng hoạt động đầy đủ

## 📞 Liên hệ
Repository: https://github.com/LeAnhHuyNCTU/group15-project

