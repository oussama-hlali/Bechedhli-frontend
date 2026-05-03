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
  { id: 14, name: "Compteur d'Énergie Triphasé", category: 'Accessoires', qty: 15, minQty: 5, price: 12000, supplier: 'Schneider', location: 'Entrepôt B' },
  { id: 15, name: 'Panneau Solaire 330W Polycristallin', category: 'Panneaux', qty: 0, minQty: 10, price: 19500, supplier: 'Canadian Solar', location: 'Entrepôt A' },
];

export const COMPONENT_CATALOG = [
  { label: 'Panneau Solaire 400W Monocristallin', price: 28500 },
  { label: 'Panneau Solaire 550W Monocristallin', price: 38500 },
  { label: 'Panneau Solaire 330W Polycristallin', price: 19500 },
  { label: 'Onduleur Hybride 5kW', price: 95000 },
  { label: 'Onduleur Hybride 8kW', price: 135000 },
  { label: 'Onduleur On-Grid 10kW', price: 110000 },
  { label: 'Batterie Lithium 5.12kWh', price: 185000 },
  { label: 'Batterie Lithium 10.24kWh', price: 340000 },
  { label: 'Câble Solaire 4mm² (100m)', price: 12500 },
  { label: 'Câble Solaire 6mm² (100m)', price: 18000 },
  { label: 'Structure de Montage Toiture', price: 8500 },
  { label: 'Connecteur MC4 (paire)', price: 350 },
  { label: 'Disjoncteur DC 1000V 32A', price: 2800 },
  { label: 'Parafoudre DC 1000V', price: 6500 },
  { label: "Compteur d'Énergie Triphasé", price: 12000 },
];

export const INITIAL_CLIENTS = [
  { id: 1, name: 'Mohamed Benmerzoug', cin: '123456789012', phone: '+216 555 201 001', address: 'Cité 1000 Logements, Ouargla', createdAt: '2024-01-15',
    orders: [
      { id: 101, items: ['Panneau Solaire 400W Monocristallin x12', 'Onduleur Hybride 5kW x1', 'Batterie Lithium 5.12kWh x2'], total: 1124000, received: true, receivedDate: '2024-02-28', orderDate: '2024-01-20' },
      { id: 102, items: ['Structure de Montage Toiture x12', 'Câble Solaire 6mm² (100m) x5'], total: 202500, received: true, receivedDate: '2024-03-05', orderDate: '2024-01-20' },
    ] },
  { id: 2, name: 'Aïcha Djelloul', cin: '234567890123', phone: '+216 555 302 002', address: "Rue des Frères Bouadou, Ghardaïa", createdAt: '2024-02-10',
    orders: [
      { id: 201, items: ['Panneau Solaire 550W Monocristallin x16', 'Onduleur Hybride 8kW x1', 'Batterie Lithium 10.24kWh x2', 'Parafoudre DC 1000V x3'], total: 2146000, received: false, receivedDate: null, orderDate: '2024-02-15' },
    ] },
  { id: 3, name: 'Société EPI Tunisie SARL', cin: '002016045789012', phone: '+216 555 403 003', address: 'Zone Industrielle, Hassi Messaoud', createdAt: '2023-11-05',
    orders: [
      { id: 301, items: ['Panneau Solaire 400W Monocristallin x48', 'Onduleur On-Grid 10kW x4', "Compteur d'Énergie Triphasé x4"], total: 3028000, received: true, receivedDate: '2023-12-20', orderDate: '2023-11-10' },
      { id: 302, items: ['Panneau Solaire 400W Monocristallin x24', 'Onduleur Hybride 5kW x2'], total: 1606000, received: true, receivedDate: '2024-01-25', orderDate: '2023-12-15' },
      { id: 303, items: ['Batterie Lithium 5.12kWh x6', 'Disjoncteur DC 1000V 32A x12'], total: 1446000, received: false, receivedDate: null, orderDate: '2024-03-01' },
    ] },
  { id: 4, name: 'Karim Hadj-Said', cin: '345678901234', phone: '+216 555 504 004', address: 'Lot 14, Nouvelle Ville, Biskra', createdAt: '2024-03-01',
    orders: [
      { id: 401, items: ['Panneau Solaire 400W Monocristallin x8', 'Onduleur Hybride 5kW x1', 'Batterie Lithium 5.12kWh x1', 'Connecteur MC4 (paire) x20', 'Structure de Montage Toiture x8'], total: 786000, received: true, receivedDate: '2024-04-10', orderDate: '2024-03-05' },
    ] },
  { id: 5, name: 'Nadia Benmansour', cin: '456789012345', phone: '+216 555 605 005', address: 'Cité 500 Logements, El Oued', createdAt: '2024-03-20',
    orders: [
      { id: 501, items: ['Panneau Solaire 550W Monocristallin x6', 'Onduleur Hybride 5kW x1', 'Batterie Lithium 5.12kWh x1'], total: 685000, received: false, receivedDate: null, orderDate: '2024-03-25' },
    ] },
  { id: 6, name: 'Entreprise TASWIT SARL', cin: '001915078901234', phone: '+216 555 706 006', address: "Pôle d'Activité, Touggourt", createdAt: '2023-09-12',
    orders: [
      { id: 601, items: ['Panneau Solaire 400W Monocristallin x96', 'Onduleur On-Grid 10kW x8', 'Structure de Montage Toiture x96', 'Câble Solaire 4mm² (100m) x20', 'Disjoncteur DC 1000V 32A x24', 'Parafoudre DC 1000V x8', "Compteur d'Énergie Triphasé x8"], total: 7548000, received: true, receivedDate: '2023-11-30', orderDate: '2023-09-20' },
      { id: 602, items: ['Batterie Lithium 10.24kWh x8'], total: 2720000, received: true, receivedDate: '2024-01-15', orderDate: '2023-11-01' },
    ] },
  { id: 7, name: 'Rachid Mekki', cin: '567890123456', phone: '+216 555 807 007', address: 'Rue Principale, Laghouat', createdAt: '2024-04-02',
    orders: [
      { id: 701, items: ['Panneau Solaire 400W Monocristallin x6', 'Onduleur Hybride 5kW x1'], total: 421000, received: false, receivedDate: null, orderDate: '2024-04-05' },
    ] },
  { id: 8, name: 'Samira Bouzid', cin: '678901234567', phone: '+216 555 908 008', address: 'Cité Annabi, Constantine', createdAt: '2024-02-28',
    orders: [
      { id: 801, items: ['Panneau Solaire 550W Monocristallin x10', 'Onduleur Hybride 8kW x1', 'Batterie Lithium 10.24kWh x1', 'Câble Solaire 6mm² (100m) x4', 'Structure de Montage Toiture x10', 'Disjoncteur DC 1000V 32A x6', 'Parafoudre DC 1000V x2'], total: 1399200, received: true, receivedDate: '2024-04-20', orderDate: '2024-03-05' },
      { id: 802, items: ['Connecteur MC4 (paire) x30'], total: 10500, received: false, receivedDate: null, orderDate: '2024-04-22' },
    ] },
  { id: 9, name: 'Amara Energies SARL', cin: '001822069012345', phone: '+216 555 109 009', address: 'Zone Industrielle Nord, Batna', createdAt: '2024-01-08',
    orders: [
      { id: 901, items: ['Panneau Solaire 400W Monocristallin x32', 'Onduleur Hybride 8kW x2', 'Batterie Lithium 5.12kWh x4'], total: 2556000, received: true, receivedDate: '2024-02-15', orderDate: '2024-01-12' },
    ] },
  { id: 10, name: 'Yassine Khellaf', cin: '789012345678', phone: '+216 555 210 010', address: 'Lot 8, Zeribet El Oued', createdAt: '2024-04-10',
    orders: [
      { id: 1001, items: ['Panneau Solaire 330W Polycristallin x10'], total: 195000, received: false, receivedDate: null, orderDate: '2024-04-12' },
    ] },
];

