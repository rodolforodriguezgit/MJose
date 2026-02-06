import { Sale } from '../entities/Sale';
import { DateRange } from '../value-objects/ValueObjects';


export interface ISalesRepository {

  findAll(): Promise<Sale[]>;


  findByDateRange(dateRange: DateRange): Promise<Sale[]>;


  findByRegion(region: string): Promise<Sale[]>;


  save(sale: Sale): Promise<void>;

 
  saveMany(sales: Sale[]): Promise<void>;
}
