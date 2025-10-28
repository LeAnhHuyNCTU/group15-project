<<<<<<< HEAD
const User = require('../models/User.js'); // Lấy model từ Hoạt động 5

// GET: Lấy tất cả user từ MongoDB
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST: Tạo user mới vào MongoDB
exports.createUser = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
=======
let users = [];
let currentId = 1;

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.createUser = (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: currentId++,
    name,
    email
  };
  users.push(newUser);
  res.status(201).json(newUser);
};
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true } // {new: true} để trả về user sau khi đã cập nhật
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
>>>>>>> backend
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
<<<<<<< HEAD
=======

// DELETE: Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
>>>>>>> backend
