import { UserPlus, Package, AlertTriangle, FileText, Wrench } from 'lucide-react';

const activities = [
  { icon: UserPlus, color: '#10B981', text: 'Djamila Saadi ajoutée au département Commercial', time: 'Il y a 2h' },
  { icon: Package, color: '#F97316', text: '48 Panneaux 400W réceptionnés — Entrepôt A', time: 'Il y a 5h' },
  { icon: AlertTriangle, color: '#EF4444', text: 'Connecteurs MC4 en rupture de stock', time: 'Il y a 8h' },
  { icon: FileText, color: '#3B82F6', text: 'Facture #2024-0847 validée — 2.4M TND', time: 'Hier' },
  { icon: Wrench, color: '#F59E0B', text: 'Maintenance onduleur client — Ouargla', time: 'Hier' },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl p-6 animate-slide-up" style={{ background: 'linear-gradient(135deg, rgba(13,21,37,0.9), rgba(13,21,37,0.6))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', animationDelay: '0.25s' }}>
      <h3 className="font-display mb-4" style={{ fontSize: 15, fontWeight: 700 }}>Activité Récente</h3>
      <div className="flex flex-col">
        {activities.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className={`flex gap-3 py-3 ${i < activities.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="shrink-0 flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: `${a.color}15` }}>
                <Icon size={12} style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] leading-relaxed">{a.text}</p>
                <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}