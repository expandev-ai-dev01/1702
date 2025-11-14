import sql, { ConnectionPool, IRecordSet, Request } from 'mssql';
import { config } from '@/config';
import { logger } from './logger';

let pool: ConnectionPool;

const dbConfig = {
  server: config.database.server,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  options: {
    encrypt: config.database.options.encrypt,
    trustServerCertificate: config.database.options.trustServerCertificate,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const getPool = async (): Promise<ConnectionPool> => {
  if (pool && pool.connected) {
    return pool;
  }
  try {
    pool = await new ConnectionPool(dbConfig).connect();
    logger.info('Database connection pool established.');

    pool.on('error', (err) => {
      logger.error('Database pool error', err);
      // Consider attempting to reconnect or terminate the app
    });

    return pool;
  } catch (err) {
    logger.error('Failed to create database connection pool', err);
    throw err;
  }
};

export enum ExpectedReturn {
  Single,
  Multi,
  None,
}

/**
 * @summary
 * Executes a stored procedure against the database.
 * @param routine The name of the stored procedure (e.g., '[schema].[spName]').
 * @param parameters An object containing the input parameters for the procedure.
 * @param expectedReturn The expected return type from the procedure.
 */
export const dbRequest = async (
  routine: string,
  parameters: Record<string, any>,
  expectedReturn: ExpectedReturn
): Promise<any> => {
  try {
    const pool = await getPool();
    const request: Request = pool.request();

    for (const key in parameters) {
      if (Object.prototype.hasOwnProperty.call(parameters, key)) {
        request.input(key, parameters[key]);
      }
    }

    const result = await request.execute(routine);

    switch (expectedReturn) {
      case ExpectedReturn.Single:
        return result.recordset[0] || null;
      case ExpectedReturn.Multi:
        return result.recordsets;
      case ExpectedReturn.None:
        return;
      default:
        return result.recordset;
    }
  } catch (error) {
    logger.error(`Database error executing [${routine}]`, { error });
    // Re-throw the error to be handled by the service layer
    throw error;
  }
};
