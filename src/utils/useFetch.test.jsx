import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from './useFetch';

// Mock de fetch global
global.fetch = vi.fn();

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('debería hacer fetch exitoso y retornar datos', async () => {
    const mockData = { id: 1, name: 'Test Item' };
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData)
    };
    
    global.fetch.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetch('https://api.example.com/data'));

    // Estado inicial
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    // Esperar a que termine el fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data', {});
  });

  it('debería manejar errores de red', async () => {
    const mockResponse = {
      ok: false,
      status: 404
    };
    
    global.fetch.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFetch('https://api.example.com/notfound'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('Error 404');
    expect(result.current.loading).toBe(false);
  });

  it('debería manejar errores de red cuando fetch falla', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFetch('https://api.example.com/error'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('Network error');
    expect(result.current.loading).toBe(false);
  });

  it('debería manejar errores genéricos', async () => {
    global.fetch.mockRejectedValue(new Error('Error desconocido'));

    const { result } = renderHook(() => useFetch('https://api.example.com/error'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('Error desconocido');
  });

  it('no debería hacer fetch cuando la URL es null o undefined', () => {
    const { result } = renderHook(() => useFetch(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('no debería hacer fetch cuando la URL es una cadena vacía', () => {
    const { result } = renderHook(() => useFetch(''));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('debería usar opciones personalizadas en el fetch', async () => {
    const mockData = { success: true };
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData)
    };
    
    global.fetch.mockResolvedValue(mockResponse);

    const customOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
      },
      body: JSON.stringify({ test: 'data' })
    };

    const { result } = renderHook(() => useFetch('https://api.example.com/post', customOptions));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/post', customOptions);
    expect(result.current.data).toEqual(mockData);
  });

  it('debería re-ejecutar fetch cuando cambian las dependencias', async () => {
    const mockData1 = { id: 1 };
    const mockData2 = { id: 2 };
    
    const mockResponse1 = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData1)
    };
    
    const mockResponse2 = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData2)
    };

    global.fetch
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const { result, rerender } = renderHook(
      ({ url, deps }) => useFetch(url, {}, deps),
      { initialProps: { url: 'https://api.example.com/data1', deps: [1] } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData1);

    // Cambiar dependencias
    rerender({ url: 'https://api.example.com/data2', deps: [2] });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData2);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('debería limpiar el estado de error cuando se hace un nuevo fetch exitoso', async () => {
    // Primero un error
    const mockErrorResponse = {
      ok: false,
      status: 500
    };
    
    // Luego un éxito
    const mockSuccessResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true })
    };

    global.fetch
      .mockResolvedValueOnce(mockErrorResponse)
      .mockResolvedValueOnce(mockSuccessResponse);

    const { result, rerender } = renderHook(
      ({ url }) => useFetch(url),
      { initialProps: { url: 'https://api.example.com/error' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error 500');
    expect(result.current.data).toBe(null);

    // Hacer un nuevo fetch exitoso
    rerender({ url: 'https://api.example.com/success' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual({ success: true });
  });
}); 