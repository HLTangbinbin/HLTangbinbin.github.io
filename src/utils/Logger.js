// utils/logger.js
const logLevels = ['debug', 'info', 'warn', 'error'];
const currentLevel = process.env.LOG_LEVEL || 'info'; // 支持动态日志级别

export const logger = {
  debug: (...args) => {
    if (process.env.NODE_ENV !== 'production' && logLevels.indexOf('debug') >= logLevels.indexOf(currentLevel)) {
      logger.log('[DEBUG]', ...args);
    }
  },
  error: (...args) => {
    if (logLevels.indexOf('error') >= logLevels.indexOf(currentLevel)) {
      logger.error('[ERROR]', ...args); // 生产环境也保留错误日志
    }
  }
};

