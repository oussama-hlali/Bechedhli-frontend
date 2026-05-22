import React, { useState, useMemo } from 'react';
import { Modal, ConfirmModal, ActionBtn } from '../components/Modal';

const BL_ITEM_CATEGORIES = ['panneau', 'onduleur', 'structure', 'fixation', 'câblage', 'chemin de câble', 'Tube IRO', 'accessoires', 'coffret', 'protection', 'divers'];

function printBL(bl, client) {
  const itemsHTML = bl.items.map(it => 
    `<tr><td style="border:1px solid #333;padding:6px 10px;text-align:center">${it.n}</td><td style="border:1px solid #333;padding:6px 10px">${it.des}</td><td style="border:1px solid #333;padding:6px 10px">${it.marque || ''}</td><td style="border:1px solid #333;padding:6px 10px;font-style:italic;color:#555">${it.note || ''}</td><td style="border:1px solid #333;padding:6px 10px;text-align:center;font-weight:bold">${it.qty}</td></tr>`
  ).join('');
  
  const w = window.open('', '', 'width=900,height=700');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>BL ${bl.id}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#000;font-size:12px}table{width:100%;border-collapse:collapse}.header{text-align:center;margin-bottom:15px}.header h1{font-size:14px;font-weight:bold;letter-spacing:1px}.header h2{font-size:18px;font-weight:bold;margin:6px 0}.info-grid{display:grid;grid-template-columns:120px 1fr;gap:4px 12px;margin:10px 0 15px}.info-grid .label{font-weight:bold;font-size:11px}.info-grid .value{font-size:12px}.bl-header{display:grid;grid-template-columns:1fr 100px 100px 1fr;gap:8px;align-items:center;margin:10px 0;border-bottom:2px solid #000;padding-bottom:8px}.items-table th{background:#f0f0f0;font-size:11px;text-transform:uppercase;letter-spacing:.5px}.signatures{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:30px;padding-top:15px}.sig-box{text-align:center;padding:30px 10px;border-top:1px solid #999}.sig-box p{font-size:10px;color:#555;margin-top:8px}.footer{text-align:center;margin-top:20px;padding-top:10px;border-top:1px solid #ccc;font-size:10px;color:#666}@media print{body{padding:10px}}</style></head><body>
    <div class="header"><h1>BECHEDHLI SOLAR ENERGY</h1><h2>BON DE LIVRAISON</h2></div>
    <div class="info-grid"><span class="label">Client :</span><span class="value">${client.name}</span><span class="label">Adresse :</span><span class="value">${client.address}</span><span class="label">CIN :</span><span class="value">${client.cin}</span><span class="label">Puissance :</span><span class="value">${bl.puissance}</span><span class="label">Ref STEG :</span><span class="value">${bl.refSteg}</span><span class="label">TEL :</span><span class="value">${client.phone}</span></div>
    <div class="bl-header"><div><strong>Bon de livraison</strong><br/>${bl.id}</div><div style="text-align:center"><strong>Tri ou Mono</strong><br/>${bl.type}</div><div style="text-align:center"><strong>Date</strong><br/>${new Date(bl.date).toLocaleDateString('fr-FR')}</div><div style="text-align:right"><strong>TRANSPORTEUR</strong><br/>${bl.transporteur.name}<br/>${bl.transporteur.matricule}</div></div>
    <table class="items-table"><thead><tr><th style="border:1px solid #333;padding:6px 10px;width:40px;text-align:center">N°</th><th style="border:1px solid #333;padding:6px 10px">Désignation</th><th style="border:1px solid #333;padding:6px 10px">Marque / Réf</th><th style="border:1px solid #333;padding:6px 10px;width:100px">Catégorie</th><th style="border:1px solid #333;padding:6px 10px;width:60px;text-align:center">Qte</th></tr></thead><tbody>${itemsHTML}</tbody></table>
    <div class="signatures"><div class="sig-box">Cachet et Signature<br/>Responsable Magasin</div><div class="sig-box">Cachet et Signature<br/>Magasinier</div><div class="sig-box">Signature<br/>Livreur</div></div>
    <div class="footer"><p style="font-weight:bold;margin-bottom:4px">BECHEDHLI SOLAR ENERGY</p><p>109 Rue Misk Ellil Cité Ilmi Mhamdia — 1145 Ben Arous</p><p>GSM : 96 903 425 — MF : 1952714/G</p></div>
    </body></html>`);
  w.document.close();
  setTimeout(() => { w.print(); }, 300);
}

export default function LivraisonView({ bls, setBls, clients, addToast, onDeliverBL, onGenerateInvoice }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [nextNum, setNextNum] = useState(43);

  const emptyForm = {
    clientId: '', type: 'Mono', date: new Date().toISOString().split('T')[0],
    puissance: '', refSteg: '', transportName: '', transportMat: '',
    items: [{ n: 1, des: '', marque: '', cat: '', qty: 1, note: '' }]
  };
  const [form, setForm] = useState(emptyForm);

  const getClient = (id) => clients.find(c => c.id === id);

  const filtered = useMemo(() => bls.filter(bl => {
    const cl = getClient(bl.clientId);
    if (search && !(bl.id.toLowerCase().includes(search.toLowerCase()) || (cl && cl.name.toLowerCase().includes(search.toLowerCase())))) return false;
    if (statusFilter === 'delivered' && bl.status !== 'delivered') return false;
    if (statusFilter === 'waiting' && bl.status !== 'waiting') return false;
    if (statusFilter === 'invoiced' && !bl.invoiced) return false;
    return true;
  }), [bls, search, statusFilter, clients]);

  const stats = useMemo(() => ({
    total: bls.length,
    delivered: bls.filter(b => b.status === 'delivered').length,
    waiting: bls.filter(b => b.status === 'waiting').length,
    invoiced: bls.filter(b => b.invoiced).length,
  }), [bls]);

  const openCreate = () => {
    setForm({ ...emptyForm, date: new Date().toISOString().split('T')[0] });
    setCreateOpen(true);
  };

  const addItem = () => {
    setForm(f => ({ ...f, items: [...f.items, { n: f.items.length + 1, des: '', marque: '', cat: '', qty: 1, note: '' }] }));
  };

  const updateItem = (i, field, val) => {
    setForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [field]: val } : it) }));
  };

  const removeItem = (i) => {
    if (form.items.length > 1) {
      setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i).map((it, idx) => ({ ...it, n: idx + 1 })) }));
    }
  };

  const handleSave = () => {
    if (!form.clientId || !form.puissance) {
      addToast('Veuillez sélectionner un client et remplir la puissance', 'error');
      return;
    }
    const validItems = form.items.filter(it => it.des);
    if (validItems.length === 0) {
      addToast('Ajoutez au moins un article', 'error');
      return;
    }
    const newBL = {
      id: `BL${String(nextNum).padStart(5, '0')}`,
      clientId: Number(form.clientId),
      type: form.type,
      date: form.date,
      status: 'waiting',
      invoiced: false,
      puissance: form.puissance,
      refSteg: form.refSteg,
      transporteur: { name: form.transportName, matricule: form.transportMat },
      items: validItems
    };
    setBls(prev => [...prev, newBL]);
    setNextNum(n => n + 1);
    setCreateOpen(false);
    addToast(`Bon ${newBL.id} créé avec succès`);
  };

  const handleDeliver = () => {
    if (onDeliverBL) {
      onDeliverBL(selected);
    } else {
      setBls(prev => prev.map(b => b.id === selected.id ? { ...b, status: 'delivered' } : b));
      setSelected(s => ({ ...s, status: 'delivered' }));
      addToast(`${selected.id} marqué comme livré`);
    }
  };

  const handleInvoice = () => {
    if (onGenerateInvoice) {
      onGenerateInvoice(selected);
    } else {
      setBls(prev => prev.map(b => b.id === selected.id ? { ...b, invoiced: true } : b));
      setSelected(s => ({ ...s, invoiced: true }));
      addToast(`Facture générée pour ${selected.id}`);
    }
  };

  const handleDelete = () => {
    setBls(prev => prev.filter(b => b.id !== selected.id));
    addToast(`${selected.id} supprimé`);
    setDeleteOpen(false);
    setDetailOpen(false);
  };

  const statusBadge = (bl) => {
    if (bl.invoiced) return <span className="badge badge-invoiced"><i className="fa-solid fa-file-invoice" style={{ fontSize: 10 }} />Facturé</span>;
    if (bl.status === 'delivered') return <span className="badge badge-delivered"><i className="fa-solid fa-truck" style={{ fontSize: 10 }} />Livré</span>;
    return <span className="badge badge-waiting"><i className="fa-solid fa-clock" style={{ fontSize: 10 }} />En attente</span>;
  };

  const lbl = (t) => ({ fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '.05em' });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Livraison & Facturation</h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14 }}>{bls.length} bons de livraison — {stats.delivered} livrés — {stats.invoiced} facturés</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><i className="fa-solid fa-plus" />Nouveau Bon de Livraison</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[{ l: 'Total BL', v: stats.total, ic: 'fa-file-lines', c: '#F97316' }, { l: 'Livrés', v: stats.delivered, ic: 'fa-truck-fast', c: '#10B981' }, { l: 'En attente', v: stats.waiting, ic: 'fa-hourglass-half', c: '#F59E0B' }, { l: 'Facturés', v: stats.invoiced, ic: 'fa-file-invoice-dollar', c: '#3B82F6' }].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div><p style={{ color: 'var(--fg-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{s.l}</p><p style={{ fontSize: 22, fontWeight: 700 }}>{s.v}</p></div><div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.c}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className={`fa-solid ${s.ic}`} style={{ color: s.c, fontSize: 15 }} /></div></div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}><i className="fa-solid fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13 }} /><input className="input-field" placeholder="Rechercher par N° BL ou client..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} /></div>
        <select className="input-field" style={{ width: 'auto', minWidth: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option><option value="delivered">Livrés</option><option value="waiting">En attente</option><option value="invoiced">Facturés</option>
        </select>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>N° BL</th><th>Client</th><th>Type</th><th>Puissance</th><th>Date</th><th>Transporteur</th><th>Articles</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--fg-muted)' }}>Aucun bon trouvé</td></tr> :
                filtered.map((bl, i) => {
                  const cl = getClient(bl.clientId);
                  return (
                    <tr key={bl.id} onClick={() => { setSelected(bl); setDetailOpen(true); }} style={{ animation: `slideUp .3s ease-out ${i * .03}s both` }}>
                      <td><span style={{ fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'rgba(249,115,22,.1)', color: '#F97316' }}>{bl.id}</span></td>
                      <td style={{ fontWeight: 600, fontSize: 14 }}>{cl ? cl.name : '—'}</td>
                      <td><span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, background: bl.type === 'Mono' ? 'rgba(59,130,246,.1)' : 'rgba(139,92,246,.1)', color: bl.type === 'Mono' ? '#3B82F6' : '#8B5CF6', fontWeight: 600 }}>{bl.type}</span></td>
                      <td style={{ fontSize: 13, color: '#94A3B8' }}>{bl.puissance}</td>
                      <td style={{ fontSize: 13, color: '#94A3B8' }}>{new Date(bl.date).toLocaleDateString('fr-FR')}</td>
                      <td style={{ fontSize: 12, color: 'var(--fg-muted)' }}><div>{bl.transporteur.name}</div><div style={{ fontSize: 11, opacity: .7 }}>{bl.transporteur.matricule}</div></td>
                      <td><span style={{ fontWeight: 700, fontSize: 14 }}>{bl.items.length}</span></td>
                      <td>{statusBadge(bl)}</td>
                      <td><div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                        <ActionBtn icon="fa-eye" onClick={() => { setSelected(bl); setDetailOpen(true); }} hoverColor="#F97316" label="Voir" />
                        <ActionBtn icon="fa-trash" onClick={() => { setSelected(bl); setDeleteOpen(true); }} hoverColor="#EF4444" label="Supprimer" />
                      </div></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={detailOpen} onClose={() => { setDetailOpen(false); setSelected(null); }} title={`Bon de Livraison ${selected?.id || ''}`} width={780}>
        {selected && (() => {
          const cl = getClient(selected.clientId);
          const catColors = { panneau: '#F97316', onduleur: '#3B82F6', structure: '#10B981', fixation: '#F59E0B', 'câblage': '#8B5CF6', 'chemin de câble': '#06B6D4', 'Tube IRO': '#EC4899', coffret: '#6366F1', protection: '#EF4444', accessoires: '#14B8A6', divers: '#94A3B8' };
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '16px 20px', background: 'var(--detail-bg)', borderRadius: 14, borderLeft: `4px solid ${selected.status === 'delivered' ? '#10B981' : '#F59E0B'}` }}>
                <div className="avatar" style={{ width: 56, height: 56, background: 'rgba(249,115,22,.15)' }}><i className="fa-solid fa-file-lines" style={{ color: '#F97316', fontSize: 20 }} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 20, fontWeight: 700 }}>{selected.id}</span>
                    {statusBadge(selected)}
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{cl ? cl.name : 'Client inconnu'}</p>
                  <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{cl ? cl.address : ''}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                {[['fa-id-card', 'CIN', cl?.cin], ['fa-bolt', 'Puissance', selected.puissance], ['fa-hashtag', 'Ref STEG', selected.refSteg], ['fa-phone', 'Téléphone', cl?.phone], ['fa-solar-panel', 'Type', selected.type], ['fa-calendar', 'Date', new Date(selected.date).toLocaleDateString('fr-FR')], ['fa-truck', 'Transporteur', selected.transporteur.name], ['fa-car', 'Matricule', selected.transporteur.matricule], ['fa-box', 'Nb Articles', selected.items.length]].map(([ic, l, v], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--detail-bg)', borderRadius: 10 }}>
                    <i className={`fa-solid ${ic}`} style={{ color: 'var(--fg-muted)', fontSize: 12, width: 16 }} /><div><p style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{l}</p><p style={{ fontSize: 13, fontWeight: 500, marginTop: 1 }}>{v || '—'}</p></div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <button className="btn-print" onClick={() => cl && printBL(selected, cl)}><i className="fa-solid fa-print" />Imprimer le Bon</button>
                {selected.status === 'waiting' && <button className="btn-success" onClick={handleDeliver}><i className="fa-solid fa-truck-fast" />Marquer Livré</button>}
                {!selected.invoiced && selected.status === 'delivered' && <button className="btn-primary" onClick={handleInvoice} style={{ background: 'linear-gradient(135deg,#3B82F6,#2563EB)' }}><i className="fa-solid fa-file-invoice-dollar" />Générer Facture</button>}
                {selected.invoiced && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: 'rgba(59,130,246,.1)', color: '#3B82F6', fontSize: 13, fontWeight: 600 }}><i className="fa-solid fa-check-circle" />Facture générée</span>}
              </div>

              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <table className="data-table" style={{ margin: 0 }}>
                  <thead><tr><th style={{ width: 40 }}>N°</th><th>Désignation</th><th>Marque / Réf</th><th>Catégorie</th><th style={{ width: 60 }}>Qté</th></tr></thead>
                  <tbody>
                    {selected.items.map((it, i) => (
                      <tr key={i} style={{ animation: `slideUp .3s ease-out ${i * .03}s both` }}>
                        <td style={{ fontWeight: 700, textAlign: 'center', fontSize: 13 }}>{it.n}</td>
                        <td style={{ fontWeight: 600, fontSize: 13 }}>{it.des}</td>
                        <td style={{ fontSize: 13, color: '#94A3B8' }}>{it.marque || '—'}</td>
                        <td><span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: `${catColors[it.cat] || '#64748B'}18`, color: catColors[it.cat] || '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>{it.cat}</span>{it.note && <span style={{ fontSize: 10, color: '#64748B', marginLeft: 6, fontStyle: 'italic' }}>({it.note})</span>}</td>
                        <td style={{ fontWeight: 700, textAlign: 'center', fontSize: 15 }}>{it.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </Modal>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Nouveau Bon de Livraison" width={720}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={lbl('Client *')} /><select className="input-field" value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })}><option value="">Sélectionner...</option>{clients.map(c => <option key={c.id} value={c.id} style={{ background: '#FFFFFF' }}>{c.name}</option>)}</select></div>
            <div><label style={lbl('Type')} /><select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="Mono">Mono</option><option value="Tri">Tri</option></select></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div><label style={lbl('Puissance *')} /><input className="input-field" value={form.puissance} onChange={e => setForm({ ...form, puissance: e.target.value })} placeholder="Ex: 3,240 kwc" /></div>
            <div><label style={lbl('Ref STEG')} /><input className="input-field" value={form.refSteg} onChange={e => setForm({ ...form, refSteg: e.target.value })} placeholder="Ex: 20081 289 0" /></div>
            <div><label style={lbl('Date')} /><input className="input-field" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={lbl('Transporteur')} /><input className="input-field" value={form.transportName} onChange={e => setForm({ ...form, transportName: e.target.value })} placeholder="Nom du transporteur" /></div>
            <div><label style={lbl('Matricule')} /><input className="input-field" value={form.transportMat} onChange={e => setForm({ ...form, transportMat: e.target.value })} placeholder="Ex: 213 Tunis 6198" /></div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--fg-muted)' }}>Articles ({form.items.length})</p>
              <button onClick={addItem} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', color: '#3B82F6', background: 'rgba(59,130,246,.08)', border: '1px dashed rgba(59,130,246,.3)', fontFamily: 'DM Sans' }}><i className="fa-solid fa-plus" style={{ fontSize: 11 }} />Ajouter ligne</button>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto', borderRadius: 12, border: '1px solid var(--border)', padding: 2 }}>
              <table className="data-table" style={{ margin: 0 }}>
                <thead><tr><th style={{ width: 36 }}>N°</th><th>Désignation *</th><th>Marque</th><th>Catégorie</th><th>Note</th><th style={{ width: 60 }}>Qté</th><th style={{ width: 36 }}></th></tr></thead>
                <tbody>
                  {form.items.map((it, i) => (
                    <tr key={i} style={{ animation: 'none' }}>
                      <td style={{ fontWeight: 700, textAlign: 'center', fontSize: 12 }}>{it.n}</td>
                      <td><input className="input-field" style={{ padding: '6px 10px', fontSize: 12 }} value={it.des} onChange={e => updateItem(i, 'des', e.target.value)} placeholder="Désignation" /></td>
                      <td><input className="input-field" style={{ padding: '6px 10px', fontSize: 12 }} value={it.marque} onChange={e => updateItem(i, 'marque', e.target.value)} placeholder="Réf" /></td>
                      <td><select className="input-field" style={{ padding: '6px 10px', fontSize: 12, cursor: 'pointer' }} value={it.cat} onChange={e => updateItem(i, 'cat', e.target.value)}><option value="">—</option>{BL_ITEM_CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#FFFFFF' }}>{c}</option>)}</select></td>
                      <td><input className="input-field" style={{ padding: '6px 10px', fontSize: 12 }} value={it.note} onChange={e => updateItem(i, 'note', e.target.value)} placeholder="Note" /></td>
                      <td><input className="input-field" type="number" min="1" style={{ padding: '6px 10px', fontSize: 12, textAlign: 'center' }} value={it.qty} onChange={e => updateItem(i, 'qty', e.target.value)} /></td>
                      <td><button onClick={() => removeItem(i)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: form.items.length > 1 ? 'rgba(239,68,68,.1)' : 'transparent', color: form.items.length > 1 ? '#EF4444' : 'rgba(0,0,0,.08)', cursor: form.items.length > 1 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', fontSize: 11 }} aria-label="Supprimer"><i className="fa-solid fa-times" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn-secondary" onClick={() => setCreateOpen(false)}>Annuler</button>
            <button className="btn-primary" onClick={handleSave}><i className="fa-solid fa-save" />Créer le Bon</button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Supprimer le Bon" message={`Voulez-vous vraiment supprimer ${selected?.id} ? Cette action est irréversible.`} confirmColor="#EF4444" />
    </div>
  );
}
