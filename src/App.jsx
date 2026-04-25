import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import SkeletonLoader from './components/SkeletonLoader/SkeletonLoader';

const Landing = lazy(() => import('./pages/Landing/Landing'));
const Login = lazy(() => import('./pages/Login/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const ProjectBoard = lazy(() => import('./pages/ProjectBoard/ProjectBoard'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));
const MyTasks = lazy(() => import('./pages/MyTasks/MyTasks'));
const Unauthorized = lazy(() => import('./pages/Unauthorized/Unauthorized'));
const UserManagement = lazy(() => import('./admin/UserManagement/UserManagement'));
const Settings = lazy(() => import('./admin/Settings/Settings'));

function App() {
  return (
    <Suspense fallback={<div className="container py-4"><SkeletonLoader count={4} height="80px" /></div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<ProtectedRoute allowedRoles={["Admin", "Project Manager", "Team Member"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectBoard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/my-tasks" element={<MyTasks />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
