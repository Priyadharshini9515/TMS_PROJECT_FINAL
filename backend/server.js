require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const programmeRoutes = require('./routes/programmeRoutes');
const blockRoutes = require('./routes/blockRoutes');
const roomRoutes = require('./routes/roomRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const path = require('path');

const fs = require('fs');

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'https://tms040.rvscasmcafsd2k25.in',
  process.env.CLIENT_URL
].filter(Boolean);



const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/programmes', programmeRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Complaints
app.use('/api/complaints', complaintRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
