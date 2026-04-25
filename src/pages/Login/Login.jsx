import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DEMO_CREDENTIALS = [
  { role: 'Admin', username: 'emilys', password: 'emilyspass' },
  { role: 'Project Manager', username: 'michaelw', password: 'michaelwpass' },
  { role: 'Team Member', username: 'jamesd', password: 'jamesdpass' }
];

function Login() {
  const [form, setForm] = useState({ username: 'emilys', password: 'emilyspass' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(form);
      navigate(from, { replace: true });
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 mb-3">Login to WorkPilot</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3"><label className="form-label">Username</label><input className="form-control" value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} required /></div>
                <div className="mb-3"><label className="form-label">Password</label><input type="password" className="form-control" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required /></div>
                {error ? <div className="alert alert-danger py-2">{error}</div> : null}
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
              </form>
              <hr />
              <p className="small text-muted mb-1">Demo credentials:</p>
              {DEMO_CREDENTIALS.map((item) => <div key={item.role} className="small">{item.role}: <code>{item.username}</code> / <code>{item.password}</code></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
