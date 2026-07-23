import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar-top">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-logo">T</div>
          <span className="brand-text">TMS</span>
        </Link>

        <div className={`nav-links-wrapper ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-group">
            <Link to="/complaints/new" className={`navbar-link ${isActive('/complaints/new') ? 'active' : ''}`} onClick={closeMenu}>
              Raise Complaint
            </Link>
            {user?.role !== 'SuperAdmin' && (
              <Link to="/my-complaints" className={`navbar-link ${isActive('/my-complaints') ? 'active' : ''}`} onClick={closeMenu}>
                My Complaints
              </Link>
            )}
            {user?.role === 'SuperAdmin' && (
              <>
                <Link to="/departments" className={`navbar-link ${isActive('/departments') ? 'active' : ''}`} onClick={closeMenu}>
                  Departments
                </Link>
                <Link to="/programmes" className={`navbar-link ${isActive('/programmes') ? 'active' : ''}`} onClick={closeMenu}>
                  Programmes
                </Link>
                <Link to="/blocks" className={`navbar-link ${isActive('/blocks') ? 'active' : ''}`} onClick={closeMenu}>
                  Blocks
                </Link>
                <Link to="/rooms" className={`navbar-link ${isActive('/rooms') ? 'active' : ''}`} onClick={closeMenu}>
                  Rooms
                </Link>
                <Link to="/users" className={`navbar-link ${isActive('/users') ? 'active' : ''}`} onClick={closeMenu}>
                  Users
                </Link>
                <Link to="/roles" className={`navbar-link ${isActive('/roles') ? 'active' : ''}`} onClick={closeMenu}>
                  Roles
                </Link>
                <Link to="/complaints" className={`navbar-link ${isActive('/complaints') ? 'active' : ''}`} onClick={closeMenu}>
                  All Complaints
                </Link>
                <Link to="/reports" className={`navbar-link ${isActive('/reports') ? 'active' : ''}`} onClick={closeMenu}>
                  Reports
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="navbar-user-actions">
          <div className="user-profile-sm">
            <span className="user-initial">{user?.username?.[0] || 'U'}</span>
            <span className="user-name-text">{user?.username}</span>
          </div>
          <button onClick={handleLogout} className="top-logout-btn">
            Logout
          </button>

          <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
