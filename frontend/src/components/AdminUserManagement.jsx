import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function AdminUserManagement({ token, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data.users) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Lỗi khi tải danh sách users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    setError('');
    setSuccess('');
    
    try {
      await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(`Đã cập nhật role thành ${newRole} thành công!`);
      setShowRoleModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Lỗi khi cập nhật role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa user "${userName}"?`)) {
      return;
    }

    setError('');
    setSuccess('');
    
    try {
      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess(`Đã xóa user "${userName}" thành công!`);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Lỗi khi xóa user');
    }
  };

  const handleViewUserDetail = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const user = response.data.data.user;
      alert(`📋 Chi tiết User:\n\nTên: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nNgày tạo: ${new Date(user.createdAt).toLocaleString('vi-VN')}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Lỗi khi xem chi tiết user');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2>👥 Quản lý Users (Admin)</h2>

      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '12px', 
          borderRadius: '5px',
          marginBottom: '15px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ {error}
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
          ✅ {success}
        </div>
      )}

      {/* Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{users.length}</div>
          <div>Tổng Users</div>
        </div>
        
        <div style={{
          backgroundColor: '#dc3545',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div>Admins</div>
        </div>
        
        <div style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {users.filter(u => u.role === 'user').length}
          </div>
          <div>Users</div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px' }}>⏳</div>
          <div>Đang tải danh sách users...</div>
        </div>
      ) : users.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
          <div>Không có user nào trong hệ thống</div>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #dee2e6'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '15px', textAlign: 'left', width: '30%' }}>Tên & Email</th>
                <th style={{ padding: '15px', textAlign: 'center', width: '15%' }}>Role</th>
                <th style={{ padding: '15px', textAlign: 'center', width: '20%' }}>Ngày tạo</th>
                <th style={{ padding: '15px', textAlign: 'center', width: '35%' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user._id} 
                  style={{ 
                    borderBottom: '1px solid #dee2e6',
                    backgroundColor: user._id === currentUser?._id ? '#fff3cd' : 'white'
                  }}
                >
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {user.name}
                      {user._id === currentUser?._id && (
                        <span style={{ 
                          marginLeft: '8px',
                          padding: '2px 8px',
                          backgroundColor: '#ffc107',
                          color: '#000',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}>
                          YOU
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6c757d' }}>{user.email}</div>
                  </td>
                  
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: user.role === 'admin' ? '#dc3545' : '#28a745',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'inline-block'
                    }}>
                      {user.role === 'admin' ? '👑 ADMIN' : '👤 USER'}
                    </span>
                  </td>
                  
                  <td style={{ padding: '15px', textAlign: 'center', fontSize: '13px', color: '#6c757d' }}>
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleViewUserDetail(user._id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                        title="Xem chi tiết"
                      >
                        👁️ Xem
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#ffc107',
                          color: '#000',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                        title="Đổi role"
                      >
                        🔄 Role
                      </button>
                      
                      <button
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        disabled={user._id === currentUser?._id}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: user._id === currentUser?._id ? '#6c757d' : '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: user._id === currentUser?._id ? 'not-allowed' : 'pointer',
                          fontSize: '13px',
                          opacity: user._id === currentUser?._id ? 0.5 : 1
                        }}
                        title={user._id === currentUser?._id ? 'Không thể tự xóa' : 'Xóa user'}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3>🔄 Thay đổi Role</h3>
            <p>
              Chọn role mới cho user: <strong>{selectedUser.name}</strong>
            </p>
            <p style={{ fontSize: '13px', color: '#6c757d' }}>
              Role hiện tại: <strong>{selectedUser.role}</strong>
            </p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => handleUpdateRole(selectedUser._id, 'user')}
                disabled={selectedUser.role === 'user'}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: selectedUser.role === 'user' ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: selectedUser.role === 'user' ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                👤 USER
              </button>
              
              <button
                onClick={() => handleUpdateRole(selectedUser._id, 'admin')}
                disabled={selectedUser.role === 'admin'}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: selectedUser.role === 'admin' ? '#6c757d' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: selectedUser.role === 'admin' ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                👑 ADMIN
              </button>
            </div>
            
            <button
              onClick={() => {
                setShowRoleModal(false);
                setSelectedUser(null);
              }}
              style={{
                width: '100%',
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUserManagement;
