export const STATUS_CONF = {
  prep: { label: 'En préparation', badge: 'badge-prep', icon: 'fa-pen-ruler', color: '#94A3B8' },
  submitted: { label: 'Soumis', badge: 'badge-submitted', icon: 'fa-paper-plane', color: '#3B82F6' },
  validation: { label: 'En validation', badge: 'badge-validation', icon: 'fa-hourglass-half', color: '#F59E0B' },
  approved: { label: 'Approuvé', badge: 'badge-approved', icon: 'fa-circle-check', color: '#10B981' },
  rejected: { label: 'Rejeté', badge: 'badge-rejected', icon: 'fa-circle-xmark', color: '#EF4444' },
};

export const STEG_DOCS = [
  { id: 'demande', label: "Demande de raccordement STEG", icon: 'fa-file-signature', desc: 'Formulaire officiel de demande signé par le client', category: 'Administratif' },
  { id: 'attestation_install', label: "Attestation d'installation", icon: 'fa-certificate', desc: "Certificat d'installation réalisé par le technicien responsable", category: 'Installation' },
  { id: 'rapport_essai', label: "Rapport d'essai et de mise en service", icon: 'fa-flask', desc: 'Résultats des tests de performance et mise en service', category: 'Technique' },
  { id: 'schema_uni', label: 'Schéma unifilaire', icon: 'fa-diagram-project', desc: "Schéma électrique unifilaire de l'installation", category: 'Technique' },
  { id: 'plan_implant', label: "Plan d'implantation", icon: 'fa-map', desc: 'Plan de positionnement des panneaux et équipements', category: 'Technique' },
  { id: 'photos_avant_apres', label: 'Photos avant / après', icon: 'fa-camera', desc: 'Photographies du site avant et après installation', category: 'Photos' },
  { id: 'conformite', label: 'Attestation de conformité', icon: 'fa-shield-halved', desc: 'Certificat de conformité aux normes en vigueur', category: 'Certificat' },
  { id: 'fiche_technique', label: "Fiche technique de l'installation", icon: 'fa-clipboard-list', desc: 'Détail technique complet des équipements installés', category: 'Technique' },
  { id: 'cert_onduleur', label: 'Certificat fabricant onduleur', icon: 'fa-bolt', desc: "Certificat d'authenticité du fabricant de l'onduleur", category: 'Certificat' },
  { id: 'mise_en_service', label: 'Procès-verbal de mise en service', icon: 'fa-play-circle', desc: 'PV de mise en service signé par toutes les parties', category: 'Technique' },
  { id: 'contrat_signe', label: 'Contrat de raccordement signé', icon: 'fa-file-contract', desc: 'Contrat de raccordement signé par le client', category: 'Administratif' },
  { id: 'facture_finale', label: 'Facture finale client', icon: 'fa-receipt', desc: 'Facture de régularisation après raccordement', category: 'Financier' },
];

export const INITIAL_STEG_DOSSIERS = [
  { id: 1, clientId: 1, refSteg: '20081 289 0', puissance: '3,240 kwc', status: 'approved', createdAt: '2024-01-22', submittedDate: '2024-02-05', approvedDate: '2024-02-28', notes: 'Dossier complet approuvé en 23 jours', docs: { demande: true, attestation_install: true, rapport_essai: true, schema_uni: true, plan_implant: true, photos_avant_apres: true, conformite: true, fiche_technique: true, cert_onduleur: true, mise_en_service: true, contrat_signe: true, facture_finale: true } },
  { id: 2, clientId: 3, refSteg: '20082 001 7', puissance: '9,720 kwc', status: 'validation', createdAt: '2024-01-10', submittedDate: '2024-02-20', approvedDate: null, notes: 'En cours de validation STEG', docs: { demande: true, attestation_install: true, rapport_essai: true, schema_uni: true, plan_implant: true, photos_avant_apres: true, conformite: false, fiche_technique: true, cert_onduleur: true, mise_en_service: false, contrat_signe: true, facture_finale: false } },
  { id: 3, clientId: 2, refSteg: '20081 305 2', puissance: '6,480 kwc', status: 'submitted', createdAt: '2024-03-15', submittedDate: '2024-04-01', approvedDate: null, notes: 'Soumis au guichet STEG', docs: { demande: true, attestation_install: true, rapport_essai: true, schema_uni: true, plan_implant: false, photos_avant_apres: true, conformite: false, fiche_technique: true, cert_onduleur: true, mise_en_service: false, contrat_signe: false, facture_finale: false } },
  { id: 4, clientId: 1, refSteg: '20082 112 5', puissance: '2,160 kwc', status: 'prep', createdAt: '2024-05-10', submittedDate: null, approvedDate: null, notes: 'Nouvelle installation en préparation', docs: { demande: false, attestation_install: false, rapport_essai: false, schema_uni: false, plan_implant: false, photos_avant_apres: false, conformite: false, fiche_technique: false, cert_onduleur: false, mise_en_service: false, contrat_signe: false, facture_finale: false } },
];

export function docProgress(docs) {
  const vals = Object.values(docs);
  const ok = vals.filter(Boolean).length;
  return { ok, total: vals.length, pct: vals.length > 0 ? Math.round(ok / vals.length * 100) : 0 };
}