export const DEPARTMENTS = ['Direction', 'Installation', 'Maintenance', 'Projets', 'Commercial', 'Finance', 'Ressources Humaines', 'Logistique', 'Stock'];
export const CATEGORIES = ['Panneaux', 'Onduleurs', 'Batteries', 'Câblage', 'Accessoires'];
export const ROLES = ['Technicien', 'Technicien Senior', 'Chef de Projet', 'Directrice Commerciale', 'Responsable RH', 'Comptable', 'Magasinier', 'Livreur', 'Assistante Direction', 'Chargée de Clientèle'];
export const LOCATIONS = ['Entrepôt A', 'Entrepôt B', 'Entrepôt C', 'Entrepôt D'];

const AVATAR_COLORS = ['#F97316','#3B82F6','#10B981','#8B5CF6','#EC4899','#06B6D4','#F59E0B','#EF4444','#6366F1','#14B8A6','#F43F5E','#84CC16'];
export const getAvatarColor = (id) => AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];
export const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
export const formatDA = (n) => new Intl.NumberFormat('fr-DZ').format(n) + ' TND';
export const getStockStatus = (item) => {
  if (item.qty === 0) return 'empty';
  if (item.qty <= item.minQty) return 'low';
  if (item.qty <= item.minQty * 1.5) return 'warning';
  return 'normal';
};
export const getClientStats = (orders) => {
  const totalOrders = orders.length;
  const received = orders.filter(o => o.received).length;
  return { totalOrders, received, pending: totalOrders - received, totalSpent: orders.reduce((s, o) => s + o.total, 0) };
};
export const CAT_ICONS = { Panneaux: 'fa-solar-panel', Onduleurs: 'fa-bolt', Batteries: 'fa-battery-three-quarters', Câblage: 'fa-plug', Accessoires: 'fa-screwdriver-wrench' };
export const CAT_COLORS = { Panneaux: '#F97316', Onduleurs: '#3B82F6', Batteries: '#10B981', Câblage: '#F59E0B', Accessoires: '#8B5CF6' };
