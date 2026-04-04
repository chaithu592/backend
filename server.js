const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──
app.use('/api/auth',            require('./routes/auth'));
app.use('/api/patients',        require('./routes/patients'));
app.use('/api/doctors',         require('./routes/doctors'));
app.use('/api/nurses',          require('./routes/nurses'));
app.use('/api/appointments',    require('./routes/appointments'));
app.use('/api/medical-records', require('./routes/medicalRecords'));
app.use('/api/billing',         require('./routes/billing'));
app.use('/api/departments',     require('./routes/departments'));

// ── Health Check ──
app.get('/', (req, res) => {
  res.json({ message: '🏥 Hospital Management API is running' });
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});