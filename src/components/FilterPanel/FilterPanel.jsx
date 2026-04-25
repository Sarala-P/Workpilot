function FilterPanel({ filters, users, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="row g-2">
      <div className="col-md-4">
        <select className="form-select" value={filters.priority} onChange={(e) => update('priority', e.target.value)}>
          <option value="">All priorities</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
        </select>
      </div>
      <div className="col-md-4">
        <select className="form-select" value={filters.status} onChange={(e) => update('status', e.target.value)}>
          <option value="">All statuses</option><option value="Backlog">Backlog</option><option value="In Progress">In Progress</option><option value="Review">Review</option><option value="Completed">Completed</option>
        </select>
      </div>
      <div className="col-md-4">
        <select className="form-select" value={filters.assignedTo} onChange={(e) => update('assignedTo', e.target.value)}>
          <option value="">All members</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
      </div>
    </div>
  );
}

export default FilterPanel;
