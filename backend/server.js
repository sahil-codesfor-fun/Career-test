const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Import Routes
const adminRoutes = require('./routes/adminRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/assessments', assessmentRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', message: 'Backend is running, Database is connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Backend is running, but Database connection failed' });
  }
});

async function startServer() {
  try {
    // Attempt to connect to the database
    await prisma.$connect();
    console.log('✅ Successfully connected to the MySQL database!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database. Error details:', error.message);
    process.exit(1); // Exit process with failure
  }
}

startServer();
