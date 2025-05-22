import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import connectDB from './src/config/db.js';
// import { initializeAdmin } from './src/controllers/authController.js'; // Uncomment if needed
import indexRoutes from './src/routes/index.js';

// Load environment variables
dotenv.config();

// Emulate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Connect to MongoDB
connectDB();

// Optionally initialize default admin
// initializeAdmin();

// API routes
app.use('/api', indexRoutes);

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
