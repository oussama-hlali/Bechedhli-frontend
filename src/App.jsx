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
import { employeesApi, stockApi, clientsApi, blsApi, stegApi, facturesApi, businessApi } from './api';

function useUrlParams() {
  const getParams = () => new URLSearchParams(window.location.search);
  const setParams = (params) => {
    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  };
  return { getParams, setParams };
}

export default function App() {
  const { getParams, setParams } = useUrlParams();
  const [activeView, setActiveViewState] = useState(() => getParams().get('view') || 'dashboard');
  const [employees, setEmployees] = useState([]);
  const [stock, setStock] = useState([]);
  const [clients, setClients] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bls, setBls] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [factures, setFactures] = useState([]);
  const [prefillInvoice, setPrefillInvoice] = useState(null);

  const setActiveView = useCallback((view) => {
    setActiveViewState(view);
    const p = getParams();
    if (view === 'dashboard') p.delete('view');
    else p.set('view', view);
    p.delete('modal');
    setParams(p);
  }, [getParams, setParams]);

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

  useEffect(() => {
    const onPop = () => {
      const view = getParams().get('view') || 'dashboard';
      setActiveViewState(view);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [getParams]);

  const handleDeliverBL = useCallback(async (bl) => {
    try {
      const delivered = await businessApi.deliverBL(bl.id);
      setBls(prev => prev.map(b => b.id === bl.id ? { ...b, ...delivered, items: delivered.items || [] } : b));
      const updatedStock = await stockApi.getAll();
      setStock(updatedStock);
      addToast(`${bl.id} livré — stock ajusté automatiquement`);
    } catch (err) {
      addToast(`Erreur: ${err.message}`, 'error');
    }
  }, [addToast]);

  const handleGenerateInvoice = useCallback(async (bl) => {
    try {
      const invoice = await businessApi.generateInvoiceFromBL(bl.id);
      setFactures(prev => [...prev, { ...invoice, items: invoice.items || [], payments: invoice.payments || [] }]);
      setBls(prev => prev.map(b => b.id === bl.id ? { ...b, invoiced: true } : b));
      addToast(`Facture ${invoice.id} générée depuis ${bl.id}`);
    } catch (err) {
      addToast(`Erreur: ${err.message}`, 'error');
    }
  }, [addToast]);

  const handleFacturer = useCallback((clientId, dossierId) => {
    setPrefillInvoice({ clientId, dossierId });
    setActiveView('facturation');
  }, [setActiveView]);

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
