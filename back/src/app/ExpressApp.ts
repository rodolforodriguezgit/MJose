import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Router } from 'express';
import {
  errorHandler,
  notFoundHandler,
  validateJSON
} from '../presentation/middlewares/errorHandler';
import { optionalAuthentication } from '../presentation/middlewares/authentication';


export class ExpressApp {
  private app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares(): void {

    this.app.use(helmet());

    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];
    this.app.use(cors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
      credentials: true
    }));


    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));


    this.app.use(validateJSON);


    const limiter = rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      message: {
        success: false,
        error: 'Demasiadas peticiones desde esta IP, intente de nuevo más tarde',
        timestamp: new Date().toISOString()
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);


    this.app.use('/api/', optionalAuthentication);


    // Logging desactivado para reducir ruido en consola
    // Descomentar si necesitas ver las peticiones HTTP
    // if (process.env.NODE_ENV === 'development') {
    //   this.app.use((req, res, next) => {
    //     console.log(`📨 ${req.method} ${req.path}`, {
    //       query: req.query,
    //       body: req.body
    //     });
    //     next();
    //   });
    // }
  }

  private configureRoutes(): void {

    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });


    this.app.get('/api', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Sales Data Lake API',
        version: '1.0.0',
        endpoints: {
          sales: '/api/sales',
          dateRange: '/api/sales/date-range',
          totalByRegion: '/api/sales/total-by-region',
          topClient: '/api/sales/top-client',
          clientsTotals: '/api/sales/clients-totals',
          statistics: '/api/sales/statistics'
        },
        timestamp: new Date().toISOString()
      });
    });
  }

  registerRoutes(path: string, router: Router): void {
    this.app.use(path, router);
  }

  configureErrorHandling(): void {

    this.app.use(notFoundHandler);

  
    this.app.use(errorHandler);
  }

  getApp(): Application {
    return this.app;
  }
}
