import { ISalesRepository } from '../../domain/interfaces/ISalesRepository';
import { Sale } from '../../domain/entities/Sale';
import { RegionTotal, ClientTotal, Statistics, DateRangeVO } from '../../domain/value-objects/ValueObjects';
import { ApiClient } from '../http/ApiClient';

export class SalesRepository implements ISalesRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async getAllSales(): Promise<Sale[]> {
    return await this.apiClient.get<Sale[]>('/sales');
  }

  async getSalesByDateRange(dateRange: DateRangeVO): Promise<Sale[]> {
    const params = dateRange.toQueryParams();
    return await this.apiClient.get<Sale[]>(
      `/sales/date-range?startDate=${params.startDate}&endDate=${params.endDate}`
    );
  }

  async getTotalByRegion(): Promise<RegionTotal[]> {
    return await this.apiClient.get<RegionTotal[]>('/sales/total-by-region');
  }

  async getTopClient(): Promise<ClientTotal | null> {
    return await this.apiClient.get<ClientTotal | null>('/sales/top-client');
  }

  async getAllClientsTotals(): Promise<ClientTotal[]> {
    return await this.apiClient.get<ClientTotal[]>('/sales/clients-totals');
  }

  async getStatistics(): Promise<Statistics> {
    return await this.apiClient.get<Statistics>('/sales/statistics');
  }
}
