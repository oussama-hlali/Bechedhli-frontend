// ============================================================
// MOCK DATA
// ============================================================

export const INITIAL_EMPLOYEES = [
  { id: 1, name: 'Ahmed Benali', role: 'Technicien Senior', dept: 'Installation', status: 'active', phone: '+216 555 123 456', email: 'a.benali@bechedhli.tn', salary: 95000, joinDate: '2022-03-15' },
  { id: 2, name: 'Fatima Zohra Mebarki', role: 'Directrice Commerciale', dept: 'Direction', status: 'active', phone: '+216 555 234 567', email: 'f.mebarki@bechedhli.tn', salary: 180000, joinDate: '2020-01-10' },
  { id: 3, name: 'Karim Bouzid', role: 'Chef de Projet', dept: 'Projets', status: 'active', phone: '+216 555 345 678', email: 'k.bouzid@bechedhli.tn', salary: 130000, joinDate: '2021-06-22' },
  { id: 4, name: 'Nadia Cherif', role: 'Responsable RH', dept: 'Ressources Humaines', status: 'active', phone: '+216 555 456 789', email: 'n.cherif@bechedhli.tn', salary: 120000, joinDate: '2021-02-08' },
  { id: 5, name: 'Youcef Hamidi', role: 'Technicien', dept: 'Installation', status: 'active', phone: '+216 555 567 890', email: 'y.hamidi@bechedhli.tn', salary: 75000, joinDate: '2023-01-20' },
  { id: 6, name: 'Sara Amrani', role: 'Comptable', dept: 'Finance', status: 'active', phone: '+216 555 678 901', email: 's.amrani@bechedhli.tn', salary: 85000, joinDate: '2022-09-05' },
  { id: 7, name: 'Mourad Taleb', role: 'Magasinier', dept: 'Stock', status: 'active', phone: '+216 555 789 012', email: 'm.taleb@bechedhli.tn', salary: 65000, joinDate: '2023-04-12' },
  { id: 8, name: 'Amina Ziani', role: 'Technicienne', dept: 'Maintenance', status: 'leave', phone: '+216 555 890 123', email: 'a.ziani@bechedhli.tn', salary: 80000, joinDate: '2022-11-30' },
  { id: 9, name: 'Rachid Khelil', role: 'Livreur', dept: 'Logistique', status: 'active', phone: '+216 555 901 234', email: 'r.khelil@bechedhli.tn', salary: 60000, joinDate: '2023-07-01' },
  { id: 10, name: 'Leila Boudiaf', role: 'Assistante Direction', dept: 'Direction', status: 'active', phone: '+216 555 012 345', email: 'l.boudiaf@bechedhli.tn', salary: 70000, joinDate: '2022-05-18' },
  { id: 11, name: 'Omar Fekhar', role: 'Technicien', dept: 'Installation', status: 'inactive', phone: '+216 555 111 222', email: 'o.fekhar@bechedhli.tn', salary: 75000, joinDate: '2021-08-14' },
  { id: 12, name: 'Djamila Saadi', role: 'Chargée de Clientèle', dept: 'Commercial', status: 'active', phone: '+216 555 333 444', email: 'd.saadi@bechedhli.tn', salary: 90000, joinDate: '2023-02-28' },
];

