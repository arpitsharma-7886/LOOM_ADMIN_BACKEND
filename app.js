const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./src/config/db');
const adminRoutes = require('./src/routes/admin');
const { initializeAdmin } = require('./src/controllers/authController');
const authRoutes = require('./src/routes/auth');
const seedNavRoutes = require('./src/routes/seedNavItems');
const path = require('path');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
// Connect to the database
connectDB();

// initializeAdmin();

// Admin routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', seedNavRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
);