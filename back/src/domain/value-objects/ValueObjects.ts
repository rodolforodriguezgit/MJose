
export class DateRange {
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

  toString(): string {
    return `${this.startDate.toISOString().split('T')[0]} - ${this.endDate.toISOString().split('T')[0]}`;
  }
}


export class RegionTotal {
  constructor(
    public readonly region: string,
    public readonly total: number,
    public readonly cantidad: number = 0
  ) {}

  toJSON(): any {
    return {
      region: this.region,
      total: this.total,
      cantidad: this.cantidad
    };
  }
}


export class ClientTotal {
  constructor(
    public readonly cliente: string,
    public readonly totalAcumulado: number,
    public readonly cantidadCompras: number = 0
  ) {}

  toJSON(): any {
    return {
      cliente: this.cliente,
      totalAcumulado: this.totalAcumulado,
      cantidadCompras: this.cantidadCompras
    };
  }
}
