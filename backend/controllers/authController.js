const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Tạo JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d' // Token hết hạn sau 7 ngày
  });
};

// @desc    Đăng ký user mới
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin' 
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email đã được sử dụng' 
      });
    }

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password
    });

    // Tạo token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi đăng ký',
      error: error.message 
    });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập email và mật khẩu' 
      });
    }

    // Tìm user và lấy cả password (vì select: false)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        success: false,
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }

    // Tạo token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi đăng nhập',
      error: error.message 
    });
  }
};

// @desc    Đăng xuất
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  try {
    // Với JWT, việc logout chủ yếu xử lý ở client (xóa token)
    // Server chỉ cần trả về response thành công
    
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi đăng xuất',
      error: error.message 
    });
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private (cần token)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
};

// @desc    Xem thông tin profile (giống getMe)
// @route   GET /api/auth/profile
// @access  Private (cần token)
exports.viewProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin profile thành công',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('View profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
};

// @desc    Cập nhật thông tin profile
// @route   PUT /api/auth/profile
// @access  Private (cần token)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, avatar, currentPassword, newPassword } = req.body;
    
    // Tìm user hiện tại
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }

    // Cập nhật các trường cơ bản
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    // Kiểm tra và cập nhật email (nếu khác email cũ)
    if (email && email !== user.email) {
      // Kiểm tra email mới đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'Email đã được sử dụng bởi người khác' 
        });
      }
      user.email = email;
    }

    // Cập nhật mật khẩu nếu có
    if (currentPassword && newPassword) {
      // Kiểm tra mật khẩu hiện tại có đúng không
      const isPasswordCorrect = await user.comparePassword(currentPassword);
      
      if (!isPasswordCorrect) {
        return res.status(401).json({ 
          success: false,
          message: 'Mật khẩu hiện tại không đúng' 
        });
      }

      // Kiểm tra mật khẩu mới
      if (newPassword.length < 6) {
        return res.status(400).json({ 
          success: false,
          message: 'Mật khẩu mới phải có ít nhất 6 ký tự' 
        });
      }

      user.password = newPassword;
    }

    // Lưu user (sẽ tự động mã hóa password nếu có thay đổi)
    await user.save();

    // Trả về thông tin user đã cập nhật (không bao gồm password)
    const updatedUser = await User.findById(user._id);

    res.status(200).json({
      success: true,
      message: 'Cập nhật profile thành công',
      data: {
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi cập nhật profile',
      error: error.message 
    });
  }
};

// ==================== FORGOT PASSWORD - Hoạt động 4 ====================

// @desc    Quên mật khẩu - Gửi reset token
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập email' 
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user với email này' 
      });
    }

    // Tạo reset token
    const resetToken = user.getResetPasswordToken();

    // Lưu vào database
    await user.save({ validateBeforeSave: false });

    // Tạo reset URL (trong production sẽ là frontend URL)
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    // Trong production, bạn sẽ gửi email ở đây
    // Tạm thời trả về token trong response để test
    res.status(200).json({
      success: true,
      message: 'Reset token đã được tạo. Trong production sẽ gửi qua email.',
      data: {
        resetToken, // Chỉ để test, production không trả về
        resetUrl,   // URL để reset password
        expiresIn: '10 minutes'
      }
    });

    // TODO: Gửi email với resetUrl
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Password Reset Request',
    //   text: `Reset password tại: ${resetUrl}`
    // });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
};

// @desc    Reset mật khẩu với token
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng nhập mật khẩu mới' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự' 
      });
    }

    // Hash token từ URL params để so sánh với DB
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn' 
      });
    }

    // Set mật khẩu mới
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Tạo token mới để user tự động đăng nhập
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
};

// ==================== UPLOAD AVATAR - Hoạt động 4 ====================

// @desc    Upload avatar (Simple version - chỉ nhận URL)
// @route   PUT /api/auth/avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp URL avatar' 
      });
    }

    // Cập nhật avatar
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Upload avatar thành công',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      }
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server',
      error: error.message 
    });
  }
};


