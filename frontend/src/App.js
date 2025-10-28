// Nội dung file: frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Đảm bảo bạn đã chạy 'npm install axios'

// URL của Backend (đang chạy ở cổng 3000)
const API_URL = 'http://localhost:3000';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // 1. Hàm gọi API để lấy danh sách user (GET)
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data); // Cập nhật danh sách user
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // 2. Chạy fetchUsers() khi component được tải lần đầu
  useEffect(() => {
    fetchUsers();
  }, []);

  // 3. Hàm xử lý khi thêm user (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Vui lòng nhập tên và email');
      return;
    }
    try {
      const newUser = { name, email };
      await axios.post(`${API_URL}/users`, newUser);
      fetchUsers(); // Tải lại danh sách user sau khi thêm
      setName('');   // Xóa form
      setEmail('');  // Xóa form
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Quản lý Người dùng</h1>

      {/* Form thêm user (AddUser) */}
      <h2>Thêm User mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Thêm</button>
      </form>

      <hr style={{ margin: '20px 0' }} />

      {/* Danh sách user (UserList) */}
      <h2>Danh sách User (Từ MongoDB)</h2>
      {users.length === 0 ? (
        <p>Không có user nào (hoặc backend chưa chạy).</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;