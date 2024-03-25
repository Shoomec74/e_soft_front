// типизация данных пользователя
export type TSigninResponse = {
  id: number;
  login: string;
  role: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  accessToken: string;
  refreshToken: string;
  manager?: any;
  subordinates?: TUserRegisterResponse[];
};

export type TUserRegisterResponse = {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  middleName: string;
  role: string;
  manager?: TUserRegisterResponse;
  subordinates?: TUserRegisterResponse[];
};

export type TTaskCreateResponse = {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  middleName: string;
  role: string;
  manager?: TUserRegisterResponse;
};

export type TUserSigninData = {
  login: string;
  password: string;
};

export type TUserRegisterData = {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  role?: string;
  subordinateIds?: number[];
};

export type TSignoutResponse = {
  success: boolean;
};

export enum UserRole {
  SUPERADMIN = 'superadmin',
  MANAGER = 'manager',
  SUBORDINATE = 'subordinate',
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export enum PriorityTask {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ProgressTask {
  TODO = 'to_do',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export enum GroupTasks {
  DATE = 'date',
  SUBORDINATE = 'subordinate',
  DEFAULT = 'default',
}

export type TCreateTaskData = {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: PriorityTask;
  assigneeId?: number;
};

export type TUpdateTaskData = Partial<TCreateTaskData> & {
  status?: ProgressTask;
};

export type TCreateTaskResponse = {
  title: string;
  description: string;
  deadline: Date;
  priority: PriorityTask;
  creator: TSigninResponse;
  assignee?: TUserRegisterResponse;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  status: ProgressTask;
};

export interface ICustomErrorResponse {
  status: number;
  statusText: string;
  error: any;
}

export enum TypeForm {
  REGISTER_USER = 'register_user',
  UPDATE_USER = 'update_user',
  CREATE_TASK = 'create_task',
  UPDATE_TASK = 'update_task',
  DEFAULT = '',
}
