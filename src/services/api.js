const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const api = {
  async auth(endpoint, data) {
    const response = await fetch(`${API_BASE}/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async getRooms() {
    const response = await fetch(`${API_BASE}/rooms`);
    return response.json();
  },

  async getBookings() {
    const response = await fetch(`${API_BASE}/bookings`, {
      headers: getHeaders()
    });
    return response.json();
  },

  async checkAvailability(roomId, startDate, endDate) {
    const response = await fetch(`${API_BASE}/bookings/check-availability`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ roomId, startDate, endDate })
    });
    return response.json();
  },

  async createBooking(roomId, startDate, endDate) {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ roomId, startDate, endDate })
    });
    return response.json();
  }
};
