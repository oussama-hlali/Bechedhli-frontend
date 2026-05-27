import { useState, useEffect, useCallback } from 'react';
import './index.css';
import Loader from './components/Loader';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ToastContainer from './components/ToastContainer';
import DashboardView from './views/DashboardView';
import EmployeesView from './views/EmployeesView';
import StockView from './views/StockView';
import ClientsView from './views/ClientsView';
import LivraisonView from './views/LivraisonView';
import StegView from './views/StegView';
import FacturationView from './views/FacturationView';
import { employeesApi, stockApi, clientsApi, blsApi, stegApi, facturesApi } from './api';
import { matchBLtoStock, applyStockMutations, createInvoiceFromBL } from './data';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [stock, setStock] = useState([]);
  const [clients, setClients] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bls, setBls] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [factures, setFactures] = useState([]);
  const [prefillInvoice, setPrefillInvoice] = useState(null);
  const [nextFactureNum, setNextFactureNum] = useState(5);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, 3000);
  }, []);

  useEffect(() => {
    Promise.all([
      employeesApi.getAll(),
      stockApi.getAll(),
      clientsApi.getAll(),
      blsApi.getAll(),
      stegApi.getAll(),
      facturesApi.getAll(),
    ])
      .then(([emps, stk, clts, b, d, f]) => {
        setEmployees(emps);
        setStock(stk);
        setClients(clts.map(c => ({ ...c, orders: c.orders || [] })));
        setBls(b.map(bl => ({ ...bl, items: bl.items || [] })));
        setDossiers(d);
        setFactures(f.map(fac => ({ ...fac, items: fac.items || [], payments: fac.payments || [] })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDeliverBL = useCallback((bl) => {
    const mutations = matchBLtoStock(bl.items, stock);
    if (mutations.length > 0) {
      setStock(prev => applyStockMutations(prev, mutations));
      const detail = mutations.map(m => `${m.name} (-${m.decrement})`).join(', ');
      addToast(`Stock mis à jour: ${detail}`, 'success');
    }
    setBls(prev => prev.map(b => b.id === bl.id ? { ...b, status: 'delivered' } : b));
    addToast(`${bl.id} livré — stock ajusté automatiquement`);
  }, [stock, addToast]);

  const handleGenerateInvoice = useCallback((bl) => {
    const invoice = createInvoiceFromBL(bl, null, nextFactureNum);
    setFactures(prev => [...prev, invoice]);
    setBls(prev => prev.map(b => b.id === bl.id ? { ...b, invoiced: true } : b));
    setNextFactureNum(n => n + 1);
    addToast(`Facture ${invoice.id} générée depuis ${bl.id}`);
  }, [nextFactureNum, addToast]);

  const handleFacturer = useCallback((clientId, dossierId) => {
    setPrefillInvoice({ clientId, dossierId });
    setActiveView('facturation');
  }, []);

  if (loading) return <Loader />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="bg-mesh" />
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main style={{ flex: 1, marginLeft: 260, position: 'relative', zIndex: 1, height: '100vh', overflowY: 'auto' }}>
        <Header activeView={activeView} stock={stock} onNavigate={setActiveView} />
        <div style={{ padding: '28px 32px 40px' }} key={activeView}>
          {activeView === 'dashboard' && <DashboardView employees={employees} stock={stock} clients={clients} bls={bls} dossiers={dossiers} factures={factures} />}
          {activeView === 'employees' && <EmployeesView employees={employees} setEmployees={setEmployees} addToast={addToast} />}
          {activeView === 'stock' && <StockView stock={stock} setStock={setStock} addToast={addToast} />}
          {activeView === 'clients' && <ClientsView clients={clients} setClients={setClients} addToast={addToast} />}
          {activeView === 'livraison' && <LivraisonView bls={bls} setBls={setBls} clients={clients} stock={stock} addToast={addToast} onDeliverBL={handleDeliverBL} onGenerateInvoice={handleGenerateInvoice} />}
          {activeView === 'steg' && <StegView dossiers={dossiers} setDossiers={setDossiers} clients={clients} addToast={addToast} onFacturer={handleFacturer} />}
          {activeView === 'facturation' && <FacturationView factures={factures} setFactures={setFactures} clients={clients} dossiers={dossiers} addToast={addToast} prefillInvoice={prefillInvoice} onClearPrefill={() => setPrefillInvoice(null)} />}
        </div>
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
