import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../layout/Box', () => ({
  default: ({
    children,
    background,
    shadow,
    padding,
    rounded,
    className,
    ...props
  }: {
    children?: React.ReactNode;
    background?: string;
    shadow?: string;
    padding?: string;
    rounded?: string;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div
      data-testid={`box-${background}-${shadow}-${padding}-${rounded}`}
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
}));

vi.mock('../../layout/Flex', () => ({
  default: ({
    children,
    justify,
    align,
    gap,
    className,
  }: {
    children: React.ReactNode;
    justify?: string;
    align?: string;
    gap?: string;
    className?: string;
  }) => (
    <div
      data-testid={`flex-${justify || 'start'}-${align || 'start'}-${gap || 'none'}`}
      className={className}
    >
      {children}
    </div>
  ),
}));

vi.mock('../../common/Typography', () => ({
  default: ({
    children,
    variant,
    as: Component = 'span',
    className,
  }: {
    children: React.ReactNode;
    variant: string;
    as?: React.ElementType;
    className?: string;
  }) => (
    <Component data-testid={`typography-${variant}`} className={className}>
      {children}
    </Component>
  ),
}));

vi.mock('../../common/Button', () => ({
  default: ({
    children,
    variant,
    size,
    className,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    variant?: string;
    size?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    [key: string]: unknown;
  }) => (
    <button
      data-testid={`button-${variant}-${size}`}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
}));

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

  it('renders with correct layout components', () => {
    render(<Header />);

    const headerContainer = screen.getByRole('banner').querySelector('div');
    expect(headerContainer).not.toBeNull();
    expect(headerContainer).toHaveClass(
      'p-2',
      'sm:p-3',
      'bg-white',
      'shadow-sm'
    );

    const flexContainer = headerContainer!.querySelector('div');
    expect(flexContainer).toHaveClass(
      'flex',
      'justify-between',
      'items-center'
    );
  });

  it('renders all buttons with correct variants and sizes', () => {
    render(<Header />);

    const sidebarButton = screen.getByLabelText('Toggle sidebar');
    expect(sidebarButton).toHaveClass('lg:hidden');

    const notificationsButton = screen.getByLabelText('Notifications');
    expect(notificationsButton).toHaveClass('relative');

    const userButton = screen.getByLabelText('User menu');
    expect(userButton).toHaveClass('rounded-full', 'p-2');
  });

  it('renders Typography component with correct props', () => {
    render(<Header title="Test Title" />);

    const typography = screen.getByTestId('typography-h4');
    expect(typography).toBeInTheDocument();
    expect(typography).toHaveClass('text-xl', 'font-semibold', 'text-gray-800');
    expect(typography.tagName).toBe('H1');
    expect(typography).toHaveTextContent('Test Title');
  });

  it('applies correct styling classes', () => {
    render(<Header />);

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveClass('sticky', 'top-0', 'z-40');

    const searchContainer = screen
      .getByPlaceholderText('Search...')
      .closest('div');
    expect(searchContainer).toHaveClass('relative', 'hidden', 'md:block');

    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toHaveClass(
      'bg-gray-100',
      'px-4',
      'py-2',
      'pr-10',
      'rounded-lg',
      'text-sm',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500'
    );
  });

  it('renders notification dot on notifications button', () => {
    render(<Header />);

    const notificationButton = screen.getByLabelText('Notifications');
    const notificationDot = notificationButton.querySelector(
      '.absolute.-top-1.-right-1'
    );
    expect(notificationDot).toBeInTheDocument();
    expect(notificationDot).toHaveClass(
      'absolute',
      '-top-1',
      '-right-1',
      'block',
      'h-2',
      'w-2',
      'rounded-full',
      'bg-red-500'
    );
  });

  it('renders user avatar with correct styling', () => {
    render(<Header />);

    const userButton = screen.getByLabelText('User menu');
    const userAvatar = userButton.querySelector('.rounded-full.bg-blue-500');

    expect(userAvatar).toBeInTheDocument();
    expect(userAvatar).toHaveClass(
      'h-6',
      'w-6',
      'bg-blue-500',
      'flex',
      'items-center',
      'justify-center',
      'text-white'
    );
  });

  it('renders all icons correctly', () => {
    render(<Header />);

    const buttons = [
      screen.getByLabelText('Toggle sidebar'),
      screen.getByLabelText('Notifications'),
      screen.getByLabelText('User menu'),
    ];

    expect(buttons).toHaveLength(3);

    buttons.forEach(button => {
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  it('maintains semantic HTML structure', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('HEADER');

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
  });

  it('applies mobile-first responsive design', () => {
    render(<Header />);

    const sidebarButton = screen.getByLabelText('Toggle sidebar');
    expect(sidebarButton).toHaveClass('lg:hidden');

    const searchContainer = screen
      .getByPlaceholderText('Search...')
      .closest('div');
    expect(searchContainer).toHaveClass('hidden', 'md:block');
  });

  it('handles missing toggleSidebar prop gracefully', () => {
    render(<Header />);

    const toggleButton = screen.getByLabelText('Toggle sidebar');
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
  });

  it('renders with all required accessibility attributes', () => {
    render(<Header />);

    expect(screen.getByLabelText('Toggle sidebar')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('User menu')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toHaveAttribute('type', 'text');
  });
});
