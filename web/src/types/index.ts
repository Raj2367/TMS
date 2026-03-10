export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id?: string;
  user: User;
  message: string;
  createdAt: string;
}

export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignees: User[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface PresenceUpdate {
  projectId: string;
  users: string[];
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface TasksResponse {
  success: boolean;
  tasks: Task[];
  nextCursor?: string;
}

export interface SearchResponse {
  success: boolean;
  count: number;
  tasks: Task[];
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}
