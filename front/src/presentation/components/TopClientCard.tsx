import React from 'react';
import { ClientTotal } from '../../domain/value-objects/ValueObjects';
import './TopClientCard.css';

interface TopClientCardProps {
  topClient: ClientTotal | null;
}

export const TopClientCard: React.FC<TopClientCardProps> = ({ topClient }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!topClient) {
    return (
      <div className="top-client-card">
        <h3>🏆 Cliente Top</h3>
        <div className="empty-state">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="top-client-card">
      <h3>🏆 Cliente Top</h3>
      <div className="client-info">
        <div className="client-name">{topClient.cliente}</div>
        <div className="client-stats">
          <div className="stat-item">
            <span className="stat-label">Total Acumulado:</span>
            <span className="stat-value">{formatCurrency(topClient.totalAcumulado)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Cantidad de Compras:</span>
            <span className="stat-value">{topClient.cantidadCompras}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Promedio por Compra:</span>
            <span className="stat-value">
              {formatCurrency(topClient.totalAcumulado / topClient.cantidadCompras)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
