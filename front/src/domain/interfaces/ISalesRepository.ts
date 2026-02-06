import { Sale } from '../entities/Sale';
import { RegionTotal, ClientTotal, Statistics, DateRangeVO } from '../value-objects/ValueObjects';

export interface ISalesRepository {
  getAllSales(): Promise<Sale[]>;
  getSalesByDateRange(dateRange: DateRangeVO): Promise<Sale[]>;
  getTotalByRegion(): Promise<RegionTotal[]>;
  getTopClient(): Promise<ClientTotal | null>;
  getAllClientsTotals(): Promise<ClientTotal[]>;
  getStatistics(): Promise<Statistics>;
}
