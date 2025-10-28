const express = require('express');
const app = express();
app.use(express.json()); // Cho phép server đọc JSON [cite: 41]

const PORT = process.env.PORT || 3000; // [cite: 42]
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // [cite: 43]