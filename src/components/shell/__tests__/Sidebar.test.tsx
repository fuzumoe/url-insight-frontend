import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth, useToast } from '../../../hooks';

vi.mock('../../../hooks', () => ({
  useAuth: vi.fn(),
  useToast: vi.fn(),
}));

describe('Sidebar', () => {
  const mockLogout = vi.fn();
  const mockAddToast = vi.fn();
  const mockOnClose = vi.fn();

  type MockedFunction = {
    mockReturnValue: <T>(value: T) => void;
    mockResolvedValue: <T>(value: T) => void;
    mockRejectedValue: (reason: Error | unknown) => void;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as unknown as MockedFunction).mockReturnValue({
      addToast: mockAddToast,
    });

    (useAuth as unknown as MockedFunction).mockReturnValue({
      logout: mockLogout,
      loading: false,
    });
  });

  it('renders correctly when open', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(screen.getByText('URL Insight')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('URLs')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('renders correctly when closed', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={false} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const sidebar = screen.getByText('URL Insight').closest('aside');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  it('displays mobile overlay only when open', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const overlay = document.querySelector('.fixed.inset-0.bg-gray-600');
    expect(overlay).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <Sidebar isOpen={false} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(
      document.querySelector('.fixed.inset-0.bg-gray-600')
    ).not.toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const overlay = document.querySelector('.fixed.inset-0.bg-gray-600');
    fireEvent.click(overlay!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders all navigation items with correct links', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const expectedLinks = [
      { text: 'Dashboard', path: '/dashboard' },
      { text: 'URLs', path: '/urls' },
      { text: 'Analytics', path: '/analytics' },
      { text: 'Settings', path: '/settings' },
    ];

    expectedLinks.forEach(({ text, path }) => {
      const linkElement = screen.getByText(text).closest('a');
      expect(linkElement).toHaveAttribute('href', path);
    });
  });

  it('handles successful logout', async () => {
    mockLogout.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Log out').closest('button');
    fireEvent.click(logoutButton!);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        message: 'You have been logged out successfully',
        variant: 'success',
      });
    });
  });

  it('handles logout error', async () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();

    try {
      const error = new Error('Logout failed');
      mockLogout.mockRejectedValue(error);

      render(
        <MemoryRouter>
          <Sidebar isOpen={true} onClose={mockOnClose} />
        </MemoryRouter>
      );

      const logoutButton = screen.getByText('Log out').closest('button');
      fireEvent.click(logoutButton!);

      expect(mockLogout).toHaveBeenCalledTimes(1);

      await vi.waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith({
          message: 'Logout failed, but you have been logged out locally',
          variant: 'warning',
        });
      });
    } finally {
      console.error = originalConsoleError;
    }
  });

  it('shows loading state on logout button when loading', () => {
    (useAuth as unknown as MockedFunction).mockReturnValue({
      logout: mockLogout,
      loading: true,
    });

    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button');
    expect(logoutButton).toBeDisabled();
    expect(logoutButton).toHaveTextContent(/loading/i);
  });

  it('renders responsive classes correctly', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const overlay = document.querySelector('.fixed.inset-0.bg-gray-600');
    expect(overlay).toHaveClass('lg:hidden');

    const sidebar = screen.getByText('URL Insight').closest('aside');
    expect(sidebar).toHaveClass('translate-x-0');
  });

  it('applies correct animation classes', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const sidebar = screen.getByText('URL Insight').closest('aside');
    expect(sidebar).toHaveClass(
      'transform',
      'transition-transform',
      'duration-300',
      'ease-in-out'
    );
  });

  it('applies correct z-index for stacking', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const overlay = document.querySelector('.fixed.inset-0.bg-gray-600');
    expect(overlay).toHaveClass('z-20');

    const sidebar = screen.getByText('URL Insight').closest('aside');
    expect(sidebar).toHaveClass('z-30');
  });

  it('renders with semantic HTML elements', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'URL Insight'
    );
  });

  it('applies correct styles to navigation items', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const navItems = screen.getAllByRole('link');
    navItems.forEach(item => {
      expect(item).toHaveClass(
        'flex',
        'items-center',
        'px-6',
        'py-3',
        'text-gray-700',
        'hover:bg-blue-50',
        'hover:text-blue-600',
        'transition-colors'
      );
    });
  });

  it('applies correct styles to logout button', () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Log out').closest('button');
    expect(logoutButton).toHaveClass(
      'justify-start',
      'text-gray-700',
      'hover:text-red-600'
    );
  });

  it('handles missing onClose prop gracefully', () => {
    expect(() => {
      render(
        <MemoryRouter>
          <Sidebar isOpen={true} />
        </MemoryRouter>
      );

      const overlay = document.querySelector('.fixed.inset-0.bg-gray-600');
      fireEvent.click(overlay!);
    }).not.toThrow();
  });
});
