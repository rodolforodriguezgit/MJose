import { Request, Response } from 'express';
import { SalesService } from '../../application/services/SalesService';
import { ApiResponse } from '../dtos/SalesDTOs';


export class SalesController {
  constructor(private readonly salesService: SalesService) {}


  getAllSales = async (req: Request, res: Response): Promise<void> => {
    const sales = await this.salesService.getAllSales();
    
    const response: ApiResponse<any> = {
      success: true,
      data: sales.map(sale => sale.toJSON()),
      message: `Se encontraron ${sales.length} ventas`,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  };

 
  getSalesByDateRange = async (req: Request, res: Response): Promise<void> => {
    const { startDate, endDate } = req.query;
    
    const sales = await this.salesService.getSalesByDateRange(
      startDate as string,
      endDate as string
    );

    const response: ApiResponse<any> = {
      success: true,
      data: sales.map(sale => sale.toJSON()),
      message: `Se encontraron ${sales.length} ventas entre ${startDate} y ${endDate}`,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  };


  getTotalByRegion = async (req: Request, res: Response): Promise<void> => {
    const totals = await this.salesService.getTotalByRegion();

    const response: ApiResponse<any> = {
      success: true,
      data: totals.map(t => t.toJSON()),
      message: `Total de ventas agrupado en ${totals.length} regiones`,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  };

  
  getTopClient = async (req: Request, res: Response): Promise<void> => {
    const topClient = await this.salesService.getTopClient();

    if (!topClient) {
      const response: ApiResponse<null> = {
        success: true,
        data: null,
        message: 'No hay ventas registradas',
        timestamp: new Date().toISOString()
      };
      res.status(200).json(response);
      return;
    }

    const response: ApiResponse<any> = {
      success: true,
      data: topClient.toJSON(),
      message: `Cliente con mayor monto acumulado: ${topClient.cliente}`,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  };


  getAllClientsTotals = async (req: Request, res: Response): Promise<void> => {
    const clientsTotals = await this.salesService.getAllClientsTotals();

    const response: ApiResponse<any> = {
      success: true,
      data: clientsTotals.map(c => c.toJSON()),
      message: `Total acumulado de ${clientsTotals.length} clientes`,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  };


  getStatistics = async (req: Request, res: Response): Promise<void> => {
    const stats = await this.salesService.getStatistics();

    const response: ApiResponse<any> = {
      success: true,
      data: stats,
      message: 'Estadísticas generales obtenidas',
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  };


  createSale = async (req: Request, res: Response): Promise<void> => {
    const sale = await this.salesService.createSale(req.body);

    const response: ApiResponse<any> = {
      success: true,
      data: sale.toJSON(),
      message: 'Venta creada exitosamente',
      timestamp: new Date().toISOString()
    };

    res.status(201).json(response);
  };
}
