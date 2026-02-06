export interface Sale {
  cliente: string;
  monto: number;
  fecha: string;
  region: string;
}

export class SaleEntity {
  constructor(
    public readonly cliente: string,
    public readonly monto: number,
    public readonly fecha: Date,
    public readonly region: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.cliente || this.cliente.trim().length === 0) {
      throw new Error('El cliente es requerido');
    }
    if (this.monto <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    if (!(this.fecha instanceof Date) || isNaN(this.fecha.getTime())) {
      throw new Error('La fecha es inválida');
    }
    if (!this.region || this.region.trim().length === 0) {
      throw new Error('La región es requerida');
    }
  }

  static fromDTO(dto: Sale): SaleEntity {
    return new SaleEntity(
      dto.cliente,
      dto.monto,
      new Date(dto.fecha),
      dto.region
    );
  }

  toDTO(): Sale {
    return {
      cliente: this.cliente,
      monto: this.monto,
      fecha: this.fecha.toISOString().split('T')[0],
      region: this.region
    };
  }
}
