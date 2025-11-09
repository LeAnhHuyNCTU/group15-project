import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function ForgotPassword({ onBack }) {
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập token + new password
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      setSuccess(response.data.message || 'Token reset đã được gửi! Check console để lấy token.');
      setStep(2);
      
      // Log token để demo (trong thực tế sẽ gửi qua email)
      console.log('=== RESET PASSWORD TOKEN ===');
      console.log('Token:', response.data.resetToken);
      console.log('Copy token này và dán vào form bên dưới');
      console.log('============================');
      
    } catch (error) {
      setError(error.response?.data?.message || 'Lỗi khi gửi yêu cầu reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!resetToken.trim()) {
      setError('Vui lòng nhập token reset');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      await axios.put(`${API_URL}/auth/reset-password/${resetToken}`, {
        password: newPassword
      });
      
      setSuccess('🎉 Đổi mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.');
      
      // Sau 2 giây quay về trang đăng nhập
      setTimeout(() => {
        if (onBack) onBack();
      }, 2000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '50px auto', 
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '2px solid #007bff'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        🔐 Quên mật khẩu
      </h2>

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

      {step === 1 ? (
        <form onSubmit={handleRequestReset}>
          <p style={{ textAlign: 'center', color: '#666' }}>
            Nhập email của bạn để nhận token reset password
          </p>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              style={{ 
                width: '100%', 
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}
          >
            {loading ? '⏳ Đang gửi...' : '📧 Gửi token reset'}
          </button>

          <button
            type="button"
            onClick={onBack}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Quay lại đăng nhập
          </button>

          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#fff3cd',
            borderRadius: '5px',
            fontSize: '13px',
            border: '1px solid #ffc107'
          }}>
            <strong>💡 Lưu ý:</strong> Token sẽ hiển thị trong Console (F12) để demo. 
            Trong thực tế, token sẽ được gửi qua email.
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#d1ecf1',
            borderRadius: '5px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #bee5eb'
          }}>
            <strong>📌 Hướng dẫn:</strong>
            <ol style={{ marginTop: '10px', paddingLeft: '20px', marginBottom: 0 }}>
              <li>Mở Console (F12)</li>
              <li>Copy token được hiển thị</li>
              <li>Dán vào form bên dưới</li>
              <li>Nhập mật khẩu mới</li>
            </ol>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Reset Token:
            </label>
            <input
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Paste token từ console vào đây"
              required
              style={{ 
                width: '100%', 
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '13px',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Mật khẩu mới:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              required
              style={{ 
                width: '100%', 
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Xác nhận mật khẩu:
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              required
              style={{ 
                width: '100%', 
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}
          >
            {loading ? '⏳ Đang xử lý...' : '🔑 Đổi mật khẩu'}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Quay lại
          </button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
