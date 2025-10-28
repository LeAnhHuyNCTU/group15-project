// Nội dung file: frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// URL của Backend (đang chạy ở cổng 3000)
const API_URL = 'http://localhost:3000';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // State mới để theo dõi user đang được sửa
  const [editingUser, setEditingUser] = useState(null); 

  // 1. Hàm gọi API để lấy danh sách user (GET)
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Hàm xử lý khi Submit form (Thêm mới hoặc Cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Vui lòng nhập tên và email');
      return;
    }

    const userData = { name, email };

    try {
      if (editingUser) {
        // --- Chế độ SỬA (PUT) ---
        await axios.put(`${API_URL}/users/${editingUser._id}`, userData);
      } else {
        // --- Chế độ THÊM MỚI (POST) ---
        await axios.post(`${API_URL}/users`, userData);
      }
      
      fetchUsers();     // Tải lại danh sách
      resetForm();      // Xóa form
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // 3. Hàm xử lý XÓA (DELETE) - HOẠT ĐỘNG 7
  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
      try {
        await axios.delete(`${API_URL}/users/${userId}`);
        fetchUsers(); // Tải lại danh sách sau khi xóa
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // 4. Hàm xử lý khi nhấn nút "Sửa" - HOẠT ĐỘNG 7
  const handleEdit = (user) => {
    setEditingUser(user); // Lưu user đang sửa
    setName(user.name);     // Điền tên vào form
    setEmail(user.email);   // Điền email vào form
  };

  // 5. Hàm reset form
  const resetForm = () => {
    setName('');
    setEmail('');
    setEditingUser(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Quản lý Người dùng (CRUD)</h1>

      {/* Form (Thêm hoặc Sửa) */}
      <h2>{editingUser ? 'Cập nhật User' : 'Thêm User mới'}</h2>
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
        <button type="submit" style={{ marginTop: '10px' }}>
          {editingUser ? 'Cập nhật' : 'Thêm'}
        </button>
        {editingUser && (
          <button type="button" onClick={resetForm} style={{ marginLeft: '10px' }}>
            Hủy
          </button>
        )}
      </form>

      <hr style={{ margin: '20px 0' }} />

      {/* Danh sách user (UserList) */}
      <h2>Danh sách User (Từ MongoDB)</h2>
      {users.length === 0 ? (
        <p>Không có user nào.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Tên</th>
              <th style={{ textAlign: 'left', paddingLeft: '20px' }}>Email</th>
              <th style={{ paddingLeft: '20px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td style={{ paddingLeft: '20px' }}>{user.email}</td>
                <td style={{ paddingLeft: '20px' }}>
                  {/* Nút Sửa và Xóa - HOẠT ĐỘNG 7 */}
                  <button onClick={() => handleEdit(user)}>Sửa</button>
                  <button onClick={() => handleDelete(user._id)} style={{ marginLeft: '5px' }}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;