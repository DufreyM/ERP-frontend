import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login, storeToken, getToken, removeToken, fetchProtectedData } from './authService';

// Mock de fetch global
global.fetch = vi.fn();

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('login', () => {
    it('debería hacer login exitosamente con credenciales válidas', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          token: 'mock-jwt-token',
          user: { id: 1, email: 'test@example.com' }
        })
      };
      
      global.fetch.mockResolvedValue(mockResponse);

      const result = await login('test@example.com', 'password123');

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: 'test@example.com', 
          contrasena: 'password123' 
        })
      });

      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: { id: 1, email: 'test@example.com' }
      });
    });

    it('debería lanzar error cuando las credenciales son inválidas', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: 'Credenciales inválidas'
        })
      };
      
      global.fetch.mockResolvedValue(mockResponse);

      await expect(login('invalid@example.com', 'wrongpassword'))
        .rejects.toThrow('Credenciales inválidas');
    });

    it('debería lanzar error genérico cuando no hay mensaje de error específico', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({})
      };
      
      global.fetch.mockResolvedValue(mockResponse);

      await expect(login('test@example.com', 'password123'))
        .rejects.toThrow('Error en la solicitud de inicio de sesión');
    });
  });

  describe('Token Management', () => {
    it('debería almacenar token en localStorage', () => {
      const token = 'test-jwt-token';
      storeToken(token);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('jwtToken', token);
    });

    it('debería obtener token de localStorage', () => {
      const token = 'test-jwt-token';
      localStorageMock.getItem.mockReturnValue(token);
      
      const result = getToken();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('jwtToken');
      expect(result).toBe(token);
    });

    it('debería retornar null cuando no hay token', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = getToken();
      
      expect(result).toBeNull();
    });

    it('debería remover token de localStorage', () => {
      removeToken();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('jwtToken');
    });
  });

  describe('fetchProtectedData', () => {
    it('debería obtener datos protegidos con token válido', async () => {
      const mockToken = 'valid-jwt-token';
      const mockData = { message: 'Datos protegidos' };
      
      localStorageMock.getItem.mockReturnValue(mockToken);
      
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockData)
      };
      
      global.fetch.mockResolvedValue(mockResponse);

      const result = await fetchProtectedData();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/protected', {
        headers: {
          'Authorization': `Bearer ${mockToken}`
        }
      });

      expect(result).toEqual(mockData);
    });

    it('debería lanzar error cuando no hay token', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      await expect(fetchProtectedData())
        .rejects.toThrow('No authentication token found');
    });

    it('debería lanzar error cuando la respuesta no es exitosa', async () => {
      const mockToken = 'valid-jwt-token';
      localStorageMock.getItem.mockReturnValue(mockToken);
      
      const mockResponse = {
        ok: false
      };
      
      global.fetch.mockResolvedValue(mockResponse);

      await expect(fetchProtectedData())
        .rejects.toThrow('Failed to fetch protected data');
    });
  });
});
