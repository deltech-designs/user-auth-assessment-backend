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
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  'http://localhost:3000', // Add local development origin
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, '')); // Normalize by removing trailing slashes

// Validate environment variables
if (!prodOrigin.length) {
  console.error(
    'Error: No valid FRONTEND_URL or FRONTEND_URL_2 provided in environment variables.'
  );
  process.exit(1);
}

console.log('Allowed origins:', prodOrigin); // Debug logging

const corsOptions = {
  origin: (origin, callback) => {
    // Log the incoming origin for debugging
    console.log('Request Origin:', origin);

    // Allow requests without an origin (e.g., Postman, cURL)
    if (!origin) {
      return callback(null, true);
    }

    // Normalize the incoming origin
    const normalizedOrigin = origin.replace(/\/$/, '');

    // Allow Vercel preview URLs (optional, adjust based on security needs)
    const isVercelPreview = origin.includes('.vercel.app');

    if (prodOrigin.includes(normalizedOrigin) || isVercelPreview) {
      callback(null, true);
    } else {
      console.log('Rejected origin:', origin);
      console.log('Allowed origins:', prodOrigin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', router);

// Database connection
connectDB()
  .then(() => {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });
