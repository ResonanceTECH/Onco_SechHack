import type { LoginCredentials, RegisterCredentials } from '../types';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8001';

// Флаг: использовать ли реальный backend вместо моков.
// По умолчанию выключен, чтобы не ломать локальную разработку без backend.
export const USE_REAL_API =
  typeof import.meta.env.VITE_USE_REAL_API === 'string'
    ? import.meta.env.VITE_USE_REAL_API === 'true'
    : false;

let csrfToken: string | null = null;

function updateCsrfFromResponse(response: Response) {
  const headerToken = response.headers.get('X-CSRF-Token');
  if (headerToken) {
    csrfToken = headerToken;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { skipCsrf?: boolean } = {},
): Promise<T> {
  const { skipCsrf, headers, ...rest } = options;

  const init: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
      ...(csrfToken && !skipCsrf ? { 'X-CSRF-Token': csrfToken } : {}),
    },
    ...rest,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, init);
  updateCsrfFromResponse(res);

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.detail) {
        message = typeof data.detail === 'string' ? data.detail : data.detail.message ?? message;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    // @ts-expect-error no content
    return null;
  }

  return (await res.json()) as T;
}

export const api = {
  // Auth endpoints
  async register(credentials: RegisterCredentials) {
    return request<{ status: string; csrf_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      // CSRF для /auth/register не нужен по настройкам backend
      skipCsrf: true,
    });
  },

  async login(credentials: LoginCredentials) {
    return request<{ access_token: string; csrf_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      skipCsrf: true,
    });
  },

  async me() {
    return request('/auth/me', { method: 'GET', skipCsrf: true });
  },

  async logout() {
    return request<{ status: string }>('/auth/logout', { method: 'POST' });
  },

  // Cases endpoints
  async getAllCases() {
    return request('/cases/all_cases', { method: 'GET', skipCsrf: true });
  },

  async getCase(id: number) {
    return request(`/cases/${id}`, { method: 'GET', skipCsrf: true });
  },

  async createCase(payload: {
    name: string;
    price: number;
    is_active: boolean;
    description: string;
  }) {
    return request('/cases', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateCase(id: number, payload: {
    name: string;
    price: number;
    is_active: boolean;
    description: string;
  }) {
    return request(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async patchCase(id: number, payload: Partial<{
    name: string;
    price: number;
    is_active: boolean;
    description: string;
  }>) {
    return request(`/cases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async deleteCase(id: number) {
    return request<{ status: string }>(`/cases/${id}`, {
      method: 'DELETE',
    });
  },
};

