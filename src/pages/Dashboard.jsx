import { useState, useEffect } from 'react';
import { api } from '../services/api';
import BookingModal from '../components/BookingModal';

const roomIcons = ['🏨', '🛏️', '🏠', '🌟', '✨'];

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const result = await api.getRooms();
      if (result.rooms) {
        setRooms(result.rooms);
      } else {
        setError('Failed to load rooms');
      }
    } catch (err) {
      setError('An error occurred while loading rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    setSelectedRoom(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Loading rooms...</span>
      </div>
    );
  }

  return (
    <div>
      {showSuccess && (
        <div className="success-message">
          ✓ Booking created successfully!
        </div>
      )}
      
      <div className="hero-section">
        <h1>Find Your Perfect Stay</h1>
        <p>Choose from our selection of comfortable rooms at great prices</p>
      </div>

      <div className="page-header">
        <h1 className="page-title">Available Rooms</h1>
        <p className="page-subtitle">{rooms.length} rooms available for booking</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {rooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏨</div>
          <h3>No rooms available</h3>
          <p>Check back later for new rooms</p>
        </div>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room, index) => (
            <div key={room.id} className="room-card">
              <div className="room-image">
                <span className="room-icon">{roomIcons[index % roomIcons.length]}</span>
              </div>
              <div className="room-content">
                <h3>{room.name}</h3>
                <p className="room-description">{room.description}</p>
                <div className="room-footer">
                  <div className="room-price">
                    ${room.price_per_night} <span>/ night</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setSelectedRoom(room)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
