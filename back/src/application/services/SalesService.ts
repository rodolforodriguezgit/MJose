import { Sale } from '../../domain/entities/Sale';
import { DateRange, RegionTotal, ClientTotal } from '../../domain/value-objects/ValueObjects';
import { ISalesRepository } from '../../domain/interfaces/ISalesRepository';


export class SalesService {
  constructor(private readonly salesRepository: ISalesRepository) {}


  async getAllSales(): Promise<Sale[]> {
    return await this.salesRepository.findAll();
  }


  async getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]> {
    const dateRange = new DateRange(new Date(startDate), new Date(endDate));
    return await this.salesRepository.findByDateRange(dateRange);
  }

 
  async getTotalByRegion(): Promise<RegionTotal[]> {
    const sales = await this.salesRepository.findAll();
    const regionMap = new Map<string, { total: number; cantidad: number }>();

   
    sales.forEach(sale => {
      const current = regionMap.get(sale.region) || { total: 0, cantidad: 0 };
      regionMap.set(sale.region, {
        total: current.total + sale.monto,
        cantidad: current.cantidad + 1
      });
    });

   
    const result: RegionTotal[] = [];
    regionMap.forEach((data, region) => {
      result.push(new RegionTotal(region, data.total, data.cantidad));
    });

    
    return result.sort((a, b) => b.total - a.total);
  }

 
  async getTopClient(): Promise<ClientTotal | null> {
    const sales = await this.salesRepository.findAll();
    
    if (sales.length === 0) {
      return null;
    }

    const clientMap = this.calculateClientTotals(sales);
    
    let topClient: ClientTotal | null = null;
    let maxTotal = 0;

    clientMap.forEach((data, cliente) => {
      if (data.total > maxTotal) {
        maxTotal = data.total;
        topClient = new ClientTotal(cliente, data.total, data.cantidad);
      }
    });

    return topClient;
  }


  async getAllClientsTotals(): Promise<ClientTotal[]> {
    const sales = await this.salesRepository.findAll();
    const clientMap = this.calculateClientTotals(sales);

    const result: ClientTotal[] = [];
    clientMap.forEach((data, cliente) => {
      result.push(new ClientTotal(cliente, data.total, data.cantidad));
    });


    return result.sort((a, b) => b.totalAcumulado - a.totalAcumulado);
  }


  async createSale(saleData: any): Promise<Sale> {
    const sale = Sale.fromJSON(saleData);
    await this.salesRepository.save(sale);
    return sale;
  }

  
  async getStatistics(): Promise<any> {
    const sales = await this.salesRepository.findAll();
    
    const totalMonto = sales.reduce((sum, sale) => sum + sale.monto, 0);
    const uniqueClients = new Set(sales.map(s => s.cliente)).size;
    const uniqueRegions = new Set(sales.map(s => s.region)).size;
    
    return {
      totalVentas: sales.length,
      totalMonto,
      promedioVenta: sales.length > 0 ? totalMonto / sales.length : 0,
      totalClientes: uniqueClients,
      totalRegiones: uniqueRegions
    };
  }

  /**
   * Método privado para calcular totales por cliente
   */
  private calculateClientTotals(sales: Sale[]): Map<string, { total: number; cantidad: number }> {
    const clientMap = new Map<string, { total: number; cantidad: number }>();

    sales.forEach(sale => {
      const current = clientMap.get(sale.cliente) || { total: 0, cantidad: 0 };
      clientMap.set(sale.cliente, {
        total: current.total + sale.monto,
        cantidad: current.cantidad + 1
      });
    });

    return clientMap;
  }
}
