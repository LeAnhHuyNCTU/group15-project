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
