import { createLogger, format, Logger, transports } from 'winston';
const { combine, timestamp, printf } = format;
const myFormat = printf(
  ({ level, label, message, timestamp }) =>
    `${timestamp} ${level}: [${label}] ${message}`,
);
export default (): Logger =>
  createLogger({
    transports: [
      new transports.File({
        filename: 'error.log',
        handleExceptions: true,
        format: combine(timestamp(), myFormat),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new transports.Console({
        handleExceptions: true,
        format: combine(timestamp(), format.colorize(), myFormat),
      }),
    ],
  });
