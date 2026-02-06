import React from 'react';
import { Statistics } from '../../domain/value-objects/ValueObjects';
import './StatisticsCards.css';

interface StatisticsCardsProps {
  statistics: Statistics | null;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!statistics) {
    return null;
  }

  const cards = [
    {
      title: 'Total Ventas',
      value: statistics.totalVentas,
      icon: '📊',
      color: '#667eea'
    },
    {
      title: 'Monto Total',
      value: formatCurrency(statistics.totalMonto),
      icon: '💰',
      color: '#2e7d32'
    },
    {
      title: 'Promedio Venta',
      value: formatCurrency(statistics.promedioVenta),
      icon: '📈',
      color: '#f57c00'
    },
    {
      title: 'Total Clientes',
      value: statistics.totalClientes,
      icon: '👥',
      color: '#7b1fa2'
    },
    {
      title: 'Regiones',
      value: statistics.totalRegiones,
      icon: '🌍',
      color: '#0288d1'
    }
  ];

  return (
    <div className="statistics-cards">
      {cards.map((card, index) => (
        <div key={index} className="stat-card" style={{ borderTopColor: card.color }}>
          <div className="stat-icon">{card.icon}</div>
          <div className="stat-content">
            <div className="stat-title">{card.title}</div>
            <div className="stat-value">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
