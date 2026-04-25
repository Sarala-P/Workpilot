import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const AuthContext = createContext(null);
const AUTH_KEY = 'teamflow_auth';
const roleByUsername = { emilys: 'Admin', michaelw: 'Project Manager', jamesd: 'Team Member' };

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : { token: '', user: null, role: null };
  });

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth]);

  const login = async (credentials) => {
    const data = await apiService.login(credentials);
    const role = roleByUsername[data.username] || 'Team Member';
    const next = {
      token: data.accessToken,
      user: {
        id: data.id, firstName: data.firstName, lastName: data.lastName,
        email: data.email, image: data.image, username: data.username
      },
      role
    };
    setAuth(next);
    return next;
  };

  const logout = () => {
    setAuth({ token: '', user: null, role: null });
    navigate('/login');
  };

  const value = useMemo(() => ({
    ...auth,
    isAuthenticated: Boolean(auth.token),
    login,
    logout
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
