# WorkPilot - Collaborative Project Management Platform

WorkPilot is a production-ready frontend web application built with React and Bootstrap. It simulates a modern Trello/Notion-like workspace with role-based access control, Kanban task management, analytics, and reusable UI components.

## Features
- Authentication via DummyJSON and token persistence in localStorage
- Role-based authorization for Admin, Project Manager, and Team Member
- Protected routes for dashboard, projects, analytics, and admin pages
- Dashboard cards and charts for real statistics
- Projects page with debounced search and pagination
- Kanban board with drag-and-drop columns and task status updates
- Task modal with comments, assignee, priority, and due date
- Toast notifications, skeleton loaders, and API fallback data
- Lazy-loaded pages and memoized project cards for better performance
- LocalStorage persistence for projects, activity feed, and workspace settings
- Simulated real-time task progression updates with live activity timeline
- Delete confirmation modal and dedicated unauthorized access page
- Admin permission matrix and workspace behavior controls

## Tech Stack
- React, JavaScript (ES6+), HTML5, CSS3, Bootstrap 5
- Axios, React Router, Context API, LocalStorage
- Chart.js + react-chartjs-2, @hello-pangea/dnd

## Installation
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
```

## Demo Credentials
- Admin: `emilys` / `emilyspass`
- Project Manager: `michaelw` / `michaelwpass`
- Team Member: `jamesd` / `jamesdpass`

## Folder Structure
```text
src/
  components/
  pages/
  admin/
  context/
  services/
  data/
  styles/
```

## Deployment
- Vercel: build `npm run build`, output `dist`
- Netlify: build `npm run build`, publish `dist`

## Future Improvements
- Real backend CRUD and websocket-based realtime collaboration
- Activity feed, mentions, and robust test coverage
