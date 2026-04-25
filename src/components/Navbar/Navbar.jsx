import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user, role, logout } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg border-bottom bg-white px-4">
      <div className="container-fluid">
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-lg-none"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? '✕' : '☰'}
          </button>
          <Link className="navbar-brand fw-semibold mb-0" to="/dashboard">WorkPilot</Link>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted small">{role}</span>
          <span className="small fw-semibold">{user?.firstName || 'User'}</span>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
