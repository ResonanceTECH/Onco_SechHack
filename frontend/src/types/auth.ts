export type Role = 'doctor' | 'patient' | 'admin';

export interface User {
  id: string;
  email: string;
  role: Role;
  displayName?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  displayName?: string;
}
