const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
