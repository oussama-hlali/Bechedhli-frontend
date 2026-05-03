import { useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { CATEGORIES, getStockStatus, formatDA } from '../data';

const recentActivities = [
  { icon: 'fa-user-plus', color: '#10B981', text: 'Djamila Saadi ajoutée au département Commercial', time: 'Il y a 2h' },
  { icon: 'fa-box', color: '#F97316', text: '48 Panneaux 400W réceptionnés — Entrepôt A', time: 'Il y a 5h' },
  { icon: 'fa-triangle-exclamation', color: '#EF4444', text: 'Connecteurs MC4 en rupture de stock', time: 'Il y a 8h' },
  { icon: 'fa-file-invoice', color: '#3B82F6', text: 'Facture #2024-0847 validée — 2.4M DA', time: 'Hier' },
  { icon: 'fa-wrench', color: '#F59E0B', text: 'Maintenance onduleur client — Ouargla', time: 'Hier' },
];

export default function DashboardView({ employees, stock, clients }) {
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chart1 = useRef(null);
  const chart2 = useRef(null);

  const allClientOrders = useMemo(() => clients.flatMap(c => c.orders), [clients]);

  const stats = useMemo(() => {
    const activeEmp = employees.filter(e => e.status === 'active').length;
    const totalStockValue = stock.reduce((s, i) => s + i.qty * i.price, 0);
    const lowStockCount = stock.filter(i => ['low', 'empty'].includes(getStockStatus(i))).length;
    const totalCA = allClientOrders.reduce((s, o) => s + o.total, 0);
    const pendingOrders = allClientOrders.filter(o => !o.received).length;
    return { activeEmp, totalEmp: employees.length, totalStockValue, lowStockCount, totalCA, pendingOrders };
  }, [employees, stock, allClientOrders]);

  useEffect(() => {
    if (chart1.current) chart1.current.destroy();
    const ctx1 = chartRef1.current.getContext('2d');
    const g1 = ctx1.createLinearGradient(0, 0, 0, 280);
    g1.addColorStop(0, 'rgba(249,115,22,0.3)'); g1.addColorStop(1, 'rgba(249,115,22,0.0)');
    const g2 = ctx1.createLinearGradient(0, 0, 0, 280);
    g2.addColorStop(0, 'rgba(59,130,246,0.2)'); g2.addColorStop(1, 'rgba(59,130,246,0.0)');
    chart1.current = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [
          { label: 'Revenus (M DA)', data: [4.2,5.1,6.8,7.2,8.5,9.1,10.3,11.8,10.5,12.2,13.8,15.1], borderColor: '#F97316', backgroundColor: g1, fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointHoverBackgroundColor: '#F97316' },
          { label: 'Dépenses (M DA)', data: [3.1,3.8,4.5,5.0,5.8,6.2,7.0,7.5,7.2,8.0,8.5,9.2], borderColor: '#3B82F6', backgroundColor: g2, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: '#3B82F6' },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top', align: 'end', labels: { color: '#64748B', font: { family: 'DM Sans', size: 12 }, usePointStyle: true, pointStyle: 'circle', padding: 16 } } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#64748B', font: { family: 'DM Sans', size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#64748B', font: { family: 'DM Sans', size: 11 }, callback: v => v + 'M' } },
        },
        interaction: { intersect: false, mode: 'index' },
      },
    });

    if (chart2.current) chart2.current.destroy();
    const ctx2 = chartRef2.current.getContext('2d');
    const catData = CATEGORIES.map(c => stock.filter(i => i.category === c).reduce((s, i) => s + i.qty * i.price, 0));
    chart2.current = new Chart(ctx2, {
      type: 'doughnut',
      data: { labels: CATEGORIES, datasets: [{ data: catData, backgroundColor: ['#F97316','#3B82F6','#10B981','#F59E0B','#8B5CF6'], borderWidth: 0, hoverOffset: 8 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8', font: { family: 'DM Sans', size: 11 }, usePointStyle: true, pointStyle: 'circle', padding: 12 } } } },
    });

    return () => { if (chart1.current) chart1.current.destroy(); if (chart2.current) chart2.current.destroy(); };
  }, [stock]);

  const topProducts = useMemo(() => [...stock].sort((a, b) => (b.qty * b.price) - (a.qty * a.price)).slice(0, 5), [stock]);

  const statCards = [
    { label: 'Employés Actifs', value: stats.activeEmp, suffix: `/${stats.totalEmp}`, icon: 'fa-users', color: '#F97316', trend: '+2 ce mois', trendUp: true },
    { label: 'Valeur du Stock', value: (stats.totalStockValue / 1000000).toFixed(1), suffix: 'M DA', icon: 'fa-warehouse', color: '#3B82F6', trend: '+12% vs trim. préc.', trendUp: true },
    { label: 'Alertes Stock', value: stats.lowStockCount, suffix: 'produits', icon: 'fa-bell', color: '#EF4444', trend: 'Nécessite action', trendUp: false },
    { label: "Chiffre d'Affaires", value: (stats.totalCA / 1000000).toFixed(1), suffix: `M DA (${allClientOrders.length} cmd)`, icon: 'fa-chart-line', color: '#10B981', trend: `${stats.pendingOrders} en attente`, trendUp: false },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Tableau de Bord</h1>
        <p style={{ color: 'var(--fg-muted)', fontSize: 14 }}>Vue d'ensemble de l'activité Bechedhli Solar Energy</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
        {statCards.map((s, i) => (
          <div key={i} className="glass-card animate-slide-up" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden', animationDelay: `${i * 0.1}s` }}>
            <div className="stat-accent" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <p style={{ color: 'var(--fg-muted)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
                  {s.value}<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-muted)', marginLeft: 4 }}>{s.suffix}</span>
                </p>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: 16 }} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: s.trendUp ? '#10B981' : '#F59E0B', display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className={`fa-solid ${s.trendUp ? 'fa-arrow-trend-up' : 'fa-circle-info'}`} style={{ fontSize: 10 }} />{s.trend}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 28 }}>
        <div className="glass-card animate-slide-up" style={{ padding: 24, animationDelay: '0.15s' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Revenus vs Dépenses 2024</h3>
          <div style={{ height: 280 }}><canvas ref={chartRef1} /></div>
        </div>
        <div className="glass-card animate-slide-up" style={{ padding: 24, animationDelay: '0.2s' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Répartition Stock</h3>
          <div style={{ height: 280 }}><canvas ref={chartRef2} /></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="glass-card animate-slide-up" style={{ padding: 24, animationDelay: '0.25s' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Activité Récente</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentActivities.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < recentActivities.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`fa-solid ${a.icon}`} style={{ color: a.color, fontSize: 12 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 2 }}>{a.text}</p>
                  <p style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card animate-slide-up" style={{ padding: 24, animationDelay: '0.3s' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Top Produits en Valeur</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topProducts.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: i === 0 ? '#F97316' : 'var(--fg-muted)' }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.qty} unités</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#F97316', whiteSpace: 'nowrap' }}>{formatDA(p.qty * p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
