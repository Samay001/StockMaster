import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import connectDB from './config/db.js'
import cors from "cors";

const app = express();

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
