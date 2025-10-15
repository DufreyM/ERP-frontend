import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, storeToken, getToken, removeToken, fetchProtectedData } from './authService'; 

// Simular localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: () => { store = {} }
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});

describe('Auth Module', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('login should send POST request with email and password', async () => {
    const fakeResponse = { token: 'abc123' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeResponse)
    });

    const result = await login('test@example.com', '123456');

    expect(global.fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_URL}/auth/login`, expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', contrasena: '123456' })
    }));
    expect(result).toEqual(fakeResponse);
  });

  it('should store, retrieve and remove token correctly', () => {
    storeToken('my-jwt-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('jwtToken', 'my-jwt-token');

    const token = getToken();
    expect(localStorage.getItem).toHaveBeenCalledWith('jwtToken');
    expect(token).toBe('my-jwt-token');

    removeToken();
    expect(localStorage.removeItem).toHaveBeenCalledWith('jwtToken');
  });

  it('fetchProtectedData should include Authorization header with token', async () => {
    storeToken('test-token');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'protected' })
    });

    const data = await fetchProtectedData();

    expect(global.fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_URL}/protected`, {
      headers: { Authorization: 'Bearer test-token' }
    });
    expect(data).toEqual({ data: 'protected' });
  });
});
