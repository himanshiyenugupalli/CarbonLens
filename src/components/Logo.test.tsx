import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Logo, LogoMark } from './Logo';

describe('Logo Component', () => {
  it('renders the LogoMark SVG', () => {
    render(<LogoMark />);
    const svg = screen.getByRole('img', { name: /carbonlens logo/i });
    expect(svg).toBeInTheDocument();
  });

  it('renders the wordmark by default', () => {
    render(<Logo />);
    expect(screen.getByText('Carbon')).toBeInTheDocument();
    expect(screen.getByText('Lens')).toBeInTheDocument();
  });

  it('does not render wordmark when withWordmark is false', () => {
    render(<Logo withWordmark={false} />);
    expect(screen.queryByText('Carbon')).not.toBeInTheDocument();
  });
});
