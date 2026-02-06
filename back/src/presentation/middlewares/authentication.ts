import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../application/errors/AppErrors';


export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers['x-api-key'] as string;
  const validApiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new UnauthorizedError('API Key no proporcionada. Use el header "x-api-key"');
  }

  if (apiKey !== validApiKey) {
    throw new UnauthorizedError('API Key inválida');
  }

  next();
};


export const optionalAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers['x-api-key'] as string;
  const validApiKey = process.env.API_KEY;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    if (!apiKey) {
      throw new UnauthorizedError('API Key requerida en producción. Use el header "x-api-key"');
    }

    if (apiKey !== validApiKey) {
      throw new UnauthorizedError('API Key inválida');
    }
  }

  next();
}
