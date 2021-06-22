import logger from '../config/logger';
import { LoggerConstant } from './enums';
const winston = logger();

export default class Logger {
  static error(error: string, path: string, topic: string): void {
    winston.log({
      message: error,
      label: `${path}  ${topic}`,
      level: LoggerConstant.log_level_error,
    });
  }
  static info(message: string, path: string, topic: string): void {
    winston.log({
      message,
      label: `${path}  ${topic}()`,
      level: LoggerConstant.log_level_info,
    });
  }
  static debug(message: string, path: string, topic: string): void {
    winston.log({
      message: `###${message}`,
      label: `${path}  ${topic}`,
      level: LoggerConstant.log_level_debug,
    });
  }
}
