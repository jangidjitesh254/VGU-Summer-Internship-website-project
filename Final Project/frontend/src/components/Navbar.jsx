import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/dashboard') {
      navigate(`/dashboard?search=${encodeURIComponent(searchTerm)}`);
    }
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (location.pathname === '/dashboard' && onSearch) {
      onSearch(val);
    }
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    alert('Logged out successfully.');
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (!user) return 'Student';
    if (user.firstName && user.firstName.trim()) {
      return `${user.firstName} ${user.lastName || ''}`.trim();
    }
    if (user.email) {
      const nameFromEmail = user.email.split('@')[0];
      return nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    }
    return 'Student';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg sticky-top py-2.5">
      <div className="container-fluid px-lg-5">
        <Link className="navbar-brand fw-bold fs-3 d-flex align-items-center gap-2 me-lg-3" to="/">
          <i className="bi bi-recycle text-success fs-2"></i>
          <span className="navbar-brand-gradient">ReUse</span>
        </Link>

        {/* Global Search bar */}
        <form className="d-flex my-2 my-lg-0 mx-lg-3 flex-grow-1" style={{ maxWidth: '360px' }} onSubmit={handleSearchSubmit}>
          <div className="input-group">
            <input
              className="form-control bg-dark text-white border-secondary ps-3"
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ borderRadius: '10px 0 0 10px' }}
            />
            <button className="btn btn-solid-success px-3" type="submit" style={{ borderRadius: '0 10px 10px 0' }}>
              <i className="bi bi-search"></i>
            </button>
          </div>
        </form>

        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2 my-2 my-lg-0">
            <li className="nav-item">
              <Link className={`nav-link custom-nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link custom-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} to="/dashboard">
                <i className="bi bi-grid me-1"></i> Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link custom-nav-link ${location.pathname === '/messages' ? 'active' : ''}`} to="/messages">
                <i className="bi bi-chat-dots me-1"></i> Inbox
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link custom-nav-link ${location.pathname === '/orders' ? 'active' : ''}`} to="/orders">
                <i className="bi bi-shield-check me-1"></i> My Orders
              </Link>
            </li>

            {/* Sell Item button - Solid color, no gradient, no + icon */}
            <li className="nav-item ms-lg-2 my-1 my-lg-0">
              <Link to="/add-product" className="btn btn-solid-success fw-bold d-inline-flex align-items-center justify-content-center px-3.5 py-2 w-100 w-lg-auto">
                Sell Item
              </Link>
            </li>

            {user ? (
              <li className="nav-item dropdown ms-lg-2 my-1 my-lg-0 position-relative" ref={dropdownRef}>
                <button
                  className="btn btn-outline-light rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 fw-semibold w-100 w-lg-auto justify-content-center"
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  aria-expanded={showDropdown}
                >
                  <i className="bi bi-person-circle fs-5 text-success"></i>
                  <span>Account</span>
                  <i className={`bi bi-chevron-${showDropdown ? 'up' : 'down'} small ms-1`}></i>
                </button>

                {showDropdown && (
                  <ul
                    className="dropdown-menu dropdown-menu-end dropdown-menu-dark show shadow-xl border border-secondary border-opacity-25 rounded-3 p-2 mt-2 position-absolute"
                    style={{ right: 0, top: '100%', minWidth: '240px', zIndex: 1050 }}
                  >
                    <li className="px-3 py-2.5 bg-secondary bg-opacity-20 rounded-2 mb-2">
                      <div className="fw-bold text-white fs-6 mb-1">{getUserDisplayName()}</div>
                      <div className="text-success small text-truncate fw-medium" title={user.email}>
                        <i className="bi bi-envelope-fill me-1"></i>{user.email || 'Registered User'}
                      </div>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2"
                        to="/messages"
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="bi bi-chat-dots text-success"></i> Campus Inbox
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2"
                        to="/orders"
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="bi bi-shield-check text-success"></i> My Orders & Escrow
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item rounded-2 d-flex align-items-center gap-2 py-2"
                        to="/add-product"
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="bi bi-tag text-success"></i> Sell an Item
                      </Link>
                    </li>

                    <li><hr className="dropdown-divider my-2 border-secondary border-opacity-25" /></li>

                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item text-danger fw-bold rounded-2 d-flex align-items-center gap-2 py-2"
                      >
                        <i className="bi bi-box-arrow-right fs-6"></i> Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <li className="nav-item ms-lg-2 my-1 my-lg-0">
                <Link
                  to="/login"
                  className={`btn ${location.pathname === '/login' ? 'btn-solid-success fw-bold' : 'btn-outline-light'} px-3 py-2 rounded-3 fw-medium w-100 w-lg-auto d-inline-block text-center`}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
