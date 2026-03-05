import { useState } from 'react';
import { api } from '../services/api';

const BookingModal = ({ room, onClose, onSuccess }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleCheckAvailability = async () => {
    if (!startDate || !endDate) {
      setError('Please select both check-in and check-out dates');
      return;
    }

    setChecking(true);
    setError('');

    try {
      const result = await api.checkAvailability(room.id, startDate, endDate);
      
      if (result.available) {
        const bookingResult = await api.createBooking(room.id, startDate, endDate);
        
        if (bookingResult.error) {
          setError(bookingResult.error);
        } else {
          onSuccess();
        }
      } else {
        setError('Room is not available for the selected dates. Please choose different dates.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return (nights * room.price_per_night).toFixed(2);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book {room.name}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Check-in Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={today}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Check-out Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || today}
              required
            />
          </div>

          <div className="modal-price">
            ${calculateTotal() || room.price_per_night} 
            <span>
              {calculateNights() > 0 
                ? ` (${calculateNights()} night${calculateNights() > 1 ? 's' : ''})` 
                : ' / night'}
            </span>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCheckAvailability}
            disabled={checking || !startDate || !endDate}
          >
            {checking ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
