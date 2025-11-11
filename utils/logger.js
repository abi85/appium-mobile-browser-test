import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Logger Utility
 * Provides centralized logging functionality with different log levels
 * Following Single Responsibility Principle - handles only logging
 */

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write error logs to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write test execution logs
    new winston.transports.File({
      filename: path.join(logsDir, 'test-execution.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

/**
 * Custom logger methods for test execution
 */
export class TestLogger {
  static info(message) {
    logger.info(message);
  }

  static error(message, error = null) {
    if (error) {
      logger.error(`${message}: ${error.message}`, { stack: error.stack });
    } else {
      logger.error(message);
    }
  }

  static warn(message) {
    logger.warn(message);
  }

  static debug(message) {
    logger.debug(message);
  }

  static testStart(testName) {
    logger.info(`========== TEST STARTED: ${testName} ==========`);
  }

  static testEnd(testName, status) {
    logger.info(`========== TEST ENDED: ${testName} - Status: ${status} ==========`);
  }

  static step(stepDescription) {
    logger.info(`STEP: ${stepDescription}`);
  }

  static assertion(assertionDescription, result) {
    const status = result ? 'PASSED' : 'FAILED';
    logger.info(`ASSERTION [${status}]: ${assertionDescription}`);
  }

  static screenshot(screenshotPath) {
    logger.info(`Screenshot saved: ${screenshotPath}`);
  }
}

export default logger;

