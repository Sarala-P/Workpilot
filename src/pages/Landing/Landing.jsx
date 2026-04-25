import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="container py-5">
      <section className="landing-hero p-5 rounded-4 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <span className="badge text-bg-light border mb-3">WorkPilot Platform</span>
            <h1 className="display-5 fw-bold">Deliver projects faster with one collaborative workspace</h1>
            <p className="lead text-secondary mb-4">
              Plan work on boards, assign owners, get simulated real-time activity updates, and keep
              every team aligned from kickoff to launch.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/login" className="btn btn-primary btn-lg">Start Free</Link>
              <Link to="/dashboard" className="btn btn-outline-dark btn-lg">View Demo Workspace</Link>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h2 className="h5">Live Workspace Snapshot</h2>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item px-0 d-flex justify-content-between"><span>Active Projects</span><strong>12</strong></li>
                  <li className="list-group-item px-0 d-flex justify-content-between"><span>Open Tasks</span><strong>93</strong></li>
                  <li className="list-group-item px-0 d-flex justify-content-between"><span>Completed This Week</span><strong>47</strong></li>
                  <li className="list-group-item px-0 d-flex justify-content-between"><span>Avg. On-Time Delivery</span><strong>89%</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-3 mb-4">
        {[
          ['Role-based access', 'Keep Admin, PM, and team workflows separated and secure.'],
          ['Kanban + comments', 'Move work quickly and collaborate in task detail threads.'],
          ['Smart analytics', 'Visualize priorities, status trends, and completion health.']
        ].map(([title, description]) => (
          <div className="col-md-4" key={title}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h3 className="h6">{title}</h3>
                <p className="text-muted mb-0">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="card border-0 shadow-sm">
        <div className="card-body p-4 p-lg-5">
          <h2 className="h4">Built for cross-functional teams</h2>
          <p className="text-muted mb-3">
            Engineering, design, marketing, and operations can manage work in shared projects with
            clear ownership and transparency.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <span className="badge text-bg-primary">Sprint Planning</span>
            <span className="badge text-bg-secondary">Roadmap Visibility</span>
            <span className="badge text-bg-success">Resource Allocation</span>
            <span className="badge text-bg-warning text-dark">Risk Tracking</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
