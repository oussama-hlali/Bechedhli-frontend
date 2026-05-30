const GRAPHQL_URL = '/graphql';

export async function graphqlRequest(query, variables = {}) {
    const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors) {
        const msg = json.errors.map(e => e.message).join(', ');
        throw new Error(msg);
    }
    return json.data;
}

const EMPLOYEE_FIELDS = 'id name role dept status phone email salary joinDate';
const STOCK_ITEM_FIELDS = 'id name category qty minQty price supplier location';
const CLIENT_ORDER_FIELDS = 'id items total received receivedDate orderDate';
const CLIENT_FIELDS = `id name cin phone address createdAt orders { ${CLIENT_ORDER_FIELDS} }`;
const BL_ITEM_FIELDS = 'id n des marque cat qty note';
const DELIVERY_NOTE_FIELDS = `id clientId type date status invoiced puissance refSteg transporteurName transporteurMatricule items { ${BL_ITEM_FIELDS} }`;
const STEG_FIELDS = 'id clientId refSteg puissance status createdAt submittedDate approvedDate notes docs';
const INVOICE_ITEM_FIELDS = 'id desc qty unit prix';
const PAYMENT_FIELDS = 'id date montant mode ref';
const INVOICE_FIELDS = `id clientId dossierId numBL date echeance status tva remise notes items { ${INVOICE_ITEM_FIELDS} } payments { ${PAYMENT_FIELDS} }`;

// ---------- Employees ----------
export const employeesApi = {
    getAll: () =>
        graphqlRequest(`query { employees { ${EMPLOYEE_FIELDS} } }`).then(d => d.employees),
    getById: (id) =>
        graphqlRequest(`query($id: ID!) { employee(id: $id) { ${EMPLOYEE_FIELDS} } }`, { id: String(id) }).then(d => d.employee),
    create: (data) =>
        graphqlRequest(`mutation($input: EmployeeInput!) { createEmployee(input: $input) { ${EMPLOYEE_FIELDS} } }`, { input: data }).then(d => d.createEmployee),
    update: (id, data) =>
        graphqlRequest(`mutation($id: ID!, $input: EmployeeInput!) { updateEmployee(id: $id, input: $input) { ${EMPLOYEE_FIELDS} } }`, { id: String(id), input: data }).then(d => d.updateEmployee),
    delete: (id) =>
        graphqlRequest(`mutation($id: ID!) { deleteEmployee(id: $id) }`, { id: String(id) }).then(d => d.deleteEmployee),
};

// ---------- Stock ----------
export const stockApi = {
    getAll: () =>
        graphqlRequest(`query { stockItems { ${STOCK_ITEM_FIELDS} } }`).then(d => d.stockItems),
    getById: (id) =>
        graphqlRequest(`query($id: ID!) { stockItem(id: $id) { ${STOCK_ITEM_FIELDS} } }`, { id: String(id) }).then(d => d.stockItem),
    create: (data) =>
        graphqlRequest(`mutation($input: StockItemInput!) { createStockItem(input: $input) { ${STOCK_ITEM_FIELDS} } }`, { input: data }).then(d => d.createStockItem),
    update: (id, data) =>
        graphqlRequest(`mutation($id: ID!, $input: StockItemInput!) { updateStockItem(id: $id, input: $input) { ${STOCK_ITEM_FIELDS} } }`, { id: String(id), input: data }).then(d => d.updateStockItem),
    delete: (id) =>
        graphqlRequest(`mutation($id: ID!) { deleteStockItem(id: $id) }`, { id: String(id) }).then(d => d.deleteStockItem),
};

// ---------- Clients ----------
export const clientsApi = {
    getAll: () =>
        graphqlRequest(`query { clients { ${CLIENT_FIELDS} } }`).then(d => d.clients),
    getById: (id) =>
        graphqlRequest(`query($id: ID!) { client(id: $id) { ${CLIENT_FIELDS} } }`, { id: String(id) }).then(d => d.client),
    create: (data) =>
        graphqlRequest(`mutation($input: ClientInput!) { createClient(input: $input) { ${CLIENT_FIELDS} } }`, { input: data }).then(d => d.createClient),
    update: (id, data) =>
        graphqlRequest(`mutation($id: ID!, $input: ClientInput!) { updateClient(id: $id, input: $input) { ${CLIENT_FIELDS} } }`, { id: String(id), input: data }).then(d => d.updateClient),
    delete: (id) =>
        graphqlRequest(`mutation($id: ID!) { deleteClient(id: $id) }`, { id: String(id) }).then(d => d.deleteClient),
};

