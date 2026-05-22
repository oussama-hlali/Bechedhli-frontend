import { useState, useMemo } from 'react';
import { Modal, ConfirmModal, ActionBtn } from '../components/Modal';
import { STEG_DOCS, STATUS_CONF, docProgress } from '../data/steg';

function stBadge(s) {
  const c = STATUS_CONF[s];
  if (!c) return null;
  return <span className={c.badge}><i className={`fa-solid ${c.icon}`} style={{ fontSize: 10 }} />{c.label}</span>;
}

const LBL = { fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '.05em' };

export default function StegView({ dossiers, setDossiers, clients, addToast, onFacturer }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ clientId: '', refSteg: '', puissance: '', notes: '' });

  const getClient = (id) => clients.find(c => c.id === id);

  const filtered = useMemo(() => dossiers.filter(d => {
    const cl = getClient(d.clientId);
    if (search && !d.refSteg.includes(search) && (cl && !cl.name.toLowerCase().includes(search.toLowerCase()))) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    return true;
  }), [dossiers, search, statusFilter, clients]);

  const stats = useMemo(() => {
    const dt = dossiers.reduce((s, d) => s + Object.values(d.docs).length, 0);
    const dk = dossiers.reduce((s, d) => s + Object.values(d.docs).filter(Boolean).length, 0);
    return {
      total: dossiers.length,
      prep: dossiers.filter(d => d.status === 'prep').length,
      submitted: dossiers.filter(d => d.status === 'submitted').length,
      validation: dossiers.filter(d => d.status === 'validation').length,
      approved: dossiers.filter(d => d.status === 'approved').length,
      rejected: dossiers.filter(d => d.status === 'rejected').length,
      docsTotal: dt, docsOk: dk,
      progress: dt > 0 ? Math.round(dk / dt * 100) : 0
    };
  }, [dossiers]);

  const openCreate = () => {
    setForm({ clientId: '', refSteg: '', puissance: '', notes: '' });
    setCreateOpen(true);
  };

  const handleCreate = () => {
    if (!form.clientId || !form.refSteg) {
      addToast('Sélectionnez un client et saisissez la réf. STEG', 'error');
      return;
    }
    const nd = {
      id: Date.now(), clientId: Number(form.clientId), refSteg: form.refSteg,
      puissance: form.puissance, status: 'prep',
      createdAt: new Date().toISOString().split('T')[0],
      submittedDate: null, approvedDate: null, notes: form.notes,
      docs: Object.fromEntries(STEG_DOCS.map(d => [d.id, false]))
    };
    setDossiers(p => [...p, nd]);
    setCreateOpen(false);
    addToast('Dossier créé avec succès');
  };

  const handleDocToggle = (docId) => {
    setDossiers(p => p.map(d => d.id === selected.id ? { ...d, docs: { ...d.docs, [docId]: !d.docs[docId] } } : d));
    setSelected(s => ({ ...s, docs: { ...s.docs, [docId]: !s.docs[docId] } }));
  };

  const handleSubmit = () => {
    if (!selected) return;
    if (!Object.values(selected.docs).some(Boolean)) {
      addToast('Ajoutez au moins un document', 'error');
      return;
    }
    setDossiers(p => p.map(d => d.id === selected.id ? { ...d, status: 'submitted', submittedDate: new Date().toISOString().split('T')[0] } : d));
    setSelected(s => ({ ...s, status: 'submitted', submittedDate: new Date().toISOString().split('T')[0] }));
    setSubmitOpen(false);
    addToast('Dossier soumis à la STEG');
  };

  const handleApprove = () => {
    setDossiers(p => p.map(d => d.id === selected.id ? { ...d, status: 'approved', approvedDate: new Date().toISOString().split('T')[0] } : d));
    setSelected(s => ({ ...s, status: 'approved', approvedDate: new Date().toISOString().split('T')[0] }));
    addToast('Dossier approuvé par la STEG');
  };

  const handleReject = () => {
    setDossiers(p => p.map(d => d.id === selected.id ? { ...d, status: 'rejected' } : d));
    setSelected(s => ({ ...s, status: 'rejected' }));
    setRejectOpen(false);
    addToast('Dossier rejeté', 'error');
  };

  const handleDelete = () => {
    setDossiers(p => p.filter(d => d.id !== selected.id));
    addToast('Dossier supprimé');
    setDetailOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Gestion Doc STEG</h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14 }}>Suivi des dossiers de raccordement auprès de la STEG</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><i className="fa-solid fa-plus" />Nouveau Dossier</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
        {[
          { l: 'Dossiers Total', v: stats.total, ic: 'fa-folder-open', c: '#F97316' },
          { l: 'Approuvés', v: stats.approved, ic: 'fa-circle-check', c: '#10B981' },
          { l: 'En cours', v: stats.submitted + stats.validation, ic: 'fa-spinner', c: '#F59E0B' },
          { l: 'Rejetés', v: stats.rejected, ic: 'fa-circle-xmark', c: '#EF4444' },
        ].map((s, i) => (
          <div key={i} className="glass-card animate-slide-up" style={{ padding: '18px 20px', animationDelay: i * 0.08 + 's' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--fg-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{s.l}</p>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700 }}>{s.v}</p>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.c + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fa-solid ${s.ic}`} style={{ color: s.c, fontSize: 15 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Complétude documentaire globale</span>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: stats.progress >= 80 ? '#10B981' : stats.progress >= 50 ? '#F59E0B' : '#EF4444' }}>{stats.progress}%</span>
        </div>
        <div className="progress-bar" style={{ height: 10, borderRadius: 5 }}>
          <div className="progress-fill" style={{ width: stats.progress + '%', background: stats.progress >= 80 ? 'linear-gradient(90deg,#10B981,#059669)' : stats.progress >= 50 ? 'linear-gradient(90deg,#F59E0B,#D97706)' : 'linear-gradient(90deg,#EF4444,#DC2626)' }} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 8 }}>{stats.docsOk} documents prêts sur {stats.docsTotal}</p>
      </div>

      <div className="glass-card" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', fontSize: 13 }} />
          <input className="input-field" placeholder="Rechercher par réf. STEG ou client..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <select className="input-field" style={{ width: 'auto', minWidth: 200 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_CONF).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>Réf. STEG</th><th>Client</th><th>Puissance</th><th>Documents</th><th>Statut</th><th>Créé le</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--fg-muted)' }}>Aucun dossier trouvé</td></tr>
              ) : filtered.map((d, i) => {
                const cl = getClient(d.clientId);
                const dp = docProgress(d.docs);
                return (
                  <tr key={d.id} onClick={() => { setSelected(d); setDetailOpen(true); }} style={{ animation: `slideUp .3s ease-out ${i * 0.03}s both` }}>
                    <td><span style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'rgba(59,130,246,.1)', color: '#3B82F6' }}>{d.refSteg}</span></td>
                    <td style={{ fontWeight: 600, fontSize: 14 }}>{cl ? cl.name : '—'}</td>
                    <td style={{ fontSize: 13, color: '#94A3B8' }}>{d.puissance || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60 }}><div className="progress-bar" style={{ height: 5 }}><div className="progress-fill" style={{ width: dp.pct + '%', background: dp.pct === 100 ? '#10B981' : dp.pct >= 50 ? '#F59E0B' : '#EF4444' }} /></div></div>
                        <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Space Grotesk', color: dp.pct === 100 ? '#10B981' : 'var(--fg-muted)' }}>{dp.ok}/{dp.total}</span>
                      </div>
                    </td>
                    <td>{stBadge(d.status)}</td>
                    <td style={{ fontSize: 13, color: '#94A3B8' }}>{new Date(d.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                        <ActionBtn icon="fa-eye" onClick={() => { setSelected(d); setDetailOpen(true); }} hoverColor="#F97316" label="Voir" />
                        <ActionBtn icon="fa-trash" onClick={() => { setSelected(d); handleDelete(); }} hoverColor="#EF4444" label="Supprimer" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={detailOpen} onClose={() => { setDetailOpen(false); setSelected(null); }} title={'Dossier STEG — ' + (selected?.refSteg || '')} width={780}>
        {selected && (() => {
          const cl = getClient(selected.clientId);
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '16px 20px', background: 'var(--detail-bg)', borderRadius: 14, borderLeft: '4px solid ' + (STATUS_CONF[selected.status]?.color || '#94A3B8') }}>
                <div className="avatar" style={{ width: 56, height: 56, background: 'rgba(59,130,246,.15)' }}><i className="fa-solid fa-folder-open" style={{ color: '#3B82F6', fontSize: 20 }} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700 }}>{selected.refSteg}</span>
                    {stBadge(selected.status)}
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600 }}>{cl ? cl.name : 'Client inconnu'}</p>
                  <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{cl ? cl.address : ''} — {selected.puissance}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                {[
                  ['fa-id-card', 'CIN Client', cl?.cin],
                  ['fa-bolt', 'Puissance', selected.puissance],
                  ['fa-hashtag', 'Réf STEG', selected.refSteg],
                  ['fa-calendar', 'Créé le', new Date(selected.createdAt).toLocaleDateString('fr-FR')],
                  ['fa-paper-plane', 'Soumis le', selected.submittedDate ? new Date(selected.submittedDate).toLocaleDateString('fr-FR') : '—'],
                  ['fa-circle-check', 'Approuvé le', selected.approvedDate ? new Date(selected.approvedDate).toLocaleDateString('fr-FR') : '—'],
                ].map(([ic, l, v], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--detail-bg)', borderRadius: 10 }}>
                    <i className={'fa-solid ' + ic} style={{ color: 'var(--fg-muted)', fontSize: 12, width: 16 }} />
                    <div><p style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{l}</p><p style={{ fontSize: 13, fontWeight: 500, marginTop: 1 }}>{v || '—'}</p></div>
                  </div>
                ))}
                {selected.notes && (
                  <div style={{ gridColumn: '1 / 4', padding: '10px 12px', background: 'rgba(245,158,11,.06)', borderRadius: 10, border: '1px solid rgba(245,158,11,.15)' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#F59E0B', marginBottom: 4 }}><i className="fa-solid fa-note-sticky" style={{ fontSize: 10, marginRight: 4 }} />Notes</p>
                    <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.5 }}>{selected.notes}</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                {selected.status === 'prep' && (
                  <button className="btn-primary" onClick={() => setSubmitOpen(true)}><i className="fa-solid fa-paper-plane" />Soumettre à la STEG</button>
                )}
                {selected.status === 'validation' && (
                  <>
                    <button className="btn-success" onClick={handleApprove}><i className="fa-solid fa-check" />Approuver</button>
                    <button className="btn-danger" onClick={() => setRejectOpen(true)}><i className="fa-solid fa-xmark" />Rejeter</button>
                  </>
                )}
                {selected.status === 'approved' && (
                  <button className="btn-primary" style={{ background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)' }} onClick={() => onFacturer(selected.clientId, selected.id)}>
                    <i className="fa-solid fa-file-invoice-dollar" />Facturer ce Dossier
                  </button>
                )}
                {selected.status === 'submitted' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: 'rgba(59,130,246,.1)', color: '#3B82F6', fontSize: 13, fontWeight: 600 }}>
                    <i className="fa-solid fa-hourglass-half" />En attente de réception STEG
                  </span>
                )}
              </div>

              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <table className="data-table" style={{ margin: 0 }}>
                  <thead><tr><th style={{ width: 36 }}></th><th>Document</th><th>Description</th><th>Catégorie</th><th style={{ width: 70 }}>Statut</th></tr></thead>
                  <tbody>
                    {STEG_DOCS.map((sd, i) => {
                      const isOk = selected.docs[sd.id];
                      return (
                        <tr key={sd.id} style={{ animation: `slideUp .3s ease-out ${i * 0.02}s both` }}>
                          <td style={{ textAlign: 'center' }}>
                            <button className={'doc-check ' + (isOk ? 'ok' : '')} onClick={() => handleDocToggle(sd.id)} aria-label={isOk ? 'Non prêt' : 'Prêt'}>
                              <i className="fa-solid fa-check" style={{ fontSize: 10 }} />
                            </button>
                          </td>
                          <td style={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <i className={'fa-solid ' + sd.icon} style={{ color: 'var(--fg-muted)', fontSize: 12, width: 16 }} />{sd.label}
                          </td>
                          <td style={{ fontSize: 12, color: 'var(--fg-muted)', maxWidth: 220 }}>{sd.desc}</td>
                          <td><span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(148,163,184,.08)', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>{sd.category}</span></td>
                          <td style={{ textAlign: 'center' }}>
                            {isOk ? (
                              <span className="badge badge-doc-ok"><i className="fa-solid fa-check" style={{ fontSize: 9 }} />Prêt</span>
                            ) : (
                              <span className="badge badge-doc-pending"><i className="fa-solid fa-clock" style={{ fontSize: 9 }} />Manquant</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 16, padding: 14, background: 'var(--detail-bg)', borderRadius: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--fg-muted)', marginBottom: 10 }}>Résumé par catégorie</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {Object.entries(STEG_DOCS.reduce((acc, sd) => {
                    if (!acc[sd.category]) acc[sd.category] = [];
                    acc[sd.category].push(sd);
                    return acc;
                  }, {})).map(([cat, docs]) => {
                    const ok = docs.filter(d => selected.docs[d.id]).length;
                    return (
                      <span key={cat} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: ok === docs.length ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.12)', color: ok === docs.length ? '#10B981' : '#F59E0B', fontWeight: 600 }}>
                        {cat}: {ok}/{docs.length}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Nouveau Dossier STEG" width={520}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={LBL}>Client *</label>
            <select className="input-field" value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })}>
              <option value="">Sélectionner...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={LBL}>Réf. STEG *</label><input className="input-field" value={form.refSteg} onChange={e => setForm({ ...form, refSteg: e.target.value })} placeholder="Ex: 20082 112 5" /></div>
            <div><label style={LBL}>Puissance</label><input className="input-field" value={form.puissance} onChange={e => setForm({ ...form, puissance: e.target.value })} placeholder="Ex: 3,240 kwc" /></div>
          </div>
          <div><label style={LBL}>Notes</label><input className="input-field" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Observations..." /></div>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.5, padding: '10px 14px', background: 'rgba(59,130,246,.06)', borderRadius: 10, border: '1px solid rgba(59,130,246,.15)' }}>
            <i className="fa-solid fa-info-circle" style={{ color: '#3B82F6', marginRight: 6 }} />Les 12 documents STEG seront initialisés comme non prêts.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn-secondary" onClick={() => setCreateOpen(false)}>Annuler</button>
            <button className="btn-primary" onClick={handleCreate}><i className="fa-solid fa-folder-plus" />Créer le Dossier</button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={submitOpen} onClose={() => setSubmitOpen(false)} onConfirm={handleSubmit} title="Soumettre à la STEG" message={'Soumettre le dossier ' + (selected?.refSteg || '') + ' ?'} confirmColor="#3B82F6" />
      <ConfirmModal isOpen={rejectOpen} onClose={() => setRejectOpen(false)} onConfirm={handleReject} title="Rejeter le dossier" message={'Rejeter le dossier ' + (selected?.refSteg || '') + ' ?'} confirmColor="#EF4444" />
    </div>
  );
}
