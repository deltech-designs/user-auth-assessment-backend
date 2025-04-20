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
].filter(Boolean);

const devOrigin = ['http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (prodOrigin.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      console.log(`CORS error: ${origin} is not allowed`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204, // For legacy browser support
};

app.use(cors(corsOptions)); // Enable CORS with the specified options

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB().then(() => {
  // Routes
  app.use('/api/v1', router);

  // Start server
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
