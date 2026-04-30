import { useState } from 'react';
import { Users, Warehouse, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import StatCard from './components/Dashboard/StatCard';
import RevenueChart from './components/Dashboard/RevenueChart';
import StockDoughnut from './components/Dashboard/StockDoughnut';
import RecentActivity from './components/Dashboard/RecentActivity';
import TopProducts from './components/Dashboard/TopProducts';
import EmployeeTable from './components/Employees/EmployeeTable';
import StockTable from './components/Stock/StockTable';
import { INITIAL_EMPLOYEES } from './data/employees';
import { INITIAL_STOCK } from './data/stock';
import { ToastProvider } from './context/ToastContext';

function DashboardView({ employees, stock }) {
  const stats = [
    { label: 'Employés Actifs', value: employees.filter(e => e.status === 'active').length, suffix: `/${employees.length}`, icon: Users, color: '#F97316', trend: '+2 ce mois', trendUp: true },
    { label: 'Valeur du Stock', value: (stock.reduce((s, i) => s + i.qty * i.price, 0) / 1000000).toFixed(1), suffix: 'M DA', icon: Warehouse, color: '#3B82F6', trend: '+12% vs trim. préc.', trendUp: true },
    { label: 'Alertes Stock', value: stock.filter(i => { const s = i.qty === 0 ? 'empty' : i.qty <= i.minQty ? 'low' : 'normal'; return s === 'low' || s === 'empty'; }).length, suffix: 'produits', icon: AlertTriangle, color: '#EF4444', trend: 'Nécessite action', trendUp: false },
    { label: 'Masse Salariale', value: (employees.filter(e => e.status === 'active').reduce((s, e) => s + e.salary, 0) / 1000000).toFixed(1), suffix: 'M DA/mois', icon: DollarSign, color: '#10B981', trend: 'Budget stable', trendUp: true },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Tableau de Bord</h1>
        <p className="text-sm" style={{ color: '#64748B' }}>Vue d'ensemble de l'activité Bechedhli Solar Energy</p>
      </div>
      <div className="grid gap-4 mb-7" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.1} />)}
      </div>
      <div className="grid gap-4 mb-7" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <RevenueChart />
        <StockDoughnut stock={stock} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <RecentActivity />
        <TopProducts stock={stock} />
      </div>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [stock, setStock] = useState(INITIAL_STOCK);

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <div className="bg-mesh fixed inset-0 z-0 pointer-events-none" />
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 relative z-[1] h-screen overflow-y-auto" style={{ marginLeft: 260 }}>
          <Header activeView={activeView} />
          <div className="px-8 py-7" key={activeView}>
            {activeView === 'dashboard' && <DashboardView employees={employees} stock={stock} />}
            {activeView === 'employees' && <EmployeeTable employees={employees} setEmployees={setEmployees} />}
            {activeView === 'stock' && <StockTable stock={stock} setStock={setStock} />}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}