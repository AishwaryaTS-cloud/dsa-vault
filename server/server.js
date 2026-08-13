const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoRepository = require('./repositories/mongoRepository');
const memoryRepository = require('./repositories/memoryRepository');
const authRouter = require('./routes/auth');
const questionsRouter = require('./routes/questions');
const githubRouter = require('./routes/github');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Set default fallback repository
app.locals.repo = memoryRepository;

// Connect to MongoDB and set active repo
connectDB().then((isConnected) => {
  if (isConnected) {
    app.locals.repo = mongoRepository;
    console.log('[Server]: Operating with MongoDB Repository');
  } else {
    app.locals.repo = memoryRepository;
    console.log('[Server]: Operating with In-Memory Fallback Repository');
  }
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/github', githubRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    mode: app.locals.repo === mongoRepository ? 'MongoDB' : 'In-Memory',
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 DSA Pattern Vault Server running on port ${PORT}`);
});
