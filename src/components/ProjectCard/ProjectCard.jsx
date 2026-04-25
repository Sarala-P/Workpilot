import { Link } from 'react-router-dom';

function ProjectCard({ project, users, canDelete = false, onDelete }) {
  const total = project.tasks.length;
  const completed = project.tasks.filter((task) => task.status === 'Completed').length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title">{project.name}</h5>
        <p className="mb-2 text-muted">{total} tasks</p>
        <div className="progress mb-3"><div className="progress-bar" style={{ width: `${progress}%` }}>{progress}%</div></div>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {project.teamMembers.slice(0, 4).map((id) => {
            const member = users.find((user) => user.id === id);
            return <span key={id} className="badge text-bg-light border">{member?.name || `User ${id}`}</span>;
          })}
        </div>
      </div>
      <div className="card-footer bg-white border-0 pt-0 pb-3 px-3 d-flex gap-2">
        <Link className="btn btn-primary btn-sm" to={`/project/${project.id}`}>Open Board</Link>
        {canDelete && (
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onDelete?.(project.id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
