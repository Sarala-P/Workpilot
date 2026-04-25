import { useMemo, useState } from 'react';

function ActivityTimeline({ activities = [] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const filters = useMemo(() => {
    const types = [...new Set(activities.map((item) => item.type).filter(Boolean))];
    const actors = [...new Set(activities.map((item) => item.actor || 'System'))];
    const projects = [...new Set(activities.map((item) => item.projectName).filter(Boolean))];
    return { types, actors, projects };
  }, [activities]);

  const top = useMemo(() => {
    const query = search.trim().toLowerCase();
    return activities
      .filter((item) => (!typeFilter || item.type === typeFilter))
      .filter((item) => (!actorFilter || (item.actor || 'System') === actorFilter))
      .filter((item) => (!projectFilter || item.projectName === projectFilter))
      .filter((item) => {
        if (!query) return true;
        const body = `${item.message} ${item.projectName || ''} ${item.actor || ''}`.toLowerCase();
        return body.includes(query);
      })
      .slice(0, 8);
  }, [activities, typeFilter, actorFilter, projectFilter, search]);

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h5 className="mb-3">Activity Timeline</h5>
        <div className="row g-2 mb-3">
          <div className="col-12">
            <input
              className="form-control form-control-sm"
              placeholder="Search activity..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-6">
            <select className="form-select form-select-sm" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="">All types</option>
              {filters.types.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="col-6">
            <select className="form-select form-select-sm" value={actorFilter} onChange={(event) => setActorFilter(event.target.value)}>
              <option value="">All users</option>
              {filters.actors.map((actor) => <option key={actor} value={actor}>{actor}</option>)}
            </select>
          </div>
          <div className="col-12">
            <select className="form-select form-select-sm" value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)}>
              <option value="">All projects</option>
              {filters.projects.map((project) => <option key={project} value={project}>{project}</option>)}
            </select>
          </div>
        </div>
        <ul className="list-group list-group-flush">
          {top.map((item) => (
            <li key={item.id} className="list-group-item px-0">
              <div className="d-flex justify-content-between gap-2">
                <span>{item.message}</span>
                <small className="text-muted">{new Date(item.timestamp).toLocaleTimeString()}</small>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className="badge text-bg-light border">{item.type}</span>
                <span className="badge text-bg-light border">{item.actor || 'System'}</span>
                {item.projectName ? <span className="badge text-bg-light border">{item.projectName}</span> : null}
              </div>
            </li>
          ))}
          {!top.length && (
            <li className="list-group-item px-0 text-muted">No activity yet. Start creating tasks and projects.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ActivityTimeline;
