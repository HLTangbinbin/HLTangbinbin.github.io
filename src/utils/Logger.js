const logLevels = ['debug', 'info', 'warn', 'error'];

// 默认：生产环境日志等级为 warn，开发环境为 debug
const defaultLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
const envLogLevel = process.env.VUE_APP_DEBUG_LEVEL
  || process.env.DEBUG_LEVEL
  || process.env.debug_LEVEL;
const currentLevel = logLevels.includes(envLogLevel) ? envLogLevel : defaultLevel;

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
    if (shouldLog('info')) {
      console.time('[INFO]', ...args);
    }
  },
  timeEnd: (...args) => {
    if (shouldLog('info')) {
      console.timeEnd('[INFO]', ...args);
    }
  },
};

