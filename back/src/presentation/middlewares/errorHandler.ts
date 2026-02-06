import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../application/errors/AppErrors';


export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  console.error('❌ Error capturado:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });


  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

 
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && {
      details: err.message,
      stack: err.stack
    })
  });
}

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};


export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
};


export const validateJSON = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'JSON inválido en el cuerpo de la petición',
      timestamp: new Date().toISOString()
    });
    return;
  }
  next(err);
}
