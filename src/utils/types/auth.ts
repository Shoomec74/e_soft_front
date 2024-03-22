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
};

export type TUserRegisterResponse = {
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
  subordinateIds?: number[],
};

export type TSignoutResponse = {
  success: boolean
}

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
