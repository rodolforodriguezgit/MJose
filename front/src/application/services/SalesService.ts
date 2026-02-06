import { ISalesRepository } from '../../domain/interfaces/ISalesRepository';
import { Sale } from '../../domain/entities/Sale';
import { RegionTotal, ClientTotal, Statistics, DateRangeVO } from '../../domain/value-objects/ValueObjects';

export class SalesService {
  constructor(private readonly salesRepository: ISalesRepository) {}

  async getAllSales(): Promise<Sale[]> {
    return await this.salesRepository.getAllSales();
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    const dateRange = new DateRangeVO(startDate, endDate);
    return await this.salesRepository.getSalesByDateRange(dateRange);
  }

  async getTotalByRegion(): Promise<RegionTotal[]> {
    return await this.salesRepository.getTotalByRegion();
  }

  async getTopClient(): Promise<ClientTotal | null> {
    return await this.salesRepository.getTopClient();
  }

  async getAllClientsTotals(): Promise<ClientTotal[]> {
    return await this.salesRepository.getAllClientsTotals();
  }

  async getStatistics(): Promise<Statistics> {
    return await this.salesRepository.getStatistics();
  }
}
