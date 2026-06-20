import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Logo } from './Logo';

describe('Logo Component', () => {
  it('renders the logo correctly', () => {
    render(<Logo />);
    
    // Check if Carbon and Lens text nodes exist
    expect(screen.getByText('Carbon')).toBeDefined();
    expect(screen.getByText('Lens')).toBeDefined();
  });
});
