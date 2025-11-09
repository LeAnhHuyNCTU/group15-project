import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function Profile({ currentUser, token, onUpdateSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy token từ localStorage nếu prop token bị undefined
  const activeToken = token || localStorage.getItem('token');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updateData = { name, email };
      
      // Nếu muốn đổi mật khẩu
      if (newPassword) {
        if (!currentPassword) {
          setError('Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới');
          setLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          setError('Mật khẩu mới phải có ít nhất 6 ký tự');
          setLoading(false);
          return;
        }
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      // Debug: kiểm tra token
      console.log('Token being sent:', activeToken ? 'Token exists' : 'NO TOKEN!');
      console.log('Token length:', activeToken?.length);
      console.log('Token starts with:', activeToken?.substring(0, 20) + '...');
      
      if (!activeToken) {
        setError('Token không tồn tại. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      const response = await axios.put(`${API_URL}/auth/profile`, updateData, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      
      // Callback để cập nhật user ở component cha
      if (onUpdateSuccess) {
        onUpdateSuccess(response.data.data);
      }
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        setError('Token đã hết hạn hoặc không hợp lệ. Vui lòng đăng xuất và đăng nhập lại.');
      } else {
        setError(error.response?.data?.message || 'Lỗi khi cập nhật profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAvatar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const avatarUrl = avatar.trim();
      
      if (!avatarUrl) {
        setError('Vui lòng nhập URL avatar');
        setLoading(false);
        return;
      }

      // Validation URL
      try {
        new URL(avatarUrl);
      } catch (e) {
        setError('URL không hợp lệ. Vui lòng nhập URL đầy đủ (ví dụ: https://example.com/image.jpg)');
        setLoading(false);
        return;
      }

      // Debug: kiểm tra token
      console.log('🔐 Upload Avatar Request:');
      console.log('- Token exists:', activeToken ? 'Yes' : 'No');
      console.log('- Token length:', activeToken?.length);
      console.log('- Avatar URL:', avatarUrl);
      
      if (!activeToken) {
        setError('Token không tồn tại. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `${API_URL}/auth/avatar`,
        { avatar: avatarUrl },
        { 
          headers: { 
            Authorization: `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('✅ Upload response:', response.data);

      setSuccess('Upload avatar thành công!');
      setAvatar(''); // Clear input
      
      if (onUpdateSuccess && response.data.data) {
        onUpdateSuccess(response.data.data);
      }
    } catch (error) {
      console.error('❌ Upload avatar error:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        setError('Token đã hết hạn hoặc không hợp lệ. Vui lòng đăng xuất và đăng nhập lại.');
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.message || 'URL avatar không hợp lệ');
      } else {
        setError(error.response?.data?.message || 'Lỗi khi upload avatar. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>👤 Thông tin cá nhân</h2>

      {/* Debug Info */}
      {!activeToken && (
        <div style={{
          backgroundColor: '#ff6b6b',
          color: 'white',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '15px',
          fontWeight: 'bold'
        }}>
          ⚠️ CẢNH BÁO: Token không tồn tại! Vui lòng đăng xuất và đăng nhập lại.
        </div>
      )}

      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '12px', 
          borderRadius: '5px',
          marginBottom: '15px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          padding: '12px', 
          borderRadius: '5px',
          marginBottom: '15px',
          border: '1px solid #c3e6cb'
        }}>
          {success}
        </div>
      )}

      {/* Avatar Section */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        {currentUser?.avatar ? (
          <img 
            src={currentUser.avatar} 
            alt="Avatar" 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #28a745',
              marginBottom: '10px'
            }}
          />
        ) : (
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#6c757d',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            margin: '0 auto 10px'
          }}>
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        
        <form onSubmit={handleUploadAvatar} style={{ marginTop: '15px' }}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="url"
              value={avatar}
              onChange={(e) => {
                setAvatar(e.target.value);
                setError('');
              }}
              placeholder="Nhập URL avatar (https://example.com/image.jpg)"
              style={{ 
                width: '70%', 
                padding: '10px', 
                marginRight: '10px',
                borderRadius: '4px',
                border: '1px solid #ced4da',
                fontSize: '14px'
              }}
            />
            <button 
              type="submit" 
              disabled={loading || !activeToken}
              style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (loading || !activeToken) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {loading ? '⏳ Đang xử lý...' : '📤 Upload'}
            </button>
          </div>
          
          <div style={{
            backgroundColor: '#e7f3ff',
            padding: '12px',
            borderRadius: '5px',
            border: '1px solid #b3d9ff',
            fontSize: '13px',
            textAlign: 'left',
            marginTop: '10px'
          }}>
            <strong>� Hướng dẫn lấy URL ảnh:</strong>
            <ol style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
              <li>
                <strong>Imgur:</strong> Upload ảnh tại <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>imgur.com</a> → Copy link ảnh
              </li>
              <li>
                <strong>Cloudinary:</strong> Đăng ký miễn phí tại <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>cloudinary.com</a>
              </li>
              <li>
                <strong>Hoặc:</strong> Dùng link ảnh bất kỳ trên internet (đảm bảo link công khai)
              </li>
            </ol>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              ✅ Ví dụ URL hợp lệ: <code>https://i.imgur.com/abc123.jpg</code>
            </div>
          </div>
        </form>
      </div>

      {/* Profile Info */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        {!isEditing ? (
          <div>
            <h3>Thông tin hiện tại</h3>
            <div style={{ marginBottom: '15px' }}>
              <strong>Tên:</strong> {currentUser?.name}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Email:</strong> {currentUser?.email}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Role:</strong> 
              <span style={{
                marginLeft: '10px',
                padding: '4px 12px',
                backgroundColor: currentUser?.role === 'admin' ? '#dc3545' : '#28a745',
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {currentUser?.role === 'admin' ? '👑 ADMIN' : '👤 USER'}
              </span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Ngày tạo:</strong> {new Date(currentUser?.createdAt).toLocaleDateString('vi-VN')}
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '10px 30px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✏️ Chỉnh sửa thông tin
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <h3>Cập nhật thông tin</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Tên:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '14px'
                }}
              />
            </div>

            <hr style={{ margin: '20px 0' }} />
            
            <h4>Đổi mật khẩu (không bắt buộc)</h4>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Mật khẩu hiện tại:
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Để trống nếu không đổi"
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Mật khẩu mới:
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 30px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
                }}
              >
                {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setName(currentUser?.name || '');
                  setEmail(currentUser?.email || '');
                  setCurrentPassword('');
                  setNewPassword('');
                  setError('');
                }}
                style={{
                  padding: '10px 30px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ❌ Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
