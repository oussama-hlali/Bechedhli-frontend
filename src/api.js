const API_BASE = '/api';

async function request(url, options = {}) {
    const res = await fetch(`${API_BASE}${url}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

export const employeesApi = {
    getAll: () => request('/employees'),
    getById: (id) => request(`/employees/${id}`),
    create: (data) => request('/employees', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/employees/${id}`, { method: 'DELETE' }),
};

export const stockApi = {
    getAll: () => request('/stock'),
    getById: (id) => request(`/stock/${id}`),
    create: (data) => request('/stock', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/stock/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/stock/${id}`, { method: 'DELETE' }),
};

export const clientsApi = {
    getAll: () => request('/clients'),
    getById: (id) => request(`/clients/${id}`),
    create: (data) => request('/clients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/clients/${id}`, { method: 'DELETE' }),
};

export const blsApi = {
    getAll: () => request('/bls'),
    getById: (id) => request(`/bls/${id}`),
    create: (data) => request('/bls', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/bls/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/bls/${id}`, { method: 'DELETE' }),
};

export const stegApi = {
    getAll: () => request('/steg'),
    getById: (id) => request(`/steg/${id}`),
    create: (data) => request('/steg', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/steg/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/steg/${id}`, { method: 'DELETE' }),
};

export const facturesApi = {
    getAll: () => request('/factures'),
    getById: (id) => request(`/factures/${id}`),
    create: (data) => request('/factures', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/factures/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/factures/${id}`, { method: 'DELETE' }),
};
