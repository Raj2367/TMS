# Real-Time Collaborative Task Manager

Full stack collaborative project management system with realtime updates.

---

## Installation

### 1. Clone repository

git clone https://github.com/Raj2367/TMS.git

cd TMS

---

### 2. Backend Setup

cd api

npm install

Create `.env`

MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=secret

Run server

npm run dev:all

---

### 3. Frontend Setup

cd web

npm install

Create `.env.local`

NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3002

Run frontend

npm run dev

open http://localhost:3001 for Login / Register

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
## Design Decisions
### 1. WebSockets for Real-Time Updates

Socket.io was used to allow multiple users to collaborate on the same project dashboard.

Advantages:
- instant updates
- reduced polling
- scalable with Redis adapter

### 2. Project-Based Socket Rooms

Each project has its own room.

Example:
project:123

Benefits:
- events scoped to project members
- prevents unnecessary broadcasts
- reduces network traffic

### 3. MongoDB Schema Design

Tasks reference projects using projectId.

Indexes used:
- projectId
- createdAt
- text index (title, description, comments)

Benefits:
- fast dashboard queries
- efficient search

### 4. Cursor-Based Pagination

Task lists use cursor-based pagination instead of offset pagination.

Advantages:
- scalable for large datasets
- avoids performance degradation with large offsets

### 5. DTO Pattern

Database models are not directly returned to clients.
Instead, responses are formatted to avoid leaking internal schema details.

---

## Future Improvements

- Notifications
- File attachments
- Activity log
- Task priority
- Mobile responsiveness
