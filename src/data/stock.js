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

export const CATEGORIES = ['Panneaux', 'Onduleurs', 'Batteries', 'Câblage', 'Accessoires'];
export const LOCATIONS = ['Entrepôt A', 'Entrepôt B', 'Entrepôt C', 'Entrepôt D'];

export function getStockStatus(item) {
  if (item.qty === 0) return 'empty';
  if (item.qty <= item.minQty) return 'low';
  if (item.qty <= item.minQty * 1.5) return 'warning';
  return 'normal';
}

export const CAT_META = {
  'Panneaux':   { icon: 'SolarPanel',  color: '#F97316' },
  'Onduleurs':  { icon: 'Zap',          color: '#3B82F6' },
  'Batteries':  { icon: 'Battery',      color: '#10B981' },
  'Câblage':    { icon: 'Cable',        color: '#F59E0B' },
  'Accessoires':{ icon: 'Wrench',       color: '#8B5CF6' },
};