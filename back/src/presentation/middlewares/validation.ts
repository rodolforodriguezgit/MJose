import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../application/errors/AppErrors';
import { DateRangeValidator, SaleValidator } from '../dtos/SalesDTOs';


export const validateDateRangeQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw new ValidationError(
      'Los parámetros startDate y endDate son requeridos',
      ['startDate', 'endDate']
    );
  }

  const errors = DateRangeValidator.validate({
    startDate: startDate as string,
    endDate: endDate as string
  });

  if (errors.length > 0) {
    throw new ValidationError(`Errores de validación: ${errors.join(', ')}`);
  }

  next();
};


export const validateSaleBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = SaleValidator.validate(req.body);

  if (errors.length > 0) {
    throw new ValidationError(`Errores de validación: ${errors.join(', ')}`);
  }

  next();
};


export const validateBodyNotEmpty = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ValidationError('El cuerpo de la petición no puede estar vacío');
  }

  next();
};


export const sanitizeInputs = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = (req.query[key] as string).trim();
      }
    });
  }

  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  next();
}
