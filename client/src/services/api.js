const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.errors = data?.errors;
    throw error;
  }

  return data;
}

export const api = {
  async getLeads(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });

    const url = `${BASE_URL}/api/leads${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  async getLeadById(id) {
    const response = await fetch(`${BASE_URL}/api/leads/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  async createLead(leadData) {
    const response = await fetch(`${BASE_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    return handleResponse(response);
  },

  async updateLead(id, leadData) {
    const response = await fetch(`${BASE_URL}/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    return handleResponse(response);
  },

  async updateLeadStatus(id, status) {
    const response = await fetch(`${BASE_URL}/api/leads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  async deleteLead(id) {
    const response = await fetch(`${BASE_URL}/api/leads/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  async getDashboardStats() {
    const response = await fetch(`${BASE_URL}/api/dashboard/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },

  async checkHealth() {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  }
};
