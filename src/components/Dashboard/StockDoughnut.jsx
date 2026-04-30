import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StockDoughnut({ stock }) {
  const categories = ['Panneaux', 'Onduleurs', 'Batteries', 'Câblage', 'Accessoires'];
  const values = categories.map(c => stock.filter(i => i.category === c).reduce((s, i) => s + i.qty * i.price, 0));

  return (
    <div className="rounded-2xl p-6 animate-slide-up" style={{ background: 'linear-gradient(135deg, rgba(13,21,37,0.9), rgba(13,21,37,0.6))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', animationDelay: '0.2s' }}>
      <h3 className="font-display mb-5" style={{ fontSize: 15, fontWeight: 700 }}>Répartition Stock</h3>
      <div style={{ height: 280 }}>
        <Doughnut data={{ labels: categories, datasets: [{ data: values, backgroundColor: ['#F97316','#3B82F6','#10B981','#F59E0B','#8B5CF6'], borderWidth: 0, hoverOffset: 8 }] }}
          options={{ responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8', font: { family: 'DM Sans', size: 11 }, usePointStyle: true, pointStyle: 'circle', padding: 12 } } } }} />
      </div>
    </div>
  );
}