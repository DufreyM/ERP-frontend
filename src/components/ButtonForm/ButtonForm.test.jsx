import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ButtonForm from './ButtonForm';

// Mock del archivo CSS module
vi.mock('./ButtonForm.module.css', () => ({
  default: {
    divButtonForm: 'button-form-class'
  }
}));

describe('ButtonForm', () => {
  it('debería renderizar el botón con el texto proporcionado', () => {
    const text = 'Iniciar Sesión';
    render(<ButtonForm text={text} onClick={() => {}} />);
    
    const button = screen.getByRole('button', { name: text });
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe(text);
  });

  it('debería aplicar la clase CSS correcta', () => {
    const text = 'Registrarse';
    render(<ButtonForm text={text} onClick={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button-form-class');
  });

  it('debería ejecutar la función onClick cuando se hace click', () => {
    const text = 'Enviar';
    const mockOnClick = vi.fn();
    
    render(<ButtonForm text={text} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('debería ejecutar onClick múltiples veces cuando se hace click repetidamente', () => {
    const text = 'Guardar';
    const mockOnClick = vi.fn();
    
    render(<ButtonForm text={text} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it('debería renderizar con texto vacío si se proporciona', () => {
    const text = '';
    render(<ButtonForm text={text} onClick={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button.textContent).toBe('');
  });

  it('debería renderizar con texto que contenga caracteres especiales', () => {
    const text = '¡Enviar & Guardar!';
    render(<ButtonForm text={text} onClick={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button.textContent).toBe(text);
  });

  it('debería ser accesible con el atributo role button', () => {
    const text = 'Accesible Button';
    render(<ButtonForm text={text} onClick={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('debería tener el tipo submit por defecto', () => {
    const text = 'Submit Button';
    render(<ButtonForm text={text} onClick={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button.type).toBe('submit');
  });

  it('debería manejar onClick que retorna un valor', () => {
    const text = 'Return Value';
    const mockOnClick = vi.fn().mockReturnValue('test-value');
    
    render(<ButtonForm text={text} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    const result = fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(expect.any(Object));
  });

  it('debería manejar onClick que es una función asíncrona', async () => {
    const text = 'Async Button';
    const mockOnClick = vi.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'async-result';
    });
    
    render(<ButtonForm text={text} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('debería renderizar correctamente con props undefined', () => {
    render(<ButtonForm text={undefined} onClick={undefined} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('');
  });

  it('debería renderizar correctamente con props null', () => {
    render(<ButtonForm text={null} onClick={null} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('');
  });

  it('debería mantener la funcionalidad después de múltiples re-renderizados', () => {
    const mockOnClick = vi.fn();
    const { rerender } = render(<ButtonForm text="Original" onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    
    // Re-renderizar con diferentes props
    rerender(<ButtonForm text="Updated" onClick={mockOnClick} />);
    
    const updatedButton = screen.getByRole('button');
    expect(updatedButton.textContent).toBe('Updated');
    
    fireEvent.click(updatedButton);
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  it('debería ser focusable con teclado', () => {
    const text = 'Keyboard Accessible';
    render(<ButtonForm text={text} onClick={() => {}} />);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
  });

  it('debería ser accesible con el elemento button nativo', () => {
    const text = 'Accessible Button';
    render(<ButtonForm text={text} onClick={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('debería tener el tipo submit por defecto', () => {
    const text = 'Submit Button';
    render(<ButtonForm text={text} onClick={() => {}} />);
    
    const button = screen.getByRole('button');
    expect(button.type).toBe('submit');
  });
}); 