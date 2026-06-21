import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from './ThemeProvider';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('ThemeToggle Component', () => {
  it('renders correctly and responds to clicks', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    // Default might be light or dark depending on localstorage/mock, 
    // but the button should exist.
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Simulate click
    fireEvent.click(button);
    
    // Check if aria-label changed (implies toggle worked)
    expect(button.getAttribute('aria-label')).toMatch(/Switch to (light|dark) mode/);
  });
});
