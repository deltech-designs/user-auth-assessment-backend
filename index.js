import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow specific origins
const prodOrigin = [
  'https://user-auth-assessment-new-frontend.vercel.app/',
  'https://user-auth-assessment-frontend.vercel.app',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Add trailing slash-insensitive comparison
    const normalizedOrigins = prodOrigin.map((url) => url.replace(/\/$/, ''));
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : null;

    if (normalizedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.log('Rejected origin:', origin); // Debug log
      console.log('Allowed origins:', prodOrigin); // Debug log
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Enable CORS with the specified options

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

console.log(`CORS options: ${JSON.stringify(prodOrigin)}`); // Debug logging

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', router);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (prodOrigin.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});
// Database connection
connectDB().then(() => {
  // Start server
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
