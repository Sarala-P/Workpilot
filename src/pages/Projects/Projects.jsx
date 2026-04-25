import { memo, useMemo, useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import Pagination from '../../components/Pagination/Pagination';
import SearchBar from '../../components/SearchBar/SearchBar';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';

const MemoProjectCard = memo(ProjectCard);

function Projects() {
  const { projects, users, loading, createProject, deleteProject } = useProjects();
  const { role } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [newProjectName, setNewProjectName] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const pageSize = 10;
  const filtered = useMemo(() => projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase())), [projects, search]);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <SkeletonLoader count={6} />;

  const handleCreateProject = () => {
    createProject(newProjectName);
    setNewProjectName('');
  };

  return (
    <div>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2 className="h4 mb-0">Projects</h2>
      </div>
      {role === 'Admin' && (
        <div className="card mb-3 shadow-sm">
          <div className="card-body">
            <h3 className="h6">Admin: Create project</h3>
            <div className="input-group">
              <input
                className="form-control"
                placeholder="New project name"
                value={newProjectName}
                onChange={(event) => setNewProjectName(event.target.value)}
              />
              <button type="button" className="btn btn-primary" onClick={handleCreateProject}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mb-3"><SearchBar value={search} onSearch={(query) => { setSearch(query); setPage(1); }} placeholder="Search projects by name..." /></div>
      <div className="row g-3">
        {paginated.map((project) => (
          <div className="col-md-6 col-xl-4" key={project.id}>
            <MemoProjectCard
              project={project}
              users={users}
              canDelete={role === 'Admin'}
              onDelete={() => setProjectToDelete(project)}
            />
          </div>
        ))}
      </div>
      <div className="mt-4"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>
      {projectToDelete && (
        <DeleteProjectModal
          project={projectToDelete}
          onCancel={() => setProjectToDelete(null)}
          onConfirm={() => {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }}
        />
      )}
    </div>
  );
}

function DeleteProjectModal({ project, onCancel, onConfirm }) {
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.35)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Project</h5>
            <button type="button" className="btn-close" onClick={onCancel} />
          </div>
          <div className="modal-body">
            <p className="mb-0">
              Are you sure you want to delete <strong>{project.name}</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete Project</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
