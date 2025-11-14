import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from '@/config';
import { errorMiddleware } from '@/middleware/errorMiddleware';
import { notFoundMiddleware } from '@/middleware/notFoundMiddleware';
import apiRoutes from '@/routes';
import { logger } from '@/utils/logger';

const app: Application = express();

// Security Middleware
app.use(helmet());
app.use(cors(config.api.cors));

// Request Processing Middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.env !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health Check Endpoint (unversioned)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes with versioning
app.use('/api', apiRoutes);

// 404 Handler for unmatched routes
app.use(notFoundMiddleware);

// Centralized Error Handling Middleware
app.use(errorMiddleware);

const server = app.listen(config.api.port, () => {
  logger.info(`Server running on port ${config.api.port} in ${config.env} mode`);
});

// Graceful Shutdown
const signals = ['SIGTERM', 'SIGINT'];

const gracefulShutdown = (signal: string) => {
  process.on(signal, () => {
    logger.info(`${signal} received, closing server gracefully.`);
    server.close(() => {
      logger.info('Server closed.');
      // Close database connection here if needed
      process.exit(0);
    });
  });
};

signals.forEach(gracefulShutdown);

export default app;
