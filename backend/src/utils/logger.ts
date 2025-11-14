/**
 * @summary
 * A simple logger utility. In a real production environment, this should be
 * replaced with a more robust logging library like Winston or Pino, configured
 * to write to files, external services, etc.
 */

const log = (level: 'INFO' | 'WARN' | 'ERROR', message: string, context?: object) => {
  const timestamp = new Date().toISOString();
  const logObject = {
    timestamp,
    level,
    message,
    ...(context && { context }),
  };

  if (level === 'ERROR') {
    console.error(JSON.stringify(logObject, null, 2));
  } else if (level === 'WARN') {
    console.warn(JSON.stringify(logObject, null, 2));
  } else {
    console.log(JSON.stringify(logObject, null, 2));
  }
};

export const logger = {
  info: (message: string, context?: object) => log('INFO', message, context),
  warn: (message: string, context?: object) => log('WARN', message, context),
  error: (message: string, context?: object) => log('ERROR', message, context),
};
