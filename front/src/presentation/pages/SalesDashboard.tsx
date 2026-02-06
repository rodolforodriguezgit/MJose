import React, { useState } from 'react';
import { SalesService } from '../../application/services/SalesService';
import { SalesRepository } from '../../infrastructure/repositories/SalesRepository';
import { ApiClient } from '../../infrastructure/http/ApiClient';
import { useSales } from '../hooks/useSales';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { SalesTable } from '../components/SalesTable';
import { RegionChart } from '../components/RegionChart';
import { StatisticsCards } from '../components/StatisticsCards';
import { TopClientCard } from '../components/TopClientCard';
import './SalesDashboard.css';

const apiClient = new ApiClient();
const salesRepository = new SalesRepository(apiClient);
const salesService = new SalesService(salesRepository);

export const SalesDashboard: React.FC = () => {
  const {
    sales,
    regionTotals,
    topClient,
    statistics,
    loading,
    error,
    fetchSales,
    fetchSalesByDateRange,
    fetchRegionTotals,
    fetchTopClient,
    fetchStatistics
  } = useSales(salesService);

  const [dateFilter, setDateFilter] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null
  });

  const handleDateFilterChange = async (startDate: Date | null, endDate: Date | null) => {
    setDateFilter({ startDate, endDate });
    
    if (startDate && endDate) {
      await fetchSalesByDateRange(startDate, endDate);
      await fetchRegionTotals();
      await fetchTopClient();
      await fetchStatistics();
    } else {
      await fetchSales();
      await fetchRegionTotals();
      await fetchTopClient();
      await fetchStatistics();
    }
  };

  const handleClearFilter = async () => {
    setDateFilter({ startDate: null, endDate: null });
    await fetchSales();
    await fetchRegionTotals();
    await fetchTopClient();
    await fetchStatistics();
  };

  return (
    <div className="sales-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard de Ventas</h2>
        <DateRangeFilter
          startDate={dateFilter.startDate}
          endDate={dateFilter.endDate}
          onChange={handleDateFilterChange}
          onClear={handleClearFilter}
        />
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {loading && (
        <div className="loading-message">
          <span>🔄 Cargando datos...</span>
        </div>
      )}

      {!loading && !error && (
        <>
          <StatisticsCards statistics={statistics} />
          
          <div className="dashboard-grid">
            <div className="dashboard-section">
              <TopClientCard topClient={topClient} />
            </div>
            
            <div className="dashboard-section chart-section">
              <h3>Ventas por Región</h3>
              <RegionChart data={regionTotals} />
            </div>
          </div>

          <div className="dashboard-section">
            <h3>Listado de Ventas</h3>
            <SalesTable sales={sales} />
          </div>
        </>
      )}
    </div>
  );
};
