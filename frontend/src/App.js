// Nội dung file: frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './components/Auth';
import Profile from './components/Profile';
import AdminUserManagement from './components/AdminUserManagement';

// URL của Backend (sử dụng environment variable)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentPage, setCurrentPage] = useState('home'); // home, profile, admin
  
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');

  // Axios interceptor: Tự động xóa token khi gặp lỗi 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        // Chỉ auto logout khi gặp 401 VÀ đang có user logged in
        if (error.response?.status === 401 && isLoggedIn) {
          console.log('🔴 Token expired - Auto logout');
          localStorage.removeItem('token');
          setToken('');
          setIsLoggedIn(false);
          setCurrentUser(null);
          setCurrentPage('home');
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [isLoggedIn]);

  // Check authentication on mount
  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 Checking authentication...');
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Auth valid - User:', response.data.data.name);
      setCurrentUser(response.data.data);
      setIsLoggedIn(true);
      fetchUsers();
    } catch (error) {
      console.log('⚠️ Auth check failed - Clearing old token');
      // Không log error chi tiết để tránh spam console
      localStorage.removeItem('token');
      setToken('');
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  const handleLoginSuccess = (user, userToken) => {
    console.log('🔐 Login success - Saving token to localStorage');
    localStorage.setItem('token', userToken); // LƯU TOKEN VÀO LOCALSTORAGE
    setCurrentUser(user);
    setToken(userToken);
    setIsLoggedIn(true);
    fetchUsers();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsers([]);
    setCurrentPage('home');
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  // 1. Hàm gọi API để lấy danh sách user (GET)
  const fetchUsers = async () => {
    if (!token) {
      console.log('No token, cannot fetch users');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      console.log('Fetch users response:', response.data);
      
      // Backend trả về { success: true, data: { users: [...] } }
      if (response.data.success && response.data.data && response.data.data.users) {
        setUsers(response.data.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      
      // Nếu không phải admin, hiển thị thông báo
      if (error.response?.status === 403) {
        setError('Bạn cần quyền Admin để xem danh sách users');
      }
      setUsers([]);
    }
  };

  // 2. Hàm xử lý khi Submit form (với VALIDATION)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError("Tên không được để trống");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    // Nếu thêm mới (không edit) thì cần password
    if (!editingUser && !password.trim()) {
      setError("Mật khẩu không được để trống");
      return;
    }

    if (!editingUser && password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      if (editingUser) {
        // Chế độ SỬA (PUT) - chỉ gửi name và email
        const userData = { name, email };
        await axios.put(`${API_URL}/users/${editingUser._id}`, userData);
      } else {
        // Chế độ THÊM MỚI (POST) - cần password
        const userData = { name, email, password };
        await axios.post(`${API_URL}/users`, userData);
      }
      
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.response?.data?.message || 'Lỗi khi lưu user. Email có thể đã tồn tại.');
    }
  };

  // 3. Hàm xử lý XÓA (DELETE)
  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
      try {
        await axios.delete(`${API_URL}/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // 4. Hàm xử lý khi nhấn nút "Sửa"
  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setError('');
  };

  // 5. Hàm reset form
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setEditingUser(null);
    setError('');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {!isLoggedIn ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div>
          {/* Navigation Bar */}
          <nav style={{ 
            backgroundColor: '#343a40',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <h2 style={{ color: 'white', margin: 0 }}>
                🏠 User Management System
              </h2>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setCurrentPage('home')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === 'home' ? '#007bff' : 'transparent',
                    color: 'white',
                    border: '1px solid white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🏠 Trang chủ
                </button>
                
                <button
                  onClick={() => setCurrentPage('profile')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentPage === 'profile' ? '#007bff' : 'transparent',
                    color: 'white',
                    border: '1px solid white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  👤 Profile
                </button>
                
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => setCurrentPage('admin')}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: currentPage === 'admin' ? '#dc3545' : 'transparent',
                      color: 'white',
                      border: '1px solid white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    👑 Quản lý Users
                  </button>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ color: 'white', textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {currentUser?.role === 'admin' ? '👑 Admin' : '👤 User'}
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🚪 Đăng xuất
              </button>
            </div>
          </nav>

          {/* Main Content */}
          <div style={{ padding: '30px' }}>
            {currentPage === 'home' && (
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h1>Chào mừng đến với User Management System! 👋</h1>
                
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  border: '1px solid #dee2e6'
                }}>
                  <h3>Các chức năng có sẵn:</h3>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '15px',
                    marginTop: '20px'
                  }}>
                    <div style={{
                      padding: '20px',
                      backgroundColor: '#e7f3ff',
                      borderRadius: '8px',
                      border: '1px solid #007bff'
                    }}>
                      <h4 style={{ marginTop: 0 }}>👤 Quản lý Profile</h4>
                      <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
                        <li>Xem thông tin cá nhân</li>
                        <li>Cập nhật tên & email</li>
                        <li>Đổi mật khẩu</li>
                        <li>Upload avatar</li>
                      </ul>
                    </div>
                    
                    {currentUser?.role === 'admin' && (
                      <div style={{
                        padding: '20px',
                        backgroundColor: '#ffe7e7',
                        borderRadius: '8px',
                        border: '1px solid #dc3545'
                      }}>
                        <h4 style={{ marginTop: 0 }}>👑 Quản lý Users (Admin)</h4>
                        <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
                          <li>Xem danh sách users</li>
                          <li>Phân quyền (User/Admin)</li>
                          <li>Xóa tài khoản</li>
                          <li>Xem chi tiết user</li>
                        </ul>
                      </div>
                    )}
                    
                    <div style={{
                      padding: '20px',
                      backgroundColor: '#e7ffe7',
                      borderRadius: '8px',
                      border: '1px solid #28a745'
                    }}>
                      <h4 style={{ marginTop: 0 }}>🔐 Bảo mật</h4>
                      <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
                        <li>JWT Authentication</li>
                        <li>Password hashing (bcrypt)</li>
                        <li>Forgot password</li>
                        <li>Role-based access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentPage === 'profile' && (
              <Profile 
                currentUser={currentUser} 
                token={token}
                onUpdateSuccess={handleUpdateProfile}
              />
            )}
            
            {currentPage === 'admin' && currentUser?.role === 'admin' && (
              <AdminUserManagement 
                token={token}
                currentUser={currentUser}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
