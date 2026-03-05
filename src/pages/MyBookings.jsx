import { useState, useEffect } from 'react';
import { api } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const result = await api.getBookings();
      if (result.bookings) {
        setBookings(result.bookings);
      } else {
        setError('Failed to load bookings');
      }
    } catch (err) {
      setError('An error occurred while loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotal = (startDate, endDate, price) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return (nights * price).toFixed(2);
  };

  const getNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Loading your bookings...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">View and manage your room reservations</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No bookings yet</h3>
          <p>Start exploring our rooms and make your first reservation!</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-info">
                <h3>{booking.room_name}</h3>
                <div className="booking-dates">
                  <span>📅</span>
                  {formatDate(booking.start_date)} — {formatDate(booking.end_date)}
                </div>
                <div className="booking-meta">
                  <span className="booking-price">
                    ${calculateTotal(booking.start_date, booking.end_date, booking.price_per_night)}
                  </span>
                  <span className="booking-status">Confirmed</span>
                </div>
              </div>
              <div className="booking-timestamp">
                Booked on {formatDate(booking.created_at)} • {getNights(booking.start_date, booking.end_date)} night{getNights(booking.start_date, booking.end_date) > 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
