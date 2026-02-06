import { useState, useEffect, useCallback } from 'react';
import { SalesService } from '../../application/services/SalesService';
import { Sale } from '../../domain/entities/Sale';
import { RegionTotal, ClientTotal, Statistics } from '../../domain/value-objects/ValueObjects';

interface UseSalesReturn {
  sales: Sale[];
  regionTotals: RegionTotal[];
  topClient: ClientTotal | null;
  statistics: Statistics | null;
  loading: boolean;
  error: string | null;
  fetchSales: () => Promise<void>;
  fetchSalesByDateRange: (startDate: Date, endDate: Date) => Promise<void>;
  fetchRegionTotals: () => Promise<void>;
  fetchTopClient: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
}

export const useSales = (salesService: SalesService): UseSalesReturn => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [regionTotals, setRegionTotals] = useState<RegionTotal[]>([]);
  const [topClient, setTopClient] = useState<ClientTotal | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await salesService.getAllSales();
      setSales(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  }, [salesService]);

  const fetchSalesByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await salesService.getSalesByDateRange(startDate, endDate);
      setSales(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al filtrar ventas');
    } finally {
      setLoading(false);
    }
  }, [salesService]);

  const fetchRegionTotals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await salesService.getTotalByRegion();
      setRegionTotals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar totales por región');
    } finally {
      setLoading(false);
    }
  }, [salesService]);

  const fetchTopClient = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await salesService.getTopClient();
      setTopClient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar cliente top');
    } finally {
      setLoading(false);
    }
  }, [salesService]);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await salesService.getStatistics();
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }, [salesService]);

  useEffect(() => {
    // Cargar datos iniciales solo una vez al montar
    const loadInitialData = async () => {
      await Promise.all([
        fetchSales(),
        fetchRegionTotals(),
        fetchTopClient(),
        fetchStatistics()
      ]);
    };
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío para ejecutar solo una vez

  return {
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
  };
};
