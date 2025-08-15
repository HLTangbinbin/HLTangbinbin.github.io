const logLevels = ['debug', 'info', 'warn', 'error'];

// 默认：生产环境日志等级为 warn，开发环境为 debug
const defaultLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
const currentLevel = process.env.LOG_LEVEL || defaultLevel;

function shouldLog(level) {
  return logLevels.indexOf(level) >= logLevels.indexOf(currentLevel);
}

export const logger = {
  debug: (...args) => {
    if (shouldLog('debug')) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args) => {
    if (shouldLog('info')) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args) => {
    if (shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args) => {
    if (shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
  },
  time: (...args) => {
    if (shouldLog('time')) {
      console.time('[INFO]', ...args);
    }
  },
  timeEnd: (...args) => {
    if (shouldLog('timeEnd')) {
      console.timeEnd('[INFO]', ...args);
    }
  },
};


