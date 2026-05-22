export const FACTURE_STATUS = {
  draft: { label: 'Brouillon', badge: 'badge-draft', icon: 'fa-pen', color: '#94A3B8' },
  sent: { label: 'Envoyée', badge: 'badge-sent', icon: 'fa-paper-plane', color: '#3B82F6' },
  paid: { label: 'Payée', badge: 'badge-paid', icon: 'fa-circle-check', color: '#10B981' },
  overdue: { label: 'En retard', badge: 'badge-overdue', icon: 'fa-clock', color: '#EF4444' },
  partial: { label: 'Partiel', badge: 'badge-partial', icon: 'fa-hourglass-half', color: '#F59E0B' },
};

export const INITIAL_FACTURES = [
  { id: 'FAC-2024-001', clientId: 1, dossierId: 1, numBL: 'BL-2024-040', date: '2024-03-01', echeance: '2024-04-01', status: 'paid', items: [{ desc: 'Installation panneaux solaires 3,240 kwc', qty: 1, unit: 'forfait', prix: 850000 }, { desc: 'Fourniture et pose structure aluminium toiture', qty: 1, unit: 'forfait', prix: 120000 }, { desc: "Dossier de raccordement STEG complet", qty: 1, unit: 'forfait', prix: 45000 }, { desc: "Déplacement et main d'œuvre technicien", qty: 3, unit: 'jour', prix: 15000 }, { desc: 'Câblage DC/AC et accessoires de connexion', qty: 1, unit: 'forfait', prix: 35000 }], tva: 19, remise: 5, payments: [{ date: '2024-03-15', montant: 600000, mode: 'Virement bancaire', ref: 'VIR-2024-0891' }, { date: '2024-03-28', montant: 453690, mode: 'Espèces', ref: '' }], notes: 'Installation terminée et validée STEG le 28/02/2024. Remise de 5% accordée pour paiement anticipé.' },
  { id: 'FAC-2024-002', clientId: 3, dossierId: 2, numBL: 'BL-2024-039', date: '2024-04-10', echeance: '2024-05-10', status: 'partial', items: [{ desc: 'Installation panneaux solaires 9,720 kwc (Triphasé)', qty: 1, unit: 'forfait', prix: 2200000 }, { desc: 'Structure aluminium toiture 12 panneaux', qty: 1, unit: 'forfait', prix: 180000 }, { desc: 'Câblage triphasé et protections DC/AC', qty: 1, unit: 'forfait', prix: 95000 }, { desc: 'Dossier STEG triphasé', qty: 1, unit: 'forfait', prix: 65000 }, { desc: "Main d'œuvre installation (5 jours)", qty: 5, unit: 'jour', prix: 18000 }], tva: 19, remise: 0, payments: [{ date: '2024-04-20', montant: 1500000, mode: 'Virement bancaire', ref: 'VIR-2024-1024' }], notes: 'Premier versement reçu. Solde à régler avant le 10/05/2024.' },
  { id: 'FAC-2024-003', clientId: 1, dossierId: 4, numBL: '', date: '2024-06-01', echeance: '2024-07-01', status: 'sent', items: [{ desc: 'Installation panneaux solaires 2,160 kwc', qty: 1, unit: 'forfait', prix: 620000 }, { desc: 'Structure aluminium toiture', qty: 1, unit: 'forfait', prix: 85000 }, { desc: 'Dossier STEG monophasé', qty: 1, unit: 'forfait', prix: 40000 }], tva: 19, remise: 0, payments: [], notes: 'Facture envoyée en attente de confirmation client.' },
  { id: 'FAC-2024-004', clientId: 2, dossierId: 3, numBL: 'BL-2024-041', date: '2024-03-20', echeance: '2024-03-25', status: 'overdue', items: [{ desc: 'Étude technique et dimensionnement 6,480 kwc', qty: 1, unit: 'forfait', prix: 80000 }, { desc: 'Déplacement technicien pour diagnostic', qty: 2, unit: 'jour', prix: 15000 }], tva: 19, remise: 0, payments: [], notes: "Facture d'étude en retard de paiement depuis le 25/03/2024." },
];

export function calcFacture(f) {
  const ht = f.items.reduce((s, i) => s + i.qty * i.prix, 0);
  const rem = ht * (f.remise / 100);
  const htNet = ht - rem;
  const tva = htNet * (f.tva / 100);
  const ttc = htNet + tva;
  const paid = f.payments.reduce((s, p) => s + p.montant, 0);
  return { ht, remise: rem, htNet, tva, ttc, paid, reste: ttc - paid };
}