export const INITIAL_STOCK = [
  { id: 1, name: 'Panneau Solaire 400W Monocristallin', category: 'Panneaux', qty: 148, minQty: 20, price: 28500, supplier: 'Jinko Solar', location: 'Entrepôt A' },
  { id: 2, name: 'Panneau Solaire 550W Monocristallin', category: 'Panneaux', qty: 64, minQty: 15, price: 38500, supplier: 'Longi Solar', location: 'Entrepôt A' },
  { id: 3, name: 'Onduleur Hybride 5kW', category: 'Onduleurs', qty: 7, minQty: 10, price: 95000, supplier: 'Growatt', location: 'Entrepôt B' },
  { id: 4, name: 'Onduleur Hybride 8kW', category: 'Onduleurs', qty: 12, minQty: 8, price: 135000, supplier: 'Huawei', location: 'Entrepôt B' },
  { id: 5, name: 'Onduleur On-Grid 10kW', category: 'Onduleurs', qty: 5, minQty: 5, price: 110000, supplier: 'SMA', location: 'Entrepôt B' },
  { id: 6, name: 'Batterie Lithium 5.12kWh', category: 'Batteries', qty: 18, minQty: 10, price: 185000, supplier: 'Pylontech', location: 'Entrepôt C' },
  { id: 7, name: 'Batterie Lithium 10.24kWh', category: 'Batteries', qty: 4, minQty: 5, price: 340000, supplier: 'Pylontech', location: 'Entrepôt C' },
  { id: 8, name: 'Câble Solaire 4mm² (100m)', category: 'Câblage', qty: 35, minQty: 10, price: 12500, supplier: 'Loccab', location: 'Entrepôt A' },
  { id: 9, name: 'Câble Solaire 6mm² (100m)', category: 'Câblage', qty: 22, minQty: 8, price: 18000, supplier: 'Loccab', location: 'Entrepôt A' },
  { id: 10, name: 'Structure de Montage Toiture', category: 'Accessoires', qty: 30, minQty: 15, price: 8500, supplier: 'Aluminium du Sud', location: 'Entrepôt D' },
  { id: 11, name: 'Connecteur MC4 (paire)', category: 'Accessoires', qty: 3, minQty: 50, price: 350, supplier: 'Stäubli', location: 'Entrepôt D' },
  { id: 12, name: 'Disjoncteur DC 1000V 32A', category: 'Accessoires', qty: 45, minQty: 20, price: 2800, supplier: 'Schneider', location: 'Entrepôt D' },
  { id: 13, name: 'Parafoudre DC 1000V', category: 'Accessoires', qty: 2, minQty: 10, price: 6500, supplier: 'Citel', location: 'Entrepôt D' },
  { id: 14, name: 'Compteur d\'Énergie Triphasé', category: 'Accessoires', qty: 15, minQty: 5, price: 12000, supplier: 'Schneider', location: 'Entrepôt B' },
  { id: 15, name: 'Panneau Solaire 330W Polycristallin', category: 'Panneaux', qty: 0, minQty: 10, price: 19500, supplier: 'Canadian Solar', location: 'Entrepôt A' },
];

export const DEPARTMENTS = ['Direction', 'Installation', 'Maintenance', 'Projets', 'Commercial', 'Finance', 'Ressources Humaines', 'Logistique', 'Stock'];
export const CATEGORIES = ['Panneaux', 'Onduleurs', 'Batteries', 'Câblage', 'Accessoires'];
export const ROLES = ['Technicien', 'Technicien Senior', 'Chef de Projet', 'Directrice Commerciale', 'Responsable RH', 'Comptable', 'Magasinier', 'Livreur', 'Assistante Direction', 'Chargée de Clientèle'];
export const LOCATIONS = ['Entrepôt A', 'Entrepôt B', 'Entrepôt C', 'Entrepôt D'];

// ============================================================
// UTILITIES
// ============================================================

const AVATAR_COLORS = ['#F97316','#3B82F6','#10B981','#8B5CF6','#EC4899','#06B6D4','#F59E0B','#EF4444','#6366F1','#14B8A6','#F43F5E','#84CC16'];

export function getAvatarColor(id) {
  return AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];
}

export function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function formatTND(n) {
  return new Intl.NumberFormat('fr-TN').format(n) + ' TND';
}

export function getStockStatus(item) {
  if (item.qty === 0) return 'empty';
  if (item.qty <= item.minQty) return 'low';
  if (item.qty <= item.minQty * 1.5) return 'warning';
  return 'normal';
}

export const CAT_ICONS = {
  Panneaux: 'fa-solar-panel',
  Onduleurs: 'fa-bolt',
  Batteries: 'fa-battery-three-quarters',
  Câblage: 'fa-plug',
  Accessoires: 'fa-screwdriver-wrench',
};

export const CAT_COLORS = {
  Panneaux: '#F97316',
  Onduleurs: '#3B82F6',
  Batteries: '#10B981',
  Câblage: '#F59E0B',
  Accessoires: '#8B5CF6',
};
