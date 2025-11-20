const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // nạp model User

const app = express();
app.use(express.json());

//  Thay username, password và cluster theo tài khoản MongoDB Atlas của bạn
mongoose.connect('mongodb+srv://phngdy1529_db_user:123456sv3@groupdb.aztjyne.mongodb.net/GroupDB?retryWrites=true&w=majority&appName=GroupDB', 
  {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB connected'))
.catch(err => console.log(' MongoDB connection error:', err));


// Thêm user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Lấy danh sách user
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(3000, () => {
  console.log(' Server is running on http://localhost:3000');
});