// ---------- Delivery Notes ----------
export const blsApi = {
    getAll: () =>
        graphqlRequest(`query { deliveryNotes { ${DELIVERY_NOTE_FIELDS} } }`).then(d => d.deliveryNotes),
    getById: (id) =>
        graphqlRequest(`query($id: ID!) { deliveryNote(id: $id) { ${DELIVERY_NOTE_FIELDS} } }`, { id: String(id) }).then(d => d.deliveryNote),
    create: (data) => {
        const input = { ...data };
        if (input.blId) { input.id = input.blId; delete input.blId; }
        return graphqlRequest(`mutation($input: DeliveryNoteInput!) { createDeliveryNote(input: $input) { ${DELIVERY_NOTE_FIELDS} } }`, { input }).then(d => d.createDeliveryNote);
    },
    update: (id, data) => {
        const input = { ...data };
        if (input.blId) { input.id = input.blId; delete input.blId; }
        return graphqlRequest(`mutation($id: ID!, $input: DeliveryNoteInput!) { updateDeliveryNote(id: $id, input: $input) { ${DELIVERY_NOTE_FIELDS} } }`, { id: String(id), input }).then(d => d.updateDeliveryNote);
    },
    delete: (id) =>
        graphqlRequest(`mutation($id: ID!) { deleteDeliveryNote(id: $id) }`, { id: String(id) }).then(d => d.deleteDeliveryNote),
};

// ---------- STEG Dossiers ----------
export const stegApi = {
    getAll: () =>
        graphqlRequest(`query { stegDossiers { ${STEG_FIELDS} } }`).then(d => d.stegDossiers),
    getById: (id) =>
        graphqlRequest(`query($id: ID!) { stegDossier(id: $id) { ${STEG_FIELDS} } }`, { id: String(id) }).then(d => d.stegDossier),
    create: (data) =>
        graphqlRequest(`mutation($input: StegDossierInput!) { createStegDossier(input: $input) { ${STEG_FIELDS} } }`, { input: data }).then(d => d.createStegDossier),
    update: (id, data) =>
        graphqlRequest(`mutation($id: ID!, $input: StegDossierInput!) { updateStegDossier(id: $id, input: $input) { ${STEG_FIELDS} } }`, { id: String(id), input: data }).then(d => d.updateStegDossier),
    delete: (id) =>
        graphqlRequest(`mutation($id: ID!) { deleteStegDossier(id: $id) }`, { id: String(id) }).then(d => d.deleteStegDossier),
};

// ---------- Invoices ----------
export const facturesApi = {
    getAll: () =>
        graphqlRequest(`query { invoices { ${INVOICE_FIELDS} } }`).then(d => d.invoices),
    getById: (id) =>
        graphqlRequest(`query($id: ID!) { invoice(id: $id) { ${INVOICE_FIELDS} } }`, { id: String(id) }).then(d => d.invoice),
    create: (data) =>
        graphqlRequest(`mutation($input: InvoiceInput!) { createInvoice(input: $input) { ${INVOICE_FIELDS} } }`, { input: data }).then(d => d.createInvoice),
    update: (id, data) =>
        graphqlRequest(`mutation($id: ID!, $input: InvoiceInput!) { updateInvoice(id: $id, input: $input) { ${INVOICE_FIELDS} } }`, { id: String(id), input: data }).then(d => d.updateInvoice),
    delete: (id) =>
        graphqlRequest(`mutation($id: ID!) { deleteInvoice(id: $id) }`, { id: String(id) }).then(d => d.deleteInvoice),
};

// ---------- Business operations ----------
export const businessApi = {
    dashboardMetrics: () =>
        graphqlRequest(`query { dashboardMetrics { totalEmployees activeEmployees totalStockValue lowStockCount totalDeliveryNotes deliveredDeliveryNotes stegApproved stegTotal totalBilled totalCollected totalOutstanding } }`).then(d => d.dashboardMetrics),
    deliverBL: (id) =>
        graphqlRequest(`mutation($id: ID!) { deliverBL(id: $id) { ${DELIVERY_NOTE_FIELDS} } }`, { id: String(id) }).then(d => d.deliverBL),
    generateInvoiceFromBL: (blId) =>
        graphqlRequest(`mutation($blId: ID!) { generateInvoiceFromBL(blId: $blId) { ${INVOICE_FIELDS} } }`, { blId: String(blId) }).then(d => d.generateInvoiceFromBL),
};
