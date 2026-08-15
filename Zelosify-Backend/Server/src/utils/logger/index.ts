export const logger = {
  info: (message: string, meta: Record<string, any> = {}) => {
    console.log(JSON.stringify({ level: 'INFO', message, ...meta, timestamp: new Date().toISOString() }));
  },
  error: (message: string, meta: Record<string, any> = {}) => {
    console.error(JSON.stringify({ level: 'ERROR', message, ...meta, timestamp: new Date().toISOString() }));
  },
  warn: (message: string, meta: Record<string, any> = {}) => {
    console.warn(JSON.stringify({ level: 'WARN', message, ...meta, timestamp: new Date().toISOString() }));
  },
  debug: (message: string, meta: Record<string, any> = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(JSON.stringify({ level: 'DEBUG', message, ...meta, timestamp: new Date().toISOString() }));
    }
  }
};
