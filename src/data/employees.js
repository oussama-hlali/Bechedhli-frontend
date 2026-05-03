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

export const DEPARTMENTS = ['Direction', 'Installation', 'Maintenance', 'Projets', 'Commercial', 'Finance', 'Ressources Humaines', 'Logistique', 'Stock'];
export const ROLES = ['Technicien', 'Technicien Senior', 'Chef de Projet', 'Directrice Commerciale', 'Responsable RH', 'Comptable', 'Magasinier', 'Livreur', 'Assistante Direction', 'Chargée de Clientèle'];

export const AVATAR_COLORS = ['#F97316','#3B82F6','#10B981','#8B5CF6','#EC4899','#06B6D4','#F59E0B','#EF4444','#6366F1','#14B8A6','#F43F5E','#84CC16'];

export function getAvatarColor(id) { return AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length]; }
export function getInitials(name) { return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(); }
export function formatDZD(n) { return new Intl.NumberFormat('fr-DZ').format(n) + ' TND'; }