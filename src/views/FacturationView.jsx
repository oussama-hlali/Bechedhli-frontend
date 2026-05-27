import { useState, useMemo, useEffect } from 'react';
import { Modal, ConfirmModal, ActionBtn } from '../components/Modal';
import { FACTURE_STATUS, calcFacture, printFacture } from '../data/facturation';
import { formatDA } from '../data';
import { facturesApi } from '../api';
import logoImg from '../assets/bechedhli-logo.png';

function facBadge(s) {
  const c = FACTURE_STATUS[s];
  if (!c) return null;
  return <span className={c.badge}><i className={`fa-solid ${c.icon}`} style={{ fontSize: 10 }} />{c.label}</span>;
}

const LBL = { fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '.05em' };

export default function FacturationView({ factures, setFactures, clients, dossiers, addToast, prefillInvoice, onClearPrefill }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [nextNum, setNextNum] = useState(5);

  const getClient = (id) => clients.find(c => c.id === id);
  const getDossier = (id) => dossiers.find(d => d.id === id);

  const [form, setForm] = useState({
    clientId: '', dossierId: '', numBL: '', date: new Date().toISOString().split('T')[0],
    echeance: '', tva: 19, remise: 0, notes: '',
    items: [{ desc: '', qty: 1, unit: 'forfait', prix: 0 }]
  });
  const [payForm, setPayForm] = useState({ montant: '', mode: 'Virement bancaire', ref: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    if (prefillInvoice) {
      setForm(f => ({
        ...f,
        clientId: String(prefillInvoice.clientId),
        dossierId: String(prefillInvoice.dossierId),
      }));
      setCreateOpen(true);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillInvoice]);

  const filtered = useMemo(() => factures.filter(f => {
    const cl = getClient(f.clientId);
    if (search && !f.id.toLowerCase().includes(search.toLowerCase()) && !(cl && cl.name.toLowerCase().includes(search.toLowerCase()))) return false;
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    return true;
  }), [factures, search, statusFilter, clients]);

  const stats = useMemo(() => {
    const allCalc = factures.map(f => ({ ...f, ...calcFacture(f) }));
    const totalTTC = allCalc.reduce((s, f) => s + f.ttc, 0);
    const totalPaid = allCalc.reduce((s, f) => s + f.paid, 0);
    const totalReste = allCalc.reduce((s, f) => s + Math.max(0, f.reste), 0);
    return {
      total: factures.length, totalTTC, totalPaid, totalReste,
      paid: factures.filter(f => f.status === 'paid').length,
      sent: factures.filter(f => f.status === 'sent').length,
      overdue: factures.filter(f => f.status === 'overdue').length,
      partial: factures.filter(f => f.status === 'partial').length,
    };
  }, [factures]);

  const openCreate = (preClientId, preDossierId) => {
    setForm({
      clientId: String(preClientId || ''), dossierId: String(preDossierId || ''),
      numBL: '', date: new Date().toISOString().split('T')[0], echeance: '', tva: 19, remise: 0, notes: '',
      items: [{ desc: '', qty: 1, unit: 'forfait', prix: 0 }]
    });
    setCreateOpen(true);
  };

  const updateItem = (idx, key, val) => {
    setForm(p => {
      const items = [...p.items];
      items[idx] = { ...items[idx], [key]: (key === 'qty' || key === 'prix') ? (Number(val) || 0) : val };
      return { ...p, items };
    });
  };

  const addItem = () => setForm(p => ({ ...p, items: [...p.items, { desc: '', qty: 1, unit: 'forfait', prix: 0 }] }));
  const removeItem = (idx) => { if (form.items.length <= 1) return; setForm(p => ({ ...p, items: p.items.filter((_, i) => i !== idx) })); };

  const handleCreate = async () => {
    if (!form.clientId) { addToast('Sélectionnez un client', 'error'); return; }
    const validItems = form.items.filter(i => i.desc && i.prix > 0);
    if (validItems.length === 0) { addToast('Ajoutez au moins une ligne avec un montant', 'error'); return; }
    const num = 'FAC-2024-' + String(nextNum).padStart(3, '0');
    const ech = form.echeance || new Date(new Date(form.date).getTime() + 30 * 86400000).toISOString().split('T')[0];
    const nf = {
      id: num, clientId: Number(form.clientId), dossierId: form.dossierId ? Number(form.dossierId) : null,
      numBL: form.numBL, date: form.date, echeance: ech, status: 'draft',
      tva: form.tva, remise: form.remise, notes: form.notes
    };
    const created = await facturesApi.create(nf);
    setFactures(p => [...p, { ...created, items: created.items || [], payments: created.payments || [] }]);
    setNextNum(p => p + 1);
    setCreateOpen(false);
    addToast('Facture ' + num + ' créée');
  };

  const handleSend = async () => {
    const updated = { ...selected, status: 'sent' };
    await facturesApi.update(selected.id, updated);
    setFactures(p => p.map(f => f.id === selected.id ? updated : f));
    setSelected(updated);
    addToast('Facture ' + selected.id + ' envoyée au client');
  };

  const handlePay = async () => {
    const m = Number(payForm.montant);
    if (!m || m <= 0) { addToast('Saisissez un montant valide', 'error'); return; }
    const c = calcFacture(selected);
    if (m > c.reste) { addToast('Le montant dépasse le restant dû (' + formatDA(c.reste) + ')', 'error'); return; }
    const np = { date: payForm.date, montant: m, mode: payForm.mode, ref: payForm.ref };
    const newPayments = [...(selected.payments || []), np];
    const newCalc = calcFacture({ ...selected, payments: newPayments });
    const newStatus = newCalc.reste <= 0 ? 'paid' : 'partial';
    const updated = { ...selected, payments: newPayments, status: newStatus };
    await facturesApi.update(selected.id, updated);
    setFactures(p => p.map(f => f.id === selected.id ? updated : f));
    setSelected(updated);
    setPayOpen(false);
    addToast(newStatus === 'paid' ? 'Facture soldée !' : 'Paiement de ' + formatDA(m) + ' enregistré');
  };

  const handleDelete = async () => {
    await facturesApi.delete(selected.id);
    setFactures(p => p.filter(f => f.id !== selected.id));
    addToast('Facture ' + selected.id + ' supprimée');
    setDeleteOpen(false);
    setDetailOpen(false);
  };

  const handleMarkOverdue = async () => {
    const updated = { ...selected, status: 'overdue' };
    await facturesApi.update(selected.id, updated);
    setFactures(p => p.map(f => f.id === selected.id ? updated : f));
    setSelected(updated);
    addToast('Facture marquée en retard', 'error');
  };

  const formCalc = useMemo(() => calcFacture({ items: form.items, tva: form.tva, remise: form.remise, payments: [] }), [form]);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Facturation Services Client</h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14 }}>Gestion des factures de services d'installation et de raccordement</p>
        </div>
        <button className="btn-primary" onClick={() => openCreate()}><i className="fa-solid fa-plus" />Nouvelle Facture</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { l: 'Total Facturé', v: formatDA(stats.totalTTC), ic: 'fa-file-invoice-dollar', c: '#F97316', sub: stats.total + ' facture(s)' },
          { l: 'Encaissé', v: formatDA(stats.totalPaid), ic: 'fa-circle-check', c: '#10B981', sub: stats.paid + ' payée(s)' },
          { l: 'En attente', v: formatDA(stats.totalReste), ic: 'fa-hourglass-half', c: '#F59E0B', sub: stats.sent + ' envoyée(s)' },
          { l: 'Paiements partiels', v: stats.partial, ic: 'fa-arrows-split-up-and-left', c: '#8B5CF6', sub: 'En cours de réglement' },
          { l: 'En retard', v: stats.overdue, ic: 'fa-clock', c: '#EF4444', sub: 'Relance nécessaire' },
        ].map((s, i) => (
          <div key={i} className="glass-card animate-slide-up" style={{ padding: '18px 20px', animationDelay: i * 0.06 + 's' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.c + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={'fa-solid ' + s.ic} style={{ color: s.c, fontSize: 14 }} />
              </div>
            </div>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{s.l}</p>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>{s.v}</p>
            <p style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Taux d'encaissement global</span>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: stats.totalTTC > 0 ? (stats.totalPaid / stats.totalTTC >= 0.8 ? '#10B981' : stats.totalPaid / stats.totalTTC >= 0.5 ? '#F59E0B' : '#EF4444') : '#94A3B8' }}>
            {stats.totalTTC > 0 ? Math.round(stats.totalPaid / stats.totalTTC * 100) : 0}%
          </span>
        </div>
        <div className="progress-bar" style={{ height: 10, borderRadius: 5 }}>
          <div className="progress-fill" style={{
            width: (stats.totalTTC > 0 ? Math.round(stats.totalPaid / stats.totalTTC * 100) : 0) + '%',
            background: stats.totalPaid / stats.totalTTC >= 0.8 ? 'linear-gradient(90deg,#10B981,#059669)' : stats.totalPaid / stats.totalTTC >= 0.5 ? 'linear-gradient(90deg,#F59E0B,#D97706)' : 'linear-gradient(90deg,#EF4444,#DC2626)',
            transition: 'width 1s ease-out'
          }} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 8 }}>{formatDA(stats.totalPaid)} encaissé sur {formatDA(stats.totalTTC)} facturé</p>
      </div>

      <div className="glass-card" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13 }} />
          <input className="input-field" placeholder="Rechercher par N° facture ou client..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <select className="input-field" style={{ width: 'auto', minWidth: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          {Object.entries(FACTURE_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>N° Facture</th><th>Client</th><th>Date</th><th>Échéance</th><th>Montant TTC</th><th>Encaissé</th><th>Reste</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--fg-muted)' }}>Aucune facture trouvée</td></tr>
              ) : filtered.map((f, i) => {
                const cl = getClient(f.clientId);
                const c = calcFacture(f);
                return (
                  <tr key={f.id} onClick={() => { setSelected(f); setDetailOpen(true); }} style={{ animation: `slideUp .3s ease-out ${i * 0.03}s both` }}>
                    <td><span style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'rgba(249,115,22,.1)', color: '#F97316' }}>{f.id}</span></td>
                    <td style={{ fontWeight: 600, fontSize: 14 }}>{cl ? cl.name : '—'}</td>
                    <td style={{ fontSize: 13, color: '#94A3B8' }}>{new Date(f.date).toLocaleDateString('fr-FR')}</td>
                    <td style={{ fontSize: 13, color: f.status === 'overdue' ? '#EF4444' : '#94A3B8', fontWeight: f.status === 'overdue' ? 700 : 400 }}>{new Date(f.echeance).toLocaleDateString('fr-FR')}</td>
                    <td style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13 }}>{formatDA(c.ttc)}</td>
                    <td style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>{formatDA(c.paid)}</td>
                    <td style={{ fontSize: 13, color: c.reste > 0 ? '#EF4444' : '#10B981', fontWeight: 600 }}>{formatDA(Math.max(0, c.reste))}</td>
                    <td>{facBadge(f.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                        <ActionBtn icon="fa-eye" onClick={() => { setSelected(f); setDetailOpen(true); }} hoverColor="#F97316" label="Voir" />
                        <ActionBtn icon="fa-trash" onClick={() => { setSelected(f); setDeleteOpen(true); }} hoverColor="#EF4444" label="Supprimer" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={detailOpen} onClose={() => { setDetailOpen(false); setSelected(null); }} title={'Facture ' + ((selected && selected.id) || '')} width={820}>
        {selected && (() => {
          const cl = getClient(selected.clientId);
          const dos = getDossier(selected.dossierId);
          const c = calcFacture(selected);
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '16px 20px', background: 'var(--detail-bg)', borderRadius: 14, borderLeft: '4px solid ' + (FACTURE_STATUS[selected.status]?.color || '#94A3B8') }}>
                <div className="avatar" style={{ width: 56, height: 56, background: 'rgba(249,115,22,.15)' }}><i className="fa-solid fa-file-invoice-dollar" style={{ color: '#F97316', fontSize: 20 }} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700 }}>{selected.id}</span>
                    {facBadge(selected.status)}
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{cl ? cl.name : 'Client inconnu'}</p>
                  <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{cl ? cl.address : ''}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
                {[
                  ['fa-calendar', 'Date', new Date(selected.date).toLocaleDateString('fr-FR')],
                  ['fa-clock', 'Échéance', new Date(selected.echeance).toLocaleDateString('fr-FR')],
                  ['fa-hashtag', 'Réf BL', selected.numBL || '—'],
                  ['fa-file-shield', 'Dossier STEG', dos ? dos.refSteg : '—'],
                ].map(([ic, l, v], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--detail-bg)', borderRadius: 10 }}>
                    <i className={'fa-solid ' + ic} style={{ color: 'var(--fg-muted)', fontSize: 12, width: 16 }} />
                    <div><p style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{l}</p><p style={{ fontSize: 13, fontWeight: 500, marginTop: 1 }}>{v}</p></div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <button className="btn-print" onClick={() => cl && printFacture(selected, cl, window.location.origin + logoImg)}><i className="fa-solid fa-print" />Imprimer la Facture</button>
                {selected.status === 'draft' && (
                  <button className="btn-primary" onClick={handleSend}><i className="fa-solid fa-paper-plane" />Envoyer au Client</button>
                )}
                {(selected.status === 'sent' || selected.status === 'partial') && (
                  <button className="btn-success" onClick={() => { setPayForm({ montant: '', mode: 'Virement bancaire', ref: '', date: new Date().toISOString().split('T')[0] }); setPayOpen(true); }}>
                    <i className="fa-solid fa-coins" />Enregistrer un Paiement
                  </button>
                )}
                {selected.status === 'sent' && (
                  <button className="btn-danger btn-sm" onClick={handleMarkOverdue}><i className="fa-solid fa-clock" />Marquer en Retard</button>
                )}
                {selected.status === 'paid' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: 'rgba(16,185,129,.1)', color: '#10B981', fontSize: 13, fontWeight: 600 }}>
                    <i className="fa-solid fa-check-double" />Facture intégralement soldée
                  </span>
                )}
              </div>

              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20 }}>
                <table className="data-table" style={{ margin: 0 }}>
                  <thead><tr><th style={{ width: 36 }}>N°</th><th>Désignation</th><th style={{ width: 60, textAlign: 'center' }}>Qté</th><th style={{ width: 70 }}>Unité</th><th style={{ width: 120, textAlign: 'right' }}>P.U. HT</th><th style={{ width: 120, textAlign: 'right' }}>Montant</th></tr></thead>
                  <tbody>
                    {selected.items.map((it, i) => (
                      <tr key={i}>
                        <td style={{ fontFamily: 'Space Grotesk', fontWeight: 700, textAlign: 'center', fontSize: 13 }}>{i + 1}</td>
                        <td style={{ fontWeight: 600, fontSize: 13 }}>{it.desc}</td>
                        <td style={{ textAlign: 'center', fontSize: 13 }}>{it.qty}</td>
                        <td style={{ fontSize: 12, color: '#94A3B8', textTransform: 'lowercase' }}>{it.unit}</td>
                        <td style={{ fontFamily: 'Space Grotesk', textAlign: 'right', fontSize: 13 }}>{formatDA(it.prix)}</td>
                        <td style={{ fontFamily: 'Space Grotesk', textAlign: 'right', fontWeight: 700, fontSize: 13 }}>{formatDA(it.qty * it.prix)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <div style={{ width: 300 }}>
                  {[
                    ['Total HT', formatDA(c.ht), false],
                    ...(selected.remise > 0 ? [['Remise (' + selected.remise + '%)', '-' + formatDA(c.remise), true]] : []),
                    ['HT Net', formatDA(c.htNet), false],
                    ['TVA (' + selected.tva + '%)', formatDA(c.tva), false],
                    ['TOTAL TTC', formatDA(c.ttc), false],
                  ].map(([l, v, green], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: i === 4 ? 15 : 13, fontWeight: i === 4 ? 700 : 500, borderTop: i === 4 ? '2px solid var(--fg)' : 'none', color: green ? '#10B981' : i === 4 ? 'var(--fg)' : 'var(--fg-muted)' }}>
                      <span>{l}</span><span style={{ fontFamily: 'Space Grotesk' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selected.payments.length > 0 && (
                <div style={{ padding: 16, background: 'rgba(16,185,129,.05)', borderRadius: 12, border: '1px solid rgba(16,185,129,.15)', marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#10B981', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="fa-solid fa-receipt" style={{ fontSize: 11 }} />Historique des paiements ({formatDA(c.paid)})
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selected.payments.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--detail-bg)', borderRadius: 8 }}>
                        <span style={{ fontSize: 12, color: '#94A3B8', minWidth: 90 }}>{new Date(p.date).toLocaleDateString('fr-FR')}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{p.mode}{p.ref ? ' (' + p.ref + ')' : ''}</span>
                        <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700, color: '#10B981' }}>{formatDA(p.montant)}</span>
                      </div>
                    ))}
                  </div>
                  {c.reste > 0 && <p style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B', marginTop: 10, textAlign: 'right' }}>Reste à payer : {formatDA(c.reste)}</p>}
                </div>
              )}

              {selected.notes && (
                <div style={{ padding: 14, background: 'rgba(245,158,11,.06)', borderRadius: 10, border: '1px solid rgba(245,158,11,.15)', marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#F59E0B', marginBottom: 4 }}><i className="fa-solid fa-note-sticky" style={{ fontSize: 10, marginRight: 4 }} />Notes</p>
                  <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.5 }}>{selected.notes}</p>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Nouvelle Facture Service Client" width={780}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LBL}>Client *</label>
              <select className="input-field" value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })}>
                <option value="">Sélectionner...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={LBL}>Dossier STEG lié</label>
              <select className="input-field" value={form.dossierId} onChange={e => setForm({ ...form, dossierId: e.target.value })}>
                <option value="">Aucun</option>
                {dossiers.filter(d => d.clientId === Number(form.clientId)).map(d => (
                  <option key={d.id} value={d.id}>{d.refSteg} — {d.puissance}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div><label style={LBL}>Réf. Bon de Livraison</label><input className="input-field" value={form.numBL} onChange={e => setForm({ ...form, numBL: e.target.value })} placeholder="Ex: BL-2024-042" /></div>
            <div><label style={LBL}>Date *</label><input className="input-field" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div><label style={LBL}>Échéance</label><input className="input-field" type="date" value={form.echeance} onChange={e => setForm({ ...form, echeance: e.target.value })} /></div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label style={{ ...LBL, marginBottom: 0 }}>Lignes de facturation *</label>
              <button className="btn-secondary btn-sm" onClick={addItem}><i className="fa-solid fa-plus" style={{ fontSize: 10 }} />Ajouter une ligne</button>
            </div>
            <div style={{ background: 'var(--detail-bg)', borderRadius: 12, padding: 14, border: '1px solid var(--border)' }}>
              {form.items.map((it, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 90px 110px 36px', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <input className="input-field" placeholder="Description du service..." value={it.desc} onChange={e => updateItem(idx, 'desc', e.target.value)} style={{ fontSize: 13 }} />
                  <input className="input-field" type="number" min="1" value={it.qty} onChange={e => updateItem(idx, 'qty', e.target.value)} style={{ textAlign: 'center', fontSize: 13 }} />
                  <select className="input-field" value={it.unit} onChange={e => updateItem(idx, 'unit', e.target.value)} style={{ fontSize: 12 }}>
                    <option value="forfait">Forfait</option><option value="jour">Jour</option><option value="heure">Heure</option><option value="unité">Unité</option><option value="mètre">Mètre</option>
                  </select>
                  <input className="input-field" type="number" min="0" placeholder="Prix" value={it.prix || ''} onChange={e => updateItem(idx, 'prix', e.target.value)} style={{ textAlign: 'right', fontSize: 13 }} />
                  <button onClick={() => removeItem(idx)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--fg-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} disabled={form.items.length <= 1}>
                    <i className="fa-solid fa-xmark" style={{ fontSize: 11 }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div><label style={LBL}>TVA (%)</label><input className="input-field" type="number" min="0" max="100" value={form.tva} onChange={e => setForm({ ...form, tva: Number(e.target.value) || 0 })} /></div>
            <div><label style={LBL}>Remise (%)</label><input className="input-field" type="number" min="0" max="100" value={form.remise} onChange={e => setForm({ ...form, remise: Number(e.target.value) || 0 })} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ padding: '12px 14px', background: 'rgba(249,115,22,.08)', borderRadius: 10, border: '1px solid rgba(249,115,22,.2)', textAlign: 'center' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase' }}>TTC estimé</p>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, color: '#F97316' }}>{formatDA(formCalc.ttc)}</p>
              </div>
            </div>
          </div>

          <div><label style={LBL}>Notes</label><input className="input-field" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Observations, conditions particulières..." /></div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn-secondary" onClick={() => setCreateOpen(false)}>Annuler</button>
            <button className="btn-primary" onClick={handleCreate}><i className="fa-solid fa-file-invoice-dollar" />Créer la Facture</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={payOpen} onClose={() => setPayOpen(false)} title="Enregistrer un Paiement" width={480}>
        {selected && (() => {
          const c = calcFacture(selected);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 14, background: 'rgba(245,158,11,.06)', borderRadius: 10, border: '1px solid rgba(245,158,11,.15)', textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: '#F59E0B', marginBottom: 4 }}>Reste à payer</p>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, color: '#F59E0B' }}>{formatDA(c.reste)}</p>
              </div>
              <div><label style={LBL}>Montant *</label><input className="input-field" type="number" min="0" placeholder="Saisir le montant..." value={payForm.montant} onChange={e => setPayForm({ ...payForm, montant: e.target.value })} /></div>
              <div><label style={LBL}>Mode de paiement</label>
                <select className="input-field" value={payForm.mode} onChange={e => setPayForm({ ...payForm, mode: e.target.value })}>
                  <option value="Virement bancaire">Virement bancaire</option><option value="Espèces">Espèces</option><option value="Chèque">Chèque</option><option value="CCP">CCP</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={LBL}>Référence</label><input className="input-field" value={payForm.ref} onChange={e => setPayForm({ ...payForm, ref: e.target.value })} placeholder="N° virement, chèque..." /></div>
                <div><label style={LBL}>Date *</label><input className="input-field" type="date" value={payForm.date} onChange={e => setPayForm({ ...payForm, date: e.target.value })} /></div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn-secondary" onClick={() => setPayOpen(false)}>Annuler</button>
                <button className="btn-success" onClick={handlePay}><i className="fa-solid fa-coins" />Enregistrer le Paiement</button>
              </div>
            </div>
          );
        })()}
      </Modal>

      <ConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Supprimer la facture" message={'Supprimer la facture ' + (selected?.id || '') + ' ? Cette action est irréversible.'} confirmColor="#EF4444" />
    </div>
  );
}
