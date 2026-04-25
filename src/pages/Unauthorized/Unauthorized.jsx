import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="container py-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '620px' }}>
        <div className="card-body p-4">
          <h1 className="h3 mb-3">Access Restricted</h1>
          <p className="text-muted mb-3">
            Your account role does not have permission to open this page. If you need access,
            contact your workspace administrator.
          </p>
          <div className="d-flex gap-2">
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            <Link to="/projects" className="btn btn-outline-secondary">Open Projects</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
