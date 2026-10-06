import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { morganMiddleware } from "./middleware/logger.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import routes from "./routes/index.js";

const app = express();

// Trust the proxy (e.g. Railway, Heroku) so `X-Forwarded-For` is trusted
// This is required for express-rate-limit to correctly identify clients
// when the app is deployed behind a proxy/load balancer.
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Logging
app.use(morganMiddleware);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Rate limiting
app.use(generalLimiter);

// Routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
