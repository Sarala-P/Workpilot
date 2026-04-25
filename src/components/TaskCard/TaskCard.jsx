function TaskCard({ task, onClick }) {
  const theme = { High: 'danger', Medium: 'warning', Low: 'success' }[task.priority] || 'secondary';
  return (
    <div className="card shadow-sm mb-2 task-card" onClick={() => onClick(task)} role="button" tabIndex={0}>
      <div className="card-body p-3">
        <h6 className="mb-2">{task.title}</h6>
        <div className="d-flex justify-content-between">
          <span className={`badge text-bg-${theme}`}>{task.priority}</span>
          <small className="text-muted">{task.dueDate}</small>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
