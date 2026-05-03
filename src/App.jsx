import { useState, useEffect, useCallback } from 'react';
import './index.css';
import { INITIAL_EMPLOYEES, INITIAL_STOCK, INITIAL_CLIENTS } from './data';
import Loader from './components/Loader';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ToastContainer from './components/ToastContainer';
import DashboardView from './views/DashboardView';
import EmployeesView from './views/EmployeesView';
import StockView from './views/StockView';
import ClientsView from './views/ClientsView';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, 3000);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="bg-mesh" />
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main style={{ flex: 1, marginLeft: 260, position: 'relative', zIndex: 1, height: '100vh', overflowY: 'auto' }}>
        <Header activeView={activeView} />
        <div style={{ padding: '28px 32px 40px' }} key={activeView}>
          {activeView === 'dashboard' && <DashboardView employees={employees} stock={stock} clients={clients} />}
          {activeView === 'employees' && <EmployeesView employees={employees} setEmployees={setEmployees} addToast={addToast} />}
          {activeView === 'stock' && <StockView stock={stock} setStock={setStock} addToast={addToast} />}
          {activeView === 'clients' && <ClientsView clients={clients} setClients={setClients} addToast={addToast} />}
        </div>
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
