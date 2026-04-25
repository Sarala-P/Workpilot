import { useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import { useProjects } from '../../context/ProjectContext';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

function Analytics() {
  const { projects } = useProjects();
  const analytics = useMemo(() => {
    const tasks = projects.flatMap((project) => project.tasks);
    const byStatus = ['Backlog', 'In Progress', 'Review', 'Completed'].map((status) => tasks.filter((task) => task.status === status).length);
    const byPriority = ['Low', 'Medium', 'High'].map((priority) => tasks.filter((task) => task.priority === priority).length);
    const completionRate = projects.map((project) => {
      const total = project.tasks.length;
      const completed = project.tasks.filter((task) => task.status === 'Completed').length;
      return total ? Math.round((completed / total) * 100) : 0;
    });

    const projectBacklog = projects.map((project) => project.tasks.filter((task) => task.status === 'Backlog').length);
    const projectInProgress = projects.map((project) => project.tasks.filter((task) => task.status === 'In Progress').length);
    const projectReview = projects.map((project) => project.tasks.filter((task) => task.status === 'Review').length);
    const projectCompleted = projects.map((project) => project.tasks.filter((task) => task.status === 'Completed').length);

    return {
      byStatus,
      byPriority,
      completionRate,
      projectBacklog,
      projectInProgress,
      projectReview,
      projectCompleted
    };
  }, [projects]);

  return (
    <div className="row g-4">
      <div className="col-lg-4"><div className="card shadow-sm"><div className="card-body"><h5>Tasks by Status</h5><Doughnut data={{ labels: ['Backlog', 'In Progress', 'Review', 'Completed'], datasets: [{ data: analytics.byStatus }] }} /></div></div></div>
      <div className="col-lg-4"><div className="card shadow-sm"><div className="card-body"><h5>Tasks by Priority</h5><Bar data={{ labels: ['Low', 'Medium', 'High'], datasets: [{ label: 'Tasks', data: analytics.byPriority, backgroundColor: ['#198754', '#ffc107', '#dc3545'] }] }} /></div></div></div>
      <div className="col-lg-4"><div className="card shadow-sm"><div className="card-body"><h5>Project Completion %</h5><Line data={{ labels: projects.map((project) => project.name), datasets: [{ label: 'Completion %', data: analytics.completionRate, borderColor: '#0d6efd' }] }} /></div></div></div>
      <div className="col-lg-12"><div className="card shadow-sm"><div className="card-body"><h5>Project Pipeline Composition</h5><Bar data={{ labels: projects.map((project) => project.name), datasets: [{ label: 'Backlog', data: analytics.projectBacklog, backgroundColor: '#6c757d' }, { label: 'In Progress', data: analytics.projectInProgress, backgroundColor: '#0d6efd' }, { label: 'Review', data: analytics.projectReview, backgroundColor: '#ffc107' }, { label: 'Completed', data: analytics.projectCompleted, backgroundColor: '#198754' }] }} options={{ responsive: true, scales: { x: { stacked: true }, y: { stacked: true } } }} /></div></div></div>
      <div className="col-lg-12"><div className="card shadow-sm"><div className="card-body"><h5>Portfolio Health Snapshot</h5><Line data={{ labels: ['Backlog', 'In Progress', 'Review', 'Completed'], datasets: [{ label: 'Task Flow', data: analytics.byStatus, borderColor: '#fd7e14', backgroundColor: 'rgba(253,126,20,0.25)' }, { label: 'Priority Signal', data: [analytics.byPriority[0], analytics.byPriority[1], analytics.byPriority[2], analytics.byPriority[2]], borderColor: '#6610f2', backgroundColor: 'rgba(102,16,242,0.2)' }] }} /></div></div></div>
    </div>
  );
}

export default Analytics;
