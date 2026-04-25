import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiService } from '../services/api';

const ProjectContext = createContext(null);
const PROJECTS_KEY = 'taskforge_projects';
const ACTIVITY_KEY = 'taskforge_activity';
const SETTINGS_KEY = 'taskforge_workspace_settings';
const STATUS_FLOW = {
  Backlog: 'In Progress',
  'In Progress': 'Review',
  Review: 'Completed',
  Completed: 'Completed'
};
const ACTORS = ['Ava', 'Liam', 'Noah', 'Mia'];

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    const cached = localStorage.getItem(PROJECTS_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  const [users, setUsers] = useState([]);
  const [activityLog, setActivityLog] = useState(() => {
    const cached = localStorage.getItem(ACTIVITY_KEY);
    return cached ? JSON.parse(cached) : [];
  });
  const [workspaceSettings, setWorkspaceSettings] = useState(() => {
    const cached = localStorage.getItem(SETTINGS_KEY);
    return cached
      ? JSON.parse(cached)
      : { realtimeUpdates: true, emailAlerts: true, auditLogs: true };
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [projectPayload, userPayload] = await Promise.all([
        apiService.getProjects(),
        apiService.getUsers()
      ]);
      setUsers(userPayload);
      setProjects((prev) => (prev.length ? prev : projectPayload));
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(workspaceSettings));
  }, [workspaceSettings]);

  const logActivity = ({
    message,
    type = 'system',
    actor = 'System',
    projectId = null,
    projectName = '',
    taskId = null,
    taskTitle = ''
  }) => {
    const entry = {
      id: Date.now() + Math.random(),
      message,
      type,
      actor,
      projectId,
      projectName,
      taskId,
      taskTitle,
      timestamp: new Date().toISOString()
    };
    setActivityLog((prev) => [entry, ...prev].slice(0, 100));
  };

  const moveTaskOptimistic = async ({ projectId, taskId, nextStatus, actor = 'User' }) => {
    const numericProjectId = Number(projectId);
    const beforeProjects = projects;
    let previousStatus = '';
    let taskTitle = '';
    let projectName = '';

    const optimisticProjects = projects.map((project) => {
      if (project.id !== numericProjectId) return project;
      projectName = project.name;
      return {
        ...project,
        tasks: project.tasks.map((task) => {
          if (task.id !== taskId) return task;
          previousStatus = task.status;
          taskTitle = task.title;
          return { ...task, status: nextStatus };
        })
      };
    });

    setProjects(optimisticProjects);
    logActivity({
      message: `${actor} moved "${taskTitle}" to ${nextStatus} in ${projectName}`,
      type: 'task',
      actor,
      projectId: numericProjectId,
      projectName,
      taskId,
      taskTitle
    });

    const isNetworkSuccess = await simulateTaskMoveRequest();
    if (isNetworkSuccess) {
      return { ok: true };
    }

    const rollbackProjects = beforeProjects.map((project) => {
      if (project.id !== numericProjectId) return project;
      return {
        ...project,
        tasks: project.tasks.map((task) => (
          task.id === taskId ? { ...task, status: previousStatus } : task
        ))
      };
    });
    setProjects(rollbackProjects);
    logActivity({
      message: `Rollback applied: "${taskTitle}" returned to ${previousStatus}`,
      type: 'rollback',
      actor: 'System',
      projectId: numericProjectId,
      projectName,
      taskId,
      taskTitle
    });

    return { ok: false, error: 'Unable to sync task status. Changes were rolled back.' };
  };

  const addTaskComment = (projectId, taskId, comment) => {
    setProjects((prev) => prev.map((project) => {
      if (project.id !== Number(projectId)) return project;
      const updatedTasks = project.tasks.map((task) => task.id !== taskId ? task : { ...task, comments: [...task.comments, comment] });
      return { ...project, tasks: updatedTasks };
    }));
    logActivity({
      message: `New comment added to task #${taskId}`,
      type: 'comment',
      actor: 'User',
      projectId: Number(projectId),
      taskId
    });
  };

  const createTask = (projectId, taskData) => {
    setProjects((prev) => prev.map((project) => {
      if (project.id !== Number(projectId)) return project;
      const maxId = Math.max(0, ...project.tasks.map((task) => task.id));
      return { ...project, tasks: [{ id: maxId + 1, comments: [], ...taskData }, ...project.tasks] };
    }));
    logActivity({
      message: `Task "${taskData.title}" created`,
      type: 'task',
      actor: 'User',
      projectId: Number(projectId),
      taskTitle: taskData.title
    });
  };

  const createProject = (projectName) => {
    const trimmedName = projectName.trim();
    if (!trimmedName) return;
    setProjects((prev) => {
      const maxProjectId = Math.max(0, ...prev.map((project) => project.id));
      const seedMemberIds = users.slice(0, 3).map((user) => user.id);
      const teamMembers = seedMemberIds.length ? seedMemberIds : [1, 2, 3];
      const newProject = {
        id: maxProjectId + 1,
        name: trimmedName,
        teamMembers,
        tasks: []
      };
      return [newProject, ...prev];
    });
    logActivity({
      message: `Project "${trimmedName}" created`,
      type: 'project',
      actor: 'Admin',
      projectName: trimmedName
    });
  };

  const deleteProject = (projectId) => {
    let projectName = '';
    setProjects((prev) => prev.filter((project) => {
      if (project.id === Number(projectId)) {
        projectName = project.name;
        return false;
      }
      return true;
    }));
    if (projectName) {
      logActivity({
        message: `Project "${projectName}" deleted`,
        type: 'project',
        actor: 'Admin',
        projectId: Number(projectId),
        projectName
      });
    }
  };

  const updateWorkspaceSettings = (nextSettings) => {
    setWorkspaceSettings((prev) => ({ ...prev, ...nextSettings }));
  };

  useEffect(() => {
    if (!workspaceSettings.realtimeUpdates) return undefined;
    const intervalId = setInterval(() => {
      setProjects((prev) => {
        const candidates = prev.flatMap((project) => (
          project.tasks
            .filter((task) => task.status !== 'Completed')
            .map((task) => ({ projectId: project.id, projectName: project.name, task }))
        ));

        if (!candidates.length) return prev;

        const random = candidates[Math.floor(Math.random() * candidates.length)];
        const nextStatus = STATUS_FLOW[random.task.status] || random.task.status;
        if (nextStatus === random.task.status) return prev;

        const actor = ACTORS[Math.floor(Math.random() * ACTORS.length)];
        setActivityLog((log) => [{
          id: Date.now() + Math.random(),
          message: `${actor} moved "${random.task.title}" to ${nextStatus}`,
          type: 'live',
          actor,
          projectId: random.projectId,
          projectName: random.projectName,
          taskId: random.task.id,
          taskTitle: random.task.title,
          timestamp: new Date().toISOString()
        }, ...log].slice(0, 100));

        return prev.map((project) => {
          if (project.id !== random.projectId) return project;
          return {
            ...project,
            tasks: project.tasks.map((task) => (
              task.id === random.task.id ? { ...task, status: nextStatus } : task
            ))
          };
        });
      });
    }, 15000);

    return () => clearInterval(intervalId);
  }, [workspaceSettings.realtimeUpdates]);

  const value = useMemo(() => ({
    projects,
    users,
    activityLog,
    workspaceSettings,
    loading,
    moveTaskOptimistic,
    addTaskComment,
    createTask,
    createProject,
    deleteProject,
    updateWorkspaceSettings
  }), [projects, users, activityLog, workspaceSettings, loading]);

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

function simulateTaskMoveRequest() {
  return new Promise((resolve) => {
    const delay = 300 + Math.random() * 700;
    setTimeout(() => {
      resolve(Math.random() > 0.2);
    }, delay);
  });
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used inside ProjectProvider');
  return context;
}
