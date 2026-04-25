import { useProjects } from '../../context/ProjectContext';

function Settings() {
  const { workspaceSettings, updateWorkspaceSettings } = useProjects();

  const permissionRows = [
    ['Manage users', 'Yes', 'No', 'No'],
    ['Create projects', 'Yes', 'No', 'No'],
    ['Delete projects', 'Yes', 'No', 'No'],
    ['Create tasks', 'Yes', 'Yes', 'No'],
    ['Assign team members', 'Yes', 'Yes', 'No'],
    ['Edit tasks', 'Yes', 'Yes', 'No'],
    ['Update task status', 'Yes', 'Yes', 'Yes'],
    ['View assigned tasks', 'Yes', 'Yes', 'Yes']
  ];

  const setToggle = (key, value) => updateWorkspaceSettings({ [key]: value });

  return (
    <div className="row g-3">
      <div className="col-lg-5">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h2 className="h5">Workspace Controls</h2>
            <p className="text-muted">Manage platform behavior and admin-level defaults.</p>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="realtimeUpdates"
                checked={workspaceSettings.realtimeUpdates}
                onChange={(event) => setToggle('realtimeUpdates', event.target.checked)}
              />
              <label className="form-check-label" htmlFor="realtimeUpdates">Enable real-time task simulation</label>
            </div>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="emailAlerts"
                checked={workspaceSettings.emailAlerts}
                onChange={(event) => setToggle('emailAlerts', event.target.checked)}
              />
              <label className="form-check-label" htmlFor="emailAlerts">Email alerts</label>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="auditLogs"
                checked={workspaceSettings.auditLogs}
                onChange={(event) => setToggle('auditLogs', event.target.checked)}
              />
              <label className="form-check-label" htmlFor="auditLogs">Audit logs</label>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-7">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h2 className="h5">Role Permission Matrix</h2>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th>Admin</th>
                    <th>Project Manager</th>
                    <th>Team Member</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionRows.map(([capability, admin, pm, member]) => (
                    <tr key={capability}>
                      <td>{capability}</td>
                      <td>{admin}</td>
                      <td>{pm}</td>
                      <td>{member}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
