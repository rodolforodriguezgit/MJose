
export interface DateRangeDTO {
  startDate: string;
  endDate: string;
}

export interface SaleDTO {
  cliente: string;
  monto: number;
  fecha: string;
  region: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}


export class DateRangeValidator {
  static validate(dto: DateRangeDTO): string[] {
    const errors: string[] = [];

    if (!dto.startDate) {
      errors.push('startDate es requerido');
    } else if (isNaN(Date.parse(dto.startDate))) {
      errors.push('startDate debe ser una fecha válida (formato: YYYY-MM-DD)');
    }

    if (!dto.endDate) {
      errors.push('endDate es requerido');
    } else if (isNaN(Date.parse(dto.endDate))) {
      errors.push('endDate debe ser una fecha válida (formato: YYYY-MM-DD)');
    }

    if (errors.length === 0) {
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
      if (start > end) {
        errors.push('startDate no puede ser mayor que endDate');
      }
    }

    return errors;
  }
}


export class SaleValidator {
  static validate(dto: any): string[] {
    const errors: string[] = [];


    if (!dto.cliente) {
      errors.push('cliente es requerido');
    } else if (typeof dto.cliente !== 'string') {
      errors.push('cliente debe ser un string');
    } else if (dto.cliente.trim().length === 0) {
      errors.push('cliente no puede estar vacío');
    } else if (dto.cliente.length > 100) {
      errors.push('cliente no puede exceder 100 caracteres');
    }


    if (dto.monto === undefined || dto.monto === null) {
      errors.push('monto es requerido');
    } else if (typeof dto.monto !== 'number') {
      errors.push('monto debe ser un número');
    } else if (dto.monto <= 0) {
      errors.push('monto debe ser mayor a 0');
    } else if (dto.monto > 999999999) {
      errors.push('monto excede el límite permitido');
    }

  
    if (!dto.fecha) {
      errors.push('fecha es requerida');
    } else if (isNaN(Date.parse(dto.fecha))) {
      errors.push('fecha debe ser una fecha válida (formato: YYYY-MM-DD)');
    }


    if (!dto.region) {
      errors.push('region es requerida');
    } else if (typeof dto.region !== 'string') {
      errors.push('region debe ser un string');
    } else if (dto.region.trim().length === 0) {
      errors.push('region no puede estar vacía');
    } else if (dto.region.length > 50) {
      errors.push('region no puede exceder 50 caracteres');
    }

    return errors;
  }

  static isValid(dto: any): boolean {
    return this.validate(dto).length === 0;
  }
}
