import React from 'react';
import { SalesDashboard } from './pages/SalesDashboard';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 Sales Data Lake Dashboard</h1>
        <p>Sistema de consulta y análisis de ventas</p>
      </header>
      <main className="app-main">
        <SalesDashboard />
      </main>
    </div>
  );
};

export default App;