export function printFacture(fac, client, logoUrl) {
  const c = calcFacture(fac);
  const fmt = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' TND';
  const w = window.open('', '_blank', 'width=800,height=1000');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Facture ${fac.id}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;padding:40px;font-size:13px;line-height:1.5}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;border-bottom:3px solid #F97316;padding-bottom:20px}
    .logo{display:flex;align-items:center;gap:14px}.logo img{width:60px;height:auto}.logo-text h1{font-size:22px;color:#F97316;margin-bottom:2px}.logo-text p{font-size:11px;color:#666}
    .fac-info{text-align:right}.fac-info h2{font-size:20px;margin-bottom:4px}.fac-info p{font-size:12px;color:#666}
    .parties{display:flex;justify-content:space-between;margin-bottom:30px;gap:40px}
    .party{flex:1;padding:16px;background:#f8f9fa;border-radius:8px}.party h3{font-size:11px;text-transform:uppercase;color:#888;letter-spacing:1px;margin-bottom:8px}.party p{margin-bottom:2px}
    .table{width:100%;border-collapse:collapse;margin-bottom:20px}.table th{background:#f1f5f9;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#555;border-bottom:2px solid #e2e8f0}.table td{padding:10px 12px;border-bottom:1px solid #f1f5f9}.table tr:nth-child(even){background:#fafbfc}.text-right{text-align:right}.text-center{text-align:center}
    .totals{width:280px;margin-left:auto}.totals .row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px}.totals .row.grand{font-size:15px;font-weight:700;border-top:2px solid #1a1a1a;padding-top:10px;margin-top:4px}
    .payments{margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0}.payments h3{font-size:12px;color:#166534;margin-bottom:8px}
    .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:10px;color:#999}
    @media print{body{padding:20px}}</style></head><body>
    <div class="header"><div class="logo">${logoUrl ? '<img src="' + logoUrl + '" alt="Logo" />' : ''}<div class="logo-text"><h1>BECHEDHLI SOLAR ENERGY</h1><p>Spécialiste en énergie solaire photovoltaïque<br>Ouargla, Algérie</p></div></div>
    <div class="fac-info"><h2>FACTURE</h2><p><strong>${fac.id}</strong></p><p>Date : ${new Date(fac.date).toLocaleDateString('fr-FR')}</p><p>Échéance : ${new Date(fac.echeance).toLocaleDateString('fr-FR')}</p></div></div>
    <div class="parties"><div class="party"><h3>Émetteur</h3><p><strong>Bechedhli Solar Energy</strong></p><p>Ouargla, Algérie</p><p>Tél : +213 555 000 000</p><p>NIF : 000000000000000</p></div>
    <div class="party"><h3>Client</h3><p><strong>${client ? client.name : '—'}</strong></p><p>${client ? client.address : ''}</p><p>CIN : ${client ? client.cin : '—'}</p><p>Tél : ${client ? client.phone : ''}</p></div></div>
    ${fac.numBL ? '<p style="margin-bottom:16px;font-size:12px;color:#666">Réf. Bon de Livraison : <strong>' + fac.numBL + '</strong></p>' : ''}
    <table class="table"><thead><tr><th>N°</th><th>Désignation</th><th class="text-center">Qté</th><th>Unité</th><th class="text-right">Prix unitaire</th><th class="text-right">Montant</th></tr></thead><tbody>
    ${fac.items.map((it, i) => '<tr><td>' + (i + 1) + '</td><td>' + it.desc + '</td><td class="text-center">' + it.qty + '</td><td>' + it.unit + '</td><td class="text-right">' + fmt(it.prix) + '</td><td class="text-right">' + fmt(it.qty * it.prix) + '</td></tr>').join('')}
    </tbody></table>
    <div class="totals"><div class="row"><span>Total HT</span><span>${fmt(c.ht)}</span></div>
    ${fac.remise > 0 ? '<div class="row" style="color:#10B981"><span>Remise (' + fac.remise + '%)</span><span>- ' + fmt(c.remise) + '</span></div>' : ''}
    <div class="row"><span>HT Net</span><span>${fmt(c.htNet)}</span></div>
    <div class="row"><span>TVA (' + fac.tva + '%)</span><span>${fmt(c.tva)}</span></div>
    <div class="row grand"><span>TOTAL TTC</span><span>${fmt(c.ttc)}</span></div></div>
    ${fac.payments.length > 0 ? '<div class="payments"><h3>Paiements reçus (' + fmt(c.paid) + ')</h3>' + fac.payments.map(p => '<p style="margin-bottom:4px;font-size:12px">' + new Date(p.date).toLocaleDateString('fr-FR') + ' — ' + p.mode + ' — <strong>' + fmt(p.montant) + '</strong>' + (p.ref ? ' (Réf: ' + p.ref + ')' : '') + '</p>').join('') + (c.reste > 0 ? '<p style="margin-top:8px;font-weight:700;color:#b45309;font-size:13px">Reste à payer : ' + fmt(c.reste) + '</p>' : '<p style="margin-top:8px;font-weight:700;color:#166534;font-size:13px">Soldée</p>') + '</div>' : ''}
    ${fac.notes ? '<div style="margin-top:20px;padding:14px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;font-size:12px"><strong style="color:#92400e">Notes :</strong> ' + fac.notes + '</div>' : ''}
    <div class="footer"><span>Bechedhli Solar Energy — Ouargla, Algérie</span><span>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</span></div>
    <script>setTimeout(() => window.print(), 400)<\/script></body></html>`);
  w.document.close();
}
