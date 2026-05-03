import { useState, useMemo } from 'react';
import { Modal, ConfirmModal, ActionBtn } from '../components/Modal';
import { COMPONENT_CATALOG, getClientStats, formatDA } from '../data';

const LBL = { fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' };

export default function ClientsView({ clients, setClients, addToast }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [markOpen, setMarkOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [clientForm, setClientForm] = useState({ name: '', cin: '', phone: '', address: '' });
  const [orderLines, setOrderLines] = useState([{ component: '', qty: 1 }]);

  const filtered = useMemo(() => clients.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.cin.includes(search)) return false;
    if (statusFilter === 'pending' && c.orders.every(o => o.received)) return false;
    if (statusFilter === 'received' && c.orders.some(o => !o.received)) return false;
    return true;
  }), [clients, search, statusFilter]);

  const globalStats = useMemo(() => {
    const all = clients.flatMap(c => c.orders);
    return { totalClients: clients.length, totalOrders: all.length, received: all.filter(o => o.received).length, pending: all.filter(o => !o.received).length };
  }, [clients]);

  const openAddClient = () => { setEditing(null); setClientForm({ name: '', cin: '', phone: '', address: '' }); setFormOpen(true); };
  const openEditClient = (c) => { setEditing(c); setClientForm({ name: c.name, cin: c.cin, phone: c.phone, address: c.address }); setFormOpen(true); };
  const openDetail = (c) => { setSelected(c); setDetailOpen(true); };

  const handleSaveClient = () => {
    if (!clientForm.name || !clientForm.cin) { addToast('Le nom et le N° CIN sont obligatoires', 'error'); return; }
    if (clientForm.cin.length < 10) { addToast('Le N° CIN doit contenir au moins 10 caractères', 'error'); return; }
    if (editing) {
      setClients(prev => prev.map(c => c.id === editing.id ? { ...c, ...clientForm } : c));
      addToast(`${clientForm.name} mis à jour`, 'success');
    } else {
      setClients(prev => [...prev, { ...clientForm, id: Date.now(), orders: [], createdAt: new Date().toISOString().split('T')[0] }]);
      addToast(`${clientForm.name} ajouté avec succès`, 'success');
    }
    setFormOpen(false);
  };

  const handleDeleteClient = () => {
    setClients(prev => prev.filter(c => c.id !== selected.id));
    addToast(`${selected.name} supprimé`, 'success');
    setDeleteOpen(false); setSelected(null); setDetailOpen(false);
  };

  const handleNewOrder = () => {
    const validLines = orderLines.filter(l => l.component && l.qty > 0);
    if (validLines.length === 0) { addToast('Ajoutez au moins un composant', 'error'); return; }
    const items = validLines.map(l => `${l.component} x${l.qty}`);
    const total = validLines.reduce((s, l) => {
      const cat = COMPONENT_CATALOG.find(c => c.label === l.component);
      return s + (cat ? cat.price * Number(l.qty) : 0);
    }, 0);
    const newOrder = { id: Date.now(), items, total, received: false, receivedDate: null, orderDate: new Date().toISOString().split('T')[0] };
    const updated = { ...selected, orders: [...selected.orders, newOrder] };
    setClients(prev => prev.map(c => c.id === selected.id ? updated : c));
    setSelected(updated);
    setOrderFormOpen(false);
    setOrderLines([{ component: '', qty: 1 }]);
    addToast('Commande ajoutée avec succès', 'success');
  };

  const handleMarkReceived = () => {
    if (!selectedOrder) return;
    const updatedOrders = selected.orders.map(o => o.id === selectedOrder.id ? { ...o, received: true, receivedDate: new Date().toISOString().split('T')[0] } : o);
    const updated = { ...selected, orders: updatedOrders };
    setClients(prev => prev.map(c => c.id === selected.id ? updated : c));
    setSelected(updated);
    setMarkOpen(false); setSelectedOrder(null);
    addToast('Commande marquée comme reçue', 'success');
  };

  const handleDeleteOrder = (orderId) => {
    const updatedOrders = selected.orders.filter(o => o.id !== orderId);
    const updated = { ...selected, orders: updatedOrders };
    setClients(prev => prev.map(c => c.id === selected.id ? updated : c));
    setSelected(updated);
    addToast('Commande supprimée', 'success');
  };

  const orderTotal = useMemo(() =>
    orderLines.reduce((s, l) => {
      const cat = COMPONENT_CATALOG.find(c => c.label === l.component);
      return s + (cat ? cat.price * Number(l.qty) : 0);
    }, 0), [orderLines]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Suivi Clients</h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14 }}>{clients.length} clients — {globalStats.totalOrders} commandes — {globalStats.pending} en attente</p>
        </div>
        <button className="btn-primary" onClick={openAddClient}><i className="fa-solid fa-plus" />Nouveau Client</button>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Clients', value: globalStats.totalClients, icon: 'fa-user', color: '#F97316' },
          { label: 'Commandes', value: globalStats.totalOrders, icon: 'fa-shopping-bag', color: '#3B82F6' },
          { label: 'Reçues', value: globalStats.received, icon: 'fa-circle-check', color: '#10B981' },
          { label: 'En attente', value: globalStats.pending, icon: 'fa-clock', color: '#F59E0B' },
        ].map((s, i) => (
          <div key={i} className="glass-card animate-slide-up" style={{ padding: '18px 20px', animationDelay: `${i * 0.08}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--fg-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</p>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: 15 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13 }} />
          <input className="input-field" placeholder="Rechercher par nom ou N° CIN..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <select className="input-field" style={{ width: 'auto', minWidth: 200 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="received">Commandes toutes reçues</option>
          <option value="pending">Commandes en attente</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th><th>N° CIN</th><th>Commandes</th><th>Réception</th>
                <th>Total Dépensé</th><th>Dernière Commande</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--fg-muted)' }}>Aucun client trouvé</td></tr>
                : filtered.map((client, i) => {
                  const st = getClientStats(client.orders);
                  const allRcv = st.pending === 0;
                  const last = client.orders[client.orders.length - 1];
                  return (
                    <tr key={client.id} onClick={() => openDetail(client)} style={{ animation: `slideUp 0.3s ease-out ${i * 0.03}s both` }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="avatar" style={{ background: 'rgba(249,115,22,0.12)' }}>
                            <i className="fa-solid fa-user" style={{ color: '#F97316', fontSize: 14 }} />
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>{client.name}</p>
                            <p style={{ fontSize: 12, color: 'var(--fg-muted)', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.address}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, fontWeight: 500, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: '#94A3B8' }}>{client.cin}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{st.totalOrders}</span>
                        <span style={{ fontSize: 12, color: 'var(--fg-muted)', marginLeft: 4 }}>cmd</span>
                      </td>
                      <td>
                        {allRcv
                          ? <span className="badge badge-received"><i className="fa-solid fa-circle-check" style={{ fontSize: 10 }} />{st.received}/{st.totalOrders}</span>
                          : <span className="badge badge-pending"><i className="fa-solid fa-clock" style={{ fontSize: 10 }} />{st.received}/{st.totalOrders}</span>}
                      </td>
                      <td><span style={{ fontWeight: 700, fontSize: 13, color: '#F97316' }}>{formatDA(st.totalSpent)}</span></td>
                      <td>
                        {last ? (
                          <div>
                            <p style={{ fontSize: 13, color: '#94A3B8' }}>{new Date(last.orderDate).toLocaleDateString('fr-FR')}</p>
                            <p style={{ fontSize: 11, marginTop: 2, color: last.received ? '#10B981' : '#F59E0B' }}>{last.received ? 'Reçue' : 'En attente'}</p>
                          </div>
                        ) : <span style={{ color: 'var(--fg-muted)', fontSize: 13 }}>—</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                          <ActionBtn icon="fa-eye" onClick={() => openDetail(client)} hoverColor="#F97316" label="Voir détails" />
                          <ActionBtn icon="fa-pen" onClick={() => openEditClient(client)} hoverColor="#3B82F6" label="Modifier" />
                          <ActionBtn icon="fa-trash" onClick={() => { setSelected(client); setDeleteOpen(true); }} hoverColor="#EF4444" label="Supprimer" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add/Edit Client */}
      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Modifier le Client' : 'Nouveau Client'} width={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={LBL}>Nom complet / Raison sociale *</label><input className="input-field" value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })} placeholder="Ex: Mohamed Benmerzoug" /></div>
          <div><label style={LBL}>N° CIN (ou NIF pour sociétés) *</label><input className="input-field" value={clientForm.cin} onChange={e => setClientForm({ ...clientForm, cin: e.target.value })} placeholder="Ex: 123456789012" maxLength={18} /></div>
          <div><label style={LBL}>Téléphone</label><input className="input-field" value={clientForm.phone} onChange={e => setClientForm({ ...clientForm, phone: e.target.value })} placeholder="+213 555 000 000" /></div>
          <div><label style={LBL}>Adresse</label><input className="input-field" value={clientForm.address} onChange={e => setClientForm({ ...clientForm, address: e.target.value })} placeholder="Ex: Cité 1000 Logements, Ouargla" /></div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn-secondary" onClick={() => setFormOpen(false)}>Annuler</button>
            <button className="btn-primary" onClick={handleSaveClient}>{editing ? 'Enregistrer' : 'Ajouter'}</button>
          </div>
        </div>
      </Modal>

      {/* Modal: Client Detail + Orders */}
      <Modal isOpen={detailOpen} onClose={() => { setDetailOpen(false); setSelected(null); }} title="Fiche Client & Suivi Commandes" width={780}>
        {selected && (() => {
          const c = selected;
          const st = getClientStats(c.orders);
          return (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 14 }}>
                <div className="avatar" style={{ width: 56, height: 56, background: 'rgba(249,115,22,0.15)' }}>
                  <i className="fa-solid fa-user" style={{ color: '#F97316', fontSize: 20 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: 18, fontWeight: 700 }}>{c.name}</h4>
                  <p style={{ fontSize: 13, color: 'var(--fg-muted)' }}>CIN : {c.cin}</p>
                </div>
                <button onClick={() => setOrderFormOpen(true)} className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}><i className="fa-solid fa-plus" />Commande</button>
                <button onClick={() => { setDetailOpen(false); setDeleteOpen(true); }} className="btn-danger" style={{ fontSize: 12, padding: '8px 16px' }}><i className="fa-solid fa-trash" />Client</button>
              </div>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  ['fa-credit-card', 'N° CIN', c.cin],
                  ['fa-phone', 'Téléphone', c.phone],
                  ['fa-map-pin', 'Adresse', c.address],
                  ['fa-calendar', 'Client depuis', new Date(c.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })],
                ].map(([ic, l, v], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`fa-solid ${ic}`} style={{ color: '#F97316', fontSize: 13 }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{l}</p>
                      <p style={{ fontSize: 13, fontWeight: 500, marginTop: 1 }}>{v}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { l: 'Commandes', v: st.totalOrders, ic: 'fa-shopping-bag', c: '#F97316' },
                  { l: 'Reçues', v: st.received, ic: 'fa-circle-check', c: '#10B981' },
                  { l: 'En attente', v: st.pending, ic: 'fa-clock', c: '#F59E0B' },
                  { l: 'Total', v: (st.totalSpent / 1000000).toFixed(2) + 'M', ic: 'fa-box', c: '#3B82F6' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '12px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 10 }}>
                    <i className={`fa-solid ${s.ic}`} style={{ color: s.c, fontSize: 15, marginBottom: 6, display: 'block' }} />
                    <p style={{ fontSize: 17, fontWeight: 700 }}>{s.v}</p>
                    <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-muted)', marginTop: 2 }}>{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Orders list */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fa-solid fa-shopping-bag" style={{ color: '#F97316', fontSize: 14 }} />Historique des commandes
                  </h3>
                  <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{st.totalOrders} commande(s)</span>
                </div>

                {c.orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 32, background: 'rgba(255,255,255,0.02)', borderRadius: 14, color: 'var(--fg-muted)' }}>
                    <i className="fa-solid fa-box-open" style={{ fontSize: 28, marginBottom: 8, opacity: 0.3, display: 'block' }} />
                    <p style={{ fontSize: 13 }}>Aucune commande pour ce client</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}>
                    {c.orders.map((order, i) => (
                      <div key={order.id} className={`order-card ${order.received ? 'order-card-received' : 'order-card-pending'}`} style={{ animation: `slideUp 0.3s ease-out ${i * 0.06}s both` }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}>#{String(order.id).padStart(4, '0')}</span>
                            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Commandé le {new Date(order.orderDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {order.received ? (
                              <span className="badge badge-received"><i className="fa-solid fa-circle-check" style={{ fontSize: 10 }} />Reçue</span>
                            ) : (
                              <button onClick={() => { setSelectedOrder(order); setMarkOpen(true); }}
                                style={{ background: 'rgba(245,158,11,0.12)', border: 'none', color: '#F59E0B', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans', transition: 'opacity 0.2s' }}>
                                <i className="fa-solid fa-clock" style={{ fontSize: 10 }} />Marquer reçue
                              </button>
                            )}
                            <ActionBtn icon="fa-trash" onClick={() => handleDeleteOrder(order.id)} hoverColor="#EF4444" label="Supprimer commande" />
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                          {order.items.map((item, ii) => (
                            <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                              <i className="fa-solid fa-box" style={{ color: 'var(--fg-muted)', fontSize: 11, flexShrink: 0 }} />
                              <span style={{ color: '#CBD5E1' }}>{item}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#F97316' }}>{formatDA(order.total)}</span>
                          {order.received && order.receivedDate ? (
                            <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, color: '#10B981' }}><i className="fa-solid fa-circle-check" style={{ fontSize: 11 }} />Réception : {new Date(order.receivedDate).toLocaleDateString('fr-FR')}</span>
                          ) : (
                            <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, color: '#F59E0B' }}><i className="fa-solid fa-circle-xmark" style={{ fontSize: 11 }} />En attente de réception</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* All components chip cloud */}
              {c.orders.length > 0 && (() => {
                const allItems = [...new Set(c.orders.flatMap(o => o.items))];
                return (
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-muted)', marginBottom: 8 }}>Tous les composants commandés ({allItems.length})</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {allItems.map((item, i) => <span key={i} className="component-chip">{item}</span>)}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })()}
      </Modal>

      {/* Modal: New Order */}
      <Modal isOpen={orderFormOpen} onClose={() => { setOrderFormOpen(false); setOrderLines([{ component: '', qty: 1 }]); }} title="Nouvelle Commande" width={620}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-muted)', marginBottom: 12 }}>Composants</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orderLines.map((line, i) => {
                const cat = COMPONENT_CATALOG.find(c => c.label === line.component);
                const lineT = cat ? cat.price * Number(line.qty) : 0;
                return (
                  <div key={i} className="animate-slide-up" style={{ display: 'flex', alignItems: 'flex-end', gap: 10, animationDelay: `${i * 0.05}s` }}>
                    <div style={{ flex: 1 }}>
                      <select className="input-field" value={line.component}
                        onChange={e => { const nl = [...orderLines]; nl[i] = { ...nl[i], component: e.target.value }; setOrderLines(nl); }}>
                        <option value="">Choisir un composant...</option>
                        {COMPONENT_CATALOG.map((c, ci) => <option key={ci} value={c.label}>{c.label} — {formatDA(c.price)}</option>)}
                      </select>
                    </div>
                    <div style={{ width: 90 }}>
                      <input className="input-field" type="number" min="1" value={line.qty} placeholder="Qté"
                        onChange={e => { const nl = [...orderLines]; nl[i] = { ...nl[i], qty: e.target.value }; setOrderLines(nl); }} />
                    </div>
                    <div style={{ width: 120, textAlign: 'right' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: lineT > 0 ? '#F97316' : 'var(--fg-muted)' }}>{lineT > 0 ? formatDA(lineT) : '—'}</span>
                    </div>
                    <button onClick={() => { if (orderLines.length > 1) setOrderLines(prev => prev.filter((_, idx) => idx !== i)); }}
                      style={{ width: 34, height: 40, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: orderLines.length > 1 ? 'var(--fg-muted)' : 'rgba(255,255,255,0.08)', cursor: orderLines.length > 1 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      onMouseEnter={e => { if (orderLines.length > 1) { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#EF4444'; } }}
                      onMouseLeave={e => { e.currentTarget.style.color = orderLines.length > 1 ? 'var(--fg-muted)' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                      aria-label="Supprimer ligne">
                      <i className="fa-solid fa-trash" style={{ fontSize: 12 }} />
                    </button>
                  </div>
                );
              })}
              <button onClick={() => setOrderLines(prev => [...prev, { component: '', qty: 1 }])}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', color: '#3B82F6', background: 'rgba(59,130,246,0.08)', border: '1px dashed rgba(59,130,246,0.3)', fontFamily: 'DM Sans' }}>
                <i className="fa-solid fa-plus" style={{ fontSize: 12 }} />Ajouter un composant
              </button>
            </div>
          </div>

          {/* Order total */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fa-solid fa-shopping-cart" style={{ color: '#F97316', fontSize: 15 }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>Total de la commande</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#F97316' }}>{formatDA(orderTotal)}</span>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={() => { setOrderFormOpen(false); setOrderLines([{ component: '', qty: 1 }]); }}>Annuler</button>
            <button className="btn-primary" onClick={handleNewOrder}><i className="fa-solid fa-shopping-cart" />Créer la commande</button>
          </div>
        </div>
      </Modal>

      {/* Modal: Confirm reception */}
      <Modal isOpen={markOpen} onClose={() => { setMarkOpen(false); setSelectedOrder(null); }} title="Confirmer la réception" width={420}>
        {selectedOrder && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="fa-solid fa-circle-check" style={{ color: '#10B981', fontSize: 22 }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Marquer comme reçue ?</h3>
            <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 8 }}>Commande #{String(selectedOrder.id).padStart(4, '0')}</p>
            <div style={{ marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 3, fontSize: 13, color: '#94A3B8' }}>
              {selectedOrder.items.map((item, i) => <span key={i}>{item}</span>)}
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#F97316', marginBottom: 24 }}>{formatDA(selectedOrder.total)}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setMarkOpen(false)}>Annuler</button>
              <button className="btn-success" onClick={handleMarkReceived}><i className="fa-solid fa-check" />Confirmer la réception</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDeleteClient}
        title="Supprimer le client"
        message={`Voulez-vous vraiment supprimer ${selected?.name} et toutes ses commandes ? Cette action est irréversible.`}
        confirmLabel="Supprimer" confirmColor="#EF4444" />
    </div>
  );
}
