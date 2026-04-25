import axios from 'axios';
import fallbackProjects from '../data/projects.json';

const api = axios.create({ baseURL: 'https://dummyjson.com', timeout: 10000 });

export const apiService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  async getProjects() {
    try {
      const response = await api.get('/todos?limit=120');
      return buildProjectsFromTodos(response.data.todos);
    } catch (error) {
      return fallbackProjects;
    }
  },
  async getUsers() {
    try {
      const response = await api.get('/users?limit=100');
      return response.data.users.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.company?.title || 'Team Member'
      }));
    } catch (error) {
      return [
        { id: 1, name: 'Emily Johnson', email: 'emily@teamflow.app', role: 'Admin' },
        { id: 2, name: 'Michael Wang', email: 'michael@teamflow.app', role: 'Project Manager' },
        { id: 3, name: 'James Diaz', email: 'james@teamflow.app', role: 'Team Member' }
      ];
    }
  }
};

function buildProjectsFromTodos(todos = []) {
  const names = ['Website Revamp', 'Mobile App Release', 'Marketing Campaign', 'Customer Portal', 'Data Migration', 'Support Automation', 'Security Hardening', 'HR Onboarding', 'Finance Dashboard', 'Partner Integrations', 'QA Automation', 'Knowledge Base'];
  const statusMap = ['Backlog', 'In Progress', 'Review', 'Completed'];
  const priorityMap = ['Low', 'Medium', 'High'];

  return names.map((name, index) => {
    const memberIds = [index * 3 + 1, index * 3 + 2, index * 3 + 3];
    const chunk = todos.slice(index * 10, index * 10 + 10);
    const tasks = chunk.map((todo, taskIndex) => ({
      id: todo.id,
      title: todo.todo,
      description: `Task for ${name}: ${todo.todo}`,
      assignedTo: memberIds[taskIndex % memberIds.length],
      priority: priorityMap[(todo.id + index) % priorityMap.length],
      status: todo.completed ? 'Completed' : statusMap[(todo.id + taskIndex) % 3],
      dueDate: `2026-0${(taskIndex % 9) + 1}-1${taskIndex % 9}`,
      comments: []
    }));

    return { id: index + 1, name, teamMembers: memberIds, tasks };
  });
}
