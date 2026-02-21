import type { User, LoginCredentials, RegisterCredentials } from '../../types';

const MOCK_USER: User = {
  id: 'user-1',
  email: 'doctor@test.ru',
  role: 'doctor',
  displayName: 'Врач (тест)',
};

export async function mockLogin(_credentials: LoginCredentials): Promise<User> {
  await delay(400);
  return MOCK_USER;
}

export async function mockRegister(_credentials: RegisterCredentials): Promise<User> {
  await delay(500);
  return MOCK_USER;
}

export async function mockLogout(): Promise<void> {
  await delay(100);
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
