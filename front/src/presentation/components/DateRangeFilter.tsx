import React, { useState, useEffect, useRef } from 'react';
import './DateRangeFilter.css';

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (startDate: Date | null, endDate: Date | null) => void;
  onClear: () => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onChange,
  onClear
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ajustar posición del dropdown si se sale de la pantalla
  useEffect(() => {
    if (isOpen && containerRef.current && dropdownRef.current) {
      const container = containerRef.current;
      const dropdown = dropdownRef.current;
      const rect = container.getBoundingClientRect();
      const dropdownWidth = dropdown.offsetWidth;
      const viewportWidth = window.innerWidth;
      
      // Si el dropdown se sale por la derecha, ajustar posición
      if (rect.left + dropdownWidth > viewportWidth) {
        const overflow = (rect.left + dropdownWidth) - viewportWidth;
        dropdown.style.left = `-${overflow + 10}px`;
      } else {
        dropdown.style.left = '0';
      }
    }
  }, [isOpen]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', () => setIsOpen(false));
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', () => setIsOpen(false));
    };
  }, [isOpen]);

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    if (date && endDate && date > endDate) {
      // Si la fecha inicio es mayor que la fin, actualizar también la fin
      onChange(date, date);
    } else {
      onChange(date, endDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    if (date && startDate && date < startDate) {
      // Si la fecha fin es menor que la inicio, actualizar también la inicio
      onChange(date, date);
    } else {
      onChange(startDate, date);
    }
  };

  const handleClear = () => {
    onChange(null, null);
    setIsOpen(false);
    onClear();
  };

  const getDisplayText = (): string => {
    if (startDate && endDate) {
      if (startDate.getTime() === endDate.getTime()) {
        return formatDateForDisplay(startDate);
      }
      return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`;
    }
    if (startDate) {
      return `Desde: ${formatDateForDisplay(startDate)}`;
    }
    if (endDate) {
      return `Hasta: ${formatDateForDisplay(endDate)}`;
    }
    return 'Seleccionar rango de fechas';
  };

  return (
    <div className="date-range-filter-container" ref={containerRef}>
      <div 
        className="date-range-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="calendar-icon">📅</span>
        <span className="date-range-display">{getDisplayText()}</span>
        {(startDate || endDate) && (
          <button 
            className="clear-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            title="Limpiar"
          >
            ✕
          </button>
        )}
        <span className="arrow-icon">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="date-range-picker-dropdown" ref={dropdownRef}>
          <div className="date-range-inputs">
            <div className="date-input-group">
              <label htmlFor="startDate">Fecha Inicio</label>
              <input
                id="startDate"
                type="date"
                value={formatDateForInput(startDate)}
                onChange={handleStartDateChange}
                max={formatDateForInput(endDate)}
                className="date-input"
              />
            </div>
            
            <div className="date-separator">→</div>
            
            <div className="date-input-group">
              <label htmlFor="endDate">Fecha Fin</label>
              <input
                id="endDate"
                type="date"
                value={formatDateForInput(endDate)}
                onChange={handleEndDateChange}
                min={formatDateForInput(startDate)}
                className="date-input"
              />
            </div>
          </div>

          <div className="date-range-actions">
            <button onClick={handleClear} className="clear-button">
              Limpiar
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="apply-button"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
