import React from 'react';
import { Sale } from '../../domain/entities/Sale';
import './SalesTable.css';

interface SalesTableProps {
  sales: Sale[];
}

export const SalesTable: React.FC<SalesTableProps> = ({ sales }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (sales.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay ventas para mostrar</p>
      </div>
    );
  }

  return (
    <div className="sales-table-container">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Región</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={index}>
              <td>{sale.cliente}</td>
              <td className="amount-cell">{formatCurrency(sale.monto)}</td>
              <td>{formatDate(sale.fecha)}</td>
              <td>{sale.region}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="summary-cell">
              Total: {sales.length} venta(s) - 
              {formatCurrency(sales.reduce((sum, sale) => sum + sale.monto, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
