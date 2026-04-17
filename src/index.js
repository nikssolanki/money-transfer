import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import logger from "./services/logger.js";
import { connectDB } from "./config/db/db.js";
// import redisClient from "./config/redis.js"; // Commented out Redis
import initializeSocket from "./services/socket.js";
import { syncDatabase } from "./models/index.js";
import walletRoutes from "./routes/wallet.js";
import authRoutes from "./routes/auth.js";
dotenv.config();

const app = express();
const server = createServer(app);
const io = initializeSocket(server);

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.get('/health', (req, res) => {
  res.send('Welcome to the Money Transfer System API');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await syncDatabase();
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();