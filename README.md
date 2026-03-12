# Real-Time Collaborative Task Manager

Full stack collaborative project management system with realtime updates.

---

## Installation

### 1 Clone repository

git clone <repo-url>

cd task-manager

---

### 2 Backend Setup

cd backend

npm install

Create `.env`

MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=secret

Run server

npm run dev

---

### 3 Frontend Setup

cd frontend

npm install

Create `.env.local`

NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

Run frontend

npm run dev

---


## Tech Stack

Frontend
- Next.js (App Router)
- TypeScript
- TailwindCSS v4
- Socket.io Client

Backend
- Node.js
- MongoDB
- Mongoose
- Socket.io
- JWT Authentication

## Features

- Authentication (JWT)
- Projects & members
- Task management
- Kanban board
- Comments system
- Task assignment
- Global search
- Realtime collaboration
- Presence detection

---

## Realtime Events

taskCreated  
taskUpdated  
taskDeleted  
commentAdded  
taskAssigned  
presenceUpdate

---

## API Endpoints

Auth

POST /api/auth/register  
POST /api/auth/login  

Projects

GET /api/projects  
POST /api/projects  

Tasks

POST /api/tasks  
PATCH /api/tasks/:id  
POST /api/tasks/:id/comments  
POST /api/tasks/:id/assign  
POST /api/tasks/:id/unassign  

Search

GET /api/search?q=

---

## Future Improvements

- Notifications
- File attachments
- Activity log
- Task priority
- Mobile responsiveness