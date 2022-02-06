export interface ProjectInfo {
  title: string;
  description: string;
  user_id?: number;
  status_id: number;
}

export interface ProjectStage {
  id?: number;
  title: string;
  user_id?: number;
  project_id?: number;
  created_at?: Date;
  upated_at?: Date;
  deleted_at?: Date;
  tasks?: [];
}

// Task creation info
export interface TaskCreationInfo {
  projectId: number;
  stageId: number;
  userId: number;
  title: string;
  content: TaskContent;
}

export interface TaskContent {
  html: string;
  text: string;
}

export interface TaskUpdateInfo {
  stageId?: number;
  title?: string;
  content?: TaskContent;
}
