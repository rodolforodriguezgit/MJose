import { Router } from 'express';
import { SalesController } from '../controllers/SalesController';
import { asyncHandler } from '../middlewares/errorHandler';
import {
  validateDateRangeQuery,
  validateSaleBody,
  validateBodyNotEmpty,
  sanitizeInputs
} from '../middlewares/validation';


export const createSalesRoutes = (salesController: SalesController): Router => {
  const router = Router();


  router.use(sanitizeInputs);

  /**
   * @route   GET /api/sales
   * @desc    Obtener todas las ventas
   * @access  Public (o Private con API key según configuración)
   */
  router.get(
    '/',
    asyncHandler(salesController.getAllSales)
  );

  /**
   * @route   GET /api/sales/date-range
   * @desc    Obtener ventas filtradas por rango de fechas
   * @query   startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
   * @access  Public
   */
  router.get(
    '/date-range',
    validateDateRangeQuery,
    asyncHandler(salesController.getSalesByDateRange)
  );

  /**
   * @route   GET /api/sales/total-by-region
   * @desc    Obtener el total de ventas por región
   * @access  Public
   */
  router.get(
    '/total-by-region',
    asyncHandler(salesController.getTotalByRegion)
  );

  /**
   * @route   GET /api/sales/top-client
   * @desc    Obtener el cliente con mayor monto acumulado
   * @access  Public
   */
  router.get(
    '/top-client',
    asyncHandler(salesController.getTopClient)
  );

  /**
   * @route   GET /api/sales/clients-totals
   * @desc    Obtener todos los clientes con sus totales acumulados
   * @access  Public
   */
  router.get(
    '/clients-totals',
    asyncHandler(salesController.getAllClientsTotals)
  );

  /**
   * @route   GET /api/sales/statistics
   * @desc    Obtener estadísticas generales
   * @access  Public
   */
  router.get(
    '/statistics',
    asyncHandler(salesController.getStatistics)
  );

  /**
   * @route   POST /api/sales
   * @desc    Crear una nueva venta
   * @body    { cliente, monto, fecha, region }
   * @access  Public
   */
  router.post(
    '/',
    validateBodyNotEmpty,
    validateSaleBody,
    asyncHandler(salesController.createSale)
  );

  return router;
};
