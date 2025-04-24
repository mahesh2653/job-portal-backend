import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import checkEnvVariable from "./utils/checkEnvVariable";
import connectionDB from "./data-souece";
import logger from "./utils/winston";
import routerApi from "./routes";
import errorHandlingMiddleware from "./middleware/error-handler";
import morganMiddleware from "./middleware/morgan";

// Load environment variables
dotenv.config();

// Initialize app and check PORT
const PORT = checkEnvVariable("PORT");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Express & MongoDB with TypeScript is running.");
});

// API routes
app.use("/api", routerApi);

// 404 Not Found Route
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(errorHandlingMiddleware);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectionDB();
    logger.info("✅ Database connected successfully");

    app.listen(PORT, () => {
      logger.info(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();
