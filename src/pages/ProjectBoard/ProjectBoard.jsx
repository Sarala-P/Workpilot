import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import KanbanColumn from '../../components/KanbanColumn/KanbanColumn';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import NotificationToast from '../../components/NotificationToast/NotificationToast';

const COLUMNS = ['Backlog', 'In Progress', 'Review', 'Completed'];

function ProjectBoard() {
  const { id } = useParams();
  const { role, user } = useAuth();
  const { projects, users, moveTaskOptimistic, addTaskComment, createTask } = useProjects();
  const [selectedTask, setSelectedTask] = useState(null);
  const [comment, setComment] = useState('');
  const [filters, setFilters] = useState({ priority: '', status: '', assignedTo: '' });
  const [toasts, setToasts] = useState([]);
  const project = projects.find((item) => item.id === Number(id));

  const filteredTasks = useMemo(() => {
    if (!project) return [];
    return project.tasks.filter((task) => {
      const matchesTeamMemberScope = role !== 'Team Member' || task.assignedTo === user?.id;
      return matchesTeamMemberScope
        && (!filters.priority || task.priority === filters.priority)
        && (!filters.status || task.status === filters.status)
        && (!filters.assignedTo || String(task.assignedTo) === String(filters.assignedTo));
    });
  }, [project, filters, role, user?.id]);

  const tasksByStatus = useMemo(() => COLUMNS.reduce((acc, status) => ({ ...acc, [status]: filteredTasks.filter((task) => task.status === status) }), {}), [filteredTasks]);

  const showToast = (message) => {
    const idValue = Date.now();
    setToasts((prev) => [...prev, { id: idValue, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== idValue)), 2500);
  };

  const onDragEnd = async (result) => {
    if (!result.destination || !project) return;
    const sourceStatus = result.source.droppableId;
    const destinationStatus = result.destination.droppableId;
    if (sourceStatus === destinationStatus) return;
    const task = tasksByStatus[sourceStatus]?.[result.source.index];
    if (!task) return;
    if (role === 'Team Member' && task.assignedTo !== user?.id) {
      showToast('You can only update your assigned tasks');
      return;
    }
    const actor = user?.firstName || user?.username || 'User';
    const outcome = await moveTaskOptimistic({
      projectId: project.id,
      taskId: task.id,
      nextStatus: destinationStatus,
      actor
    });
    if (!outcome.ok) {
      showToast(outcome.error);
      return;
    }
    showToast(destinationStatus === 'Completed' ? 'Task completed' : 'Task moved');
  };

  const handleCreateTask = () => {
    if (!project || (role !== 'Admin' && role !== 'Project Manager')) return;
    createTask(project.id, { title: 'New Team Task', description: 'Created from board quick action', assignedTo: project.teamMembers[0], priority: 'Medium', status: 'Backlog', dueDate: '2026-12-31' });
    showToast('Task created');
  };

  const submitComment = () => {
    if (!selectedTask || !comment.trim()) return;
    addTaskComment(project.id, selectedTask.id, comment.trim());
    setSelectedTask((prev) => ({ ...prev, comments: [...(prev.comments || []), comment.trim()] }));
    setComment('');
    showToast('Comment added');
  };

  if (!project) return <div className="alert alert-warning">Project not found.</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">{project.name}</h2>
        {(role === 'Admin' || role === 'Project Manager') && <button className="btn btn-primary btn-sm" onClick={handleCreateTask}>Create Task</button>}
      </div>
      <div className="card mb-3"><div className="card-body"><FilterPanel filters={filters} users={users} onChange={setFilters} /></div></div>
      <DragDropContext onDragEnd={onDragEnd}><div className="row g-3">{COLUMNS.map((status) => <KanbanColumn key={status} columnId={status} title={status} tasks={tasksByStatus[status] || []} onTaskClick={setSelectedTask} />)}</div></DragDropContext>
      <TaskDetailsModal task={selectedTask} users={users} comment={comment} setComment={setComment} onSubmitComment={submitComment} onClose={() => setSelectedTask(null)} />
      <NotificationToast toasts={toasts} />
    </>
  );
}

function TaskDetailsModal({ task, users, comment, setComment, onSubmitComment, onClose }) {
  if (!task) return null;
  const member = users.find((user) => user.id === task.assignedTo);
  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.35)' }}>
      <div className="modal-dialog"><div className="modal-content">
        <div className="modal-header"><h5 className="modal-title">{task.title}</h5><button type="button" className="btn-close" onClick={onClose} /></div>
        <div className="modal-body">
          <p>{task.description}</p>
          <p className="mb-1"><strong>Assigned:</strong> {member?.name || `User ${task.assignedTo}`}</p>
          <p className="mb-1"><strong>Priority:</strong> {task.priority}</p>
          <p className="mb-3"><strong>Due:</strong> {task.dueDate}</p>
          <h6>Comments</h6>
          <ul className="list-group mb-3">
            {(task.comments || []).map((entry, index) => <li key={`${entry}-${index}`} className="list-group-item">{entry}</li>)}
            {!task.comments?.length && <li className="list-group-item text-muted">No comments yet</li>}
          </ul>
          <div className="input-group"><input className="form-control" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" /><button className="btn btn-primary" onClick={onSubmitComment}>Add</button></div>
        </div>
      </div></div>
    </div>
  );
}

export default ProjectBoard;
