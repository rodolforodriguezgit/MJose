export interface RegionTotal {
  region: string;
  total: number;
  cantidad: number;
}

export interface ClientTotal {
  cliente: string;
  totalAcumulado: number;
  cantidadCompras: number;
}

export interface Statistics {
  totalVentas: number;
  totalMonto: number;
  promedioVenta: number;
  totalClientes: number;
  totalRegiones: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export class DateRangeVO {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!(this.startDate instanceof Date) || isNaN(this.startDate.getTime())) {
      throw new Error('La fecha de inicio es inválida');
    }
    if (!(this.endDate instanceof Date) || isNaN(this.endDate.getTime())) {
      throw new Error('La fecha de fin es inválida');
    }
    if (this.startDate > this.endDate) {
      throw new Error('La fecha de inicio no puede ser mayor a la fecha de fin');
    }
  }

  contains(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate;
  }

  toQueryParams(): { startDate: string; endDate: string } {
    return {
      startDate: this.startDate.toISOString().split('T')[0],
      endDate: this.endDate.toISOString().split('T')[0]
    };
  }
}
