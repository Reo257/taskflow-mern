import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <CheckSquare className="brand-icon" />
          <span>TaskFlow</span>
        </Link>

        <div className="nav-actions">
          {isAuthenticated && user ? (
            <>
              <div className="user-badge">
                <UserIcon size={14} />
                <span>
                  <strong>{user.name}</strong> ({user.role})
                </span>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                onClick={handleLogout}
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
