import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Room Booking</Link>
      {user ? (
        <div className="navbar-links">
          <Link to="/">Dashboard</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <div className="navbar-user">
            <span>Welcome, <strong>{user.name}</strong></span>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
