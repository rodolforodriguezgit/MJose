import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RegionTotal } from '../../domain/value-objects/ValueObjects';
import './RegionChart.css';

interface RegionChartProps {
  data: RegionTotal[];
}

export const RegionChart: React.FC<RegionChartProps> = ({ data }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      notation: 'compact',
      minimumFractionDigits: 0
    }).format(value);
  };

  const chartData = data.map(item => ({
    region: item.region,
    total: item.total,
    cantidad: item.cantidad
  }));

  if (chartData.length === 0) {
    return (
      <div className="chart-empty-state">
        <p>No hay datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="region-chart">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="region" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <Legend />
          <Bar dataKey="total" fill="#667eea" name="Total Ventas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
