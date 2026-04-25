import { useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from 'chart.js';
import { useProjects } from '../../context/ProjectContext';
import ActivityTimeline from '../../components/ActivityTimeline/ActivityTimeline';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend, LineElement, PointElement);

function Dashboard() {
  const { projects, activityLog, workspaceSettings, loading } = useProjects();
  const stats = useMemo(() => {
    const tasks = projects.flatMap((project) => project.tasks);
    const overdueTasks = tasks.filter(
      (task) => task.status !== 'Completed' && new Date(task.dueDate) < new Date()
    ).length;
    const statusCount = ['Backlog', 'In Progress', 'Review', 'Completed'].map(
      (status) => tasks.filter((task) => task.status === status).length
    );
    const priorityCount = ['Low', 'Medium', 'High'].map(
      (priority) => tasks.filter((task) => task.priority === priority).length
    );
    const memberLoad = projects
      .flatMap((project) => project.tasks)
      .reduce((acc, task) => {
        const key = String(task.assignedTo);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
    const loadPairs = Object.entries(memberLoad).slice(0, 8);

    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((task) => task.status === 'Completed').length,
      pendingTasks: tasks.filter((task) => task.status !== 'Completed').length,
      overdueTasks,
      statusCount,
      priorityCount,
      loadLabels: loadPairs.map(([memberId]) => `User ${memberId}`),
      loadValues: loadPairs.map(([, count]) => count)
    };
  }, [projects]);

  if (loading) return <SkeletonLoader count={4} height="100px" />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header mb-4">
        <h1 className="h3 mb-1">Dashboard</h1>
        <p className="text-muted mb-0">Track project delivery, workload balance, and live team activity.</p>
      </div>

      <section className="row g-3 mb-4">
        {[
          ['Total Projects', stats.totalProjects, 'primary'],
          ['Total Tasks', stats.totalTasks, 'info'],
          ['Completed Tasks', stats.completedTasks, 'success'],
          ['Pending Tasks', stats.pendingTasks, 'warning'],
          ['Overdue Tasks', stats.overdueTasks, 'danger']
        ].map(([label, value, color]) => (
          <div className="col-12 col-sm-6 col-xl" key={label}>
            <div className={`card shadow-sm border-start border-4 border-${color} dashboard-stat-card h-100`}>
              <div className="card-body">
                <p className="text-muted small mb-2">{label}</p>
                <h3 className="counter-value mb-0">{value}</h3>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="row g-4">
        <div className="col-12 col-xxl-8">
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <ChartCard title="Task Completion">
                <Doughnut
                  data={{
                    labels: ['Completed', 'Pending'],
                    datasets: [{ data: [stats.completedTasks, stats.pendingTasks], backgroundColor: ['#198754', '#ffc107'] }]
                  }}
                />
              </ChartCard>
            </div>
            <div className="col-12 col-lg-6">
              <ChartCard title="Projects vs Tasks">
                <Bar
                  data={{
                    labels: ['Projects', 'Tasks'],
                    datasets: [{ label: 'Count', data: [stats.totalProjects, stats.totalTasks], backgroundColor: ['#0d6efd', '#0dcaf0'] }]
                  }}
                />
              </ChartCard>
            </div>
            <div className="col-12 col-lg-6">
              <ChartCard title="Status Distribution">
                <Bar
                  data={{
                    labels: ['Backlog', 'In Progress', 'Review', 'Completed'],
                    datasets: [{ label: 'Tasks', data: stats.statusCount, backgroundColor: ['#6c757d', '#0d6efd', '#ffc107', '#198754'] }]
                  }}
                />
              </ChartCard>
            </div>
            <div className="col-12 col-lg-6">
              <ChartCard title="Priority Trend">
                <Line
                  data={{
                    labels: ['Low', 'Medium', 'High'],
                    datasets: [{ label: 'Current volume', data: stats.priorityCount, borderColor: '#6610f2', backgroundColor: 'rgba(102,16,242,0.2)' }]
                  }}
                />
              </ChartCard>
            </div>
            <div className="col-12">
              <ChartCard title="Workload by Team Member">
                <Bar
                  data={{ labels: stats.loadLabels, datasets: [{ label: 'Assigned Tasks', data: stats.loadValues, backgroundColor: '#20c997' }] }}
                  options={{ plugins: { legend: { display: false } } }}
                />
              </ChartCard>
            </div>
          </div>
        </div>
        <div className="col-12 col-xxl-4">
          <div className="card shadow-sm mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1 small">Workspace Live Mode</p>
                <h2 className="h6 mb-0">{workspaceSettings.realtimeUpdates ? 'Real-time enabled' : 'Real-time paused'}</h2>
              </div>
              <span className={`badge ${workspaceSettings.realtimeUpdates ? 'text-bg-success' : 'text-bg-secondary'}`}>
                {workspaceSettings.realtimeUpdates ? 'Active' : 'Paused'}
              </span>
            </div>
          </div>
          <div className="dashboard-timeline-wrap">
            <ActivityTimeline activities={activityLog} />
          </div>
        </div>
      </section>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="card shadow-sm h-100 dashboard-chart-card">
      <div className="card-body">
        <h5 className="mb-3">{title}</h5>
        {children}
      </div>
    </div>
  );
}

export default Dashboard;
