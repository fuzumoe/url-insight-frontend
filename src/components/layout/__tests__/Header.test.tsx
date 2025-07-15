import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { describe, it, expect, vi } from 'vitest';

describe('Header', () => {
  it('renders with default title', () => {
    render(<Header />);
    expect(screen.getByText('URL Insight')).toBeInTheDocument();
  });

  it('renders with custom title when provided', () => {
    render(<Header title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('calls toggleSidebar when the toggle button is clicked', () => {
    const toggleSidebar = vi.fn();
    render(<Header toggleSidebar={toggleSidebar} />);
    const toggleButton = screen.getByRole('button', {
      name: /toggle sidebar/i,
    });
    fireEvent.click(toggleButton);
    expect(toggleSidebar).toHaveBeenCalled();
  });

  it('renders search input with correct placeholder', () => {
    render(<Header />);
    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();
  });
});
