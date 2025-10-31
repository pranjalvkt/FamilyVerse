import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname; // For ES modules

// Ensure log directory exists
const logDirectory = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logFilePath = path.join(logDirectory, "app.log");

export const logger = (req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;

  // Append log entry to file
  fs.appendFile(logFilePath, log, (err) => {
    if (err) console.error("❌ Error writing to log file:", err);
  });

  next();
};
