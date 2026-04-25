import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import Pagination from '../../components/Pagination/Pagination';
import FilterPanel from '../../components/FilterPanel/FilterPanel';

function MyTasks() {
  const { user } = useAuth();
  const { projects, users } = useProjects();
  const [filters, setFilters] = useState({ priority: '', status: '', assignedTo: '' });
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const taskRows = useMemo(() => {
    const all = projects.flatMap((project) => (
      project.tasks
        .filter((task) => task.assignedTo === user?.id)
        .map((task) => ({ ...task, projectName: project.name }))
    ));
    return all.filter((task) => (
      (!filters.priority || task.priority === filters.priority)
      && (!filters.status || task.status === filters.status)
      && (!filters.assignedTo || String(task.assignedTo) === String(filters.assignedTo))
    ));
  }, [projects, user?.id, filters]);

  const totalPages = Math.ceil(taskRows.length / pageSize) || 1;
  const paginated = taskRows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5 mb-3">My Assigned Tasks</h2>
        <div className="mb-3">
          <FilterPanel
            filters={filters}
            users={users.filter((entry) => entry.id === user?.id)}
            onChange={(next) => {
              setFilters({ ...next, assignedTo: user?.id || '' });
              setPage(1);
            }}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((task) => (
                <tr key={`${task.projectName}-${task.id}`}>
                  <td>{task.title}</td>
                  <td>{task.projectName}</td>
                  <td><span className="badge text-bg-light border">{task.status}</span></td>
                  <td>{task.priority}</td>
                  <td>{task.dueDate}</td>
                </tr>
              ))}
              {!paginated.length && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">No tasks match the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default MyTasks;
