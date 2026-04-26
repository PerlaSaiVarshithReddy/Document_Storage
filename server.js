const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

app.use(cors());
app.use(express.json());

// In-memory user storage (use database in production)
let users = [];
let files = [];

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: uuidv4(), username, password: hashedPassword });
  res.status(201).json({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res.json({ token });
});

app.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileData = {
    id: uuidv4(),
    name: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    uploadDate: new Date(),
    userId: req.user.id
  };
  files.push(fileData);
  res.json({ message: 'File uploaded successfully', file: fileData });
});

app.get('/files', authenticateToken, (req, res) => {
  const userFiles = files.filter(f => f.userId === req.user.id);
  res.json(userFiles);
});

app.get('/download/:id', authenticateToken, (req, res) => {
  const file = files.find(f => f.id === req.params.id && f.userId === req.user.id);
  if (!file) {
    return res.status(404).json({ message: 'File not found' });
  }
  const filePath = path.join(__dirname, 'uploads', file.filename);
  res.download(filePath, file.name);
});

app.delete('/files/:id', authenticateToken, (req, res) => {
  const index = files.findIndex(f => f.id === req.params.id && f.userId === req.user.id);
  if (index === -1) {
    return res.status(404).json({ message: 'File not found' });
  }
  const file = files[index];
  fs.unlink(path.join(__dirname, 'uploads', file.filename), (err) => {
    if (err) console.error(err);
  });
  files.splice(index, 1);
  res.json({ message: 'File deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});