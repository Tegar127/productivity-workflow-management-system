export type UserRole = 'Admin' | 'Manager' | 'Member';
export type TaskStatus = 'Pending' | 'In Progress' | 'Review' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  start_date: string;
  creator_id: string | null;
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  assignee?: Profile;
}

export interface Approval {
  id: string;
  task_id: string;
  approver_id: string | null;
  level: UserRole;
  status: ApprovalStatus;
  notes: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  target_id: string | null;
  details: any;
  created_at: string;
  user?: Profile;
}
