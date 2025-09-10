// API utility functions - removed unused axios import

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Type definitions for API data
type ApiData = Record<string, unknown>;
type ApiFilters = Record<string, string | number | boolean>;

// API utility functions
export const api = {
  // Generic request function
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  },

  // GET request
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  // POST request
  async post(endpoint: string, data: ApiData) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT request
  async put(endpoint: string, data: ApiData) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

// Specific API endpoints
export const crowdAPI = {
  getCrowdData: () => api.get('/crowd'),
  getRealTimeUpdates: () => api.get('/crowd/realtime'),
  getAnalytics: (timeframe?: string) => 
    api.get(`/crowd/analytics${timeframe ? `?timeframe=${timeframe}` : ''}`),
  getHeatmap: () => api.get('/crowd/heatmap'),
  getPredictions: () => api.get('/crowd/predictions'),
  getSurveillance: () => api.get('/crowd/surveillance'),
  updateDensity: (data: ApiData) => api.post('/crowd/update-density', data),
  simulateEmergency: (data: ApiData) => api.post('/crowd/simulate-emergency', data),
  addCrowdData: (data: ApiData) => api.post('/crowd', data),
  updateCrowdData: (id: string, data: ApiData) => api.put(`/crowd/${id}`, data),
  deleteCrowdData: (id: string) => api.delete(`/crowd/${id}`),
};

export const locationAPI = {
  getLocations: (filters?: ApiFilters) => {
    const queryParams = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : '';
    return api.get(`/locations${queryParams}`);
  },
  getLocationById: (id: string) => api.get(`/locations/${id}`),
  getLocationStats: () => api.get('/locations/stats'),
  addLocation: (data: ApiData) => api.post('/locations', data),
  updateLocation: (id: string, data: ApiData) => api.put(`/locations/${id}`, data),
  deleteLocation: (id: string) => api.delete(`/locations/${id}`),
};

export const alertAPI = {
  getAlerts: (filters?: ApiFilters) => {
    const queryParams = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : '';
    return api.get(`/alerts${queryParams}`);
  },
  createAlert: (data: ApiData) => api.post('/alerts', data),
  updateAlert: (id: string, data: ApiData) => api.put(`/alerts/${id}`, data),
  deleteAlert: (id: string) => api.delete(`/alerts/${id}`),
  getAlertStats: () => api.get('/alerts/stats'),
  executeQuickAction: (data: ApiData) => api.post('/alerts/quick-actions', data),
  getAIInsights: () => api.get('/alerts/ai-insights'),
};

export const lostFoundAPI = {
  getItems: (filters?: ApiFilters) => {
    const queryParams = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : '';
    return api.get(`/lost-found${queryParams}`);
  },
  addItem: (data: ApiData) => api.post('/lost-found', data),
  updateItem: (id: string, data: ApiData) => api.put(`/lost-found/${id}`, data),
  deleteItem: (id: string) => api.delete(`/lost-found/${id}`),
  getStats: () => api.get('/lost-found/stats'),
  getMatches: () => api.get('/lost-found/match'),
};

export const timingAPI = {
  getTimings: (filters?: ApiFilters) => {
    const queryParams = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : '';
    return api.get(`/timing${queryParams}`);
  },
  checkIn: (data: ApiData) => api.post('/timing/checkin', data),
  checkOut: (id: string) => api.put(`/timing/checkout/${id}`, {}),
  getStats: () => api.get('/timing/stats'),
  searchDevotee: (query: string) => api.get(`/timing/search/${query}`),
  addTiming: (data: ApiData) => api.post('/timing', data),
  updateTiming: (id: string, data: ApiData) => api.put(`/timing/${id}`, data),
  deleteTiming: (id: string) => api.delete(`/timing/${id}`),
};

export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data: ApiData) => api.put('/settings', data),
  getSystemStatus: () => api.get('/settings/status'),
  updateMaintenanceMode: (data: ApiData) => api.put('/settings/maintenance', data),
  resetSettings: (data: ApiData) => api.post('/settings/reset', data),
  exportConfig: () => api.get('/settings/export'),
  importConfig: (data: ApiData) => api.post('/settings/import', data),
};

export const devoteeAPI = {
  getDevotees: (filters?: ApiFilters) => {
    const queryParams = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : '';
    return api.get(`/devotees${queryParams}`);
  },
  addDevotee: (data: ApiData) => api.post('/devotees', data),
  updateDevotee: (id: string, data: ApiData) => api.put(`/devotees/${id}`, data),
  deleteDevotee: (id: string) => api.delete(`/devotees/${id}`),
  getDevoteeById: (id: string) => api.get(`/devotees/${id}`),
  getAnalytics: () => api.get('/devotees/analytics'),
};

// WebSocket connection for real-time updates
export const connectWebSocket = () => {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';
  return new WebSocket(wsUrl);
};

export default api;