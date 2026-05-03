import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RevenueChart() {
  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      { label: 'Revenus (M TND)', data: [4.2,5.1,6.8,7.2,8.5,9.1,10.3,11.8,10.5,12.2,13.8,15.1], borderColor: '#F97316', backgroundColor: 'rgba(249,115,22,0.1)', fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6 },
      { label: 'Dépenses (M TND)', data: [3.1,3.8,4.5,5.0,5.8,6.2,7.0,7.5,7.2,8.0,8.5,9.2], borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.05)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 5 },
    ],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top', align: 'end', labels: { color: '#64748B', font: { family: 'DM Sans', size: 12 }, usePointStyle: true, pointStyle: 'circle', padding: 16 } } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#64748B', font: { family: 'DM Sans', size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#64748B', font: { family: 'DM Sans', size: 11 }, callback: v => v + 'M' } },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  return (
    <div className="rounded-2xl p-6 animate-slide-up" style={{ background: 'linear-gradient(135deg, rgba(13,21,37,0.9), rgba(13,21,37,0.6))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', animationDelay: '0.15s' }}>
      <h3 className="font-display mb-5" style={{ fontSize: 15, fontWeight: 700 }}>Revenus vs Dépenses 2024</h3>
      <div style={{ height: 280 }}><Line data={data} options={options} /></div>
    </div>
  );
}