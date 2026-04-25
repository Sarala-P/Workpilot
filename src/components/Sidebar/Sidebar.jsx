import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth();
  return (
    <>
      {isOpen && <div className="mobile-sidebar-overlay d-lg-none" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar bg-dark text-white p-3 ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="mb-0">Workspace</h5>
        <button type="button" className="btn btn-sm btn-outline-light d-lg-none" onClick={onClose}>
          Close
        </button>
      </div>
      <nav className="nav flex-column gap-2">
        <NavItem to="/dashboard" label="Dashboard" onSelect={onClose} />
        <NavItem to="/projects" label="Projects" onSelect={onClose} />
        <NavItem to="/my-tasks" label="My Tasks" onSelect={onClose} />
        <NavItem to="/analytics" label="Analytics" onSelect={onClose} />
        {role === 'Admin' && <NavItem to="/admin/users" label="User Management" onSelect={onClose} />}
        {role === 'Admin' && <NavItem to="/admin/settings" label="Admin Settings" onSelect={onClose} />}
      </nav>
      </aside>
    </>
  );
}

function NavItem({ to, label, onSelect }) {
  return (
    <NavLink
      to={to}
      onClick={onSelect}
      className={({ isActive }) => `nav-link rounded px-3 py-2 ${isActive ? 'bg-primary text-white' : 'text-light nav-hover'}`}
    >
      {label}
    </NavLink>
  );
}

export default Sidebar;
