import { Sale } from '../../domain/entities/Sale';
import { DateRange } from '../../domain/value-objects/ValueObjects';
import { ISalesRepository } from '../../domain/interfaces/ISalesRepository';


export class InMemorySalesRepository implements ISalesRepository {
  private sales: Sale[] = [];

  constructor(initialData?: Sale[]) {
    if (initialData) {
      this.sales = [...initialData];
    }
  }

  async findAll(): Promise<Sale[]> {
  
    return Promise.resolve([...this.sales]);
  }

  async findByDateRange(dateRange: DateRange): Promise<Sale[]> {
    const filtered = this.sales.filter(sale =>
      dateRange.contains(sale.fecha)
    );
    return Promise.resolve([...filtered]);
  }

  async findByRegion(region: string): Promise<Sale[]> {
    const filtered = this.sales.filter(
      sale => sale.region.toLowerCase() === region.toLowerCase()
    );
    return Promise.resolve([...filtered]);
  }

  async save(sale: Sale): Promise<void> {
    this.sales.push(sale);
    return Promise.resolve();
  }

  async saveMany(sales: Sale[]): Promise<void> {
    this.sales.push(...sales);
    return Promise.resolve();
  }


  clear(): void {
    this.sales = [];
  }


  size(): number {
    return this.sales.length;
  }
}
