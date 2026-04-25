import { useMemo, useState } from 'react';
import Pagination from '../../components/Pagination/Pagination';
import { useProjects } from '../../context/ProjectContext';

function UserManagement() {
  const { users } = useProjects();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(users.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => users.slice((page - 1) * pageSize, page * pageSize), [users, page]);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5">Manage Users</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>{paginatedUsers.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td></tr>)}</tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default UserManagement;
