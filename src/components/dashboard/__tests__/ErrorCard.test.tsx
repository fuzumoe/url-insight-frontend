import { render, screen } from '@testing-library/react';
import ErrorCard from '../ErrorCard';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('ErrorCard', () => {
  const defaultProps = {
    errorCode: '404',
    title: 'Page Not Found',
  };

  test('renders error code and title correctly', () => {
    render(<ErrorCard {...defaultProps} />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  test('renders description when provided', () => {
    const description = 'The page you are looking for does not exist';
    render(<ErrorCard {...defaultProps} description={description} />);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  test('does not render description when not provided', () => {
    render(<ErrorCard {...defaultProps} />);
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  test('renders children when provided', () => {
    render(
      <ErrorCard {...defaultProps}>
        <button>Go Back</button>
      </ErrorCard>
    );
    expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
  });

  test('applies correct Typography components with proper hierarchy', () => {
    render(<ErrorCard {...defaultProps} />);

    const container = screen.getByText('404').closest('div.bg-white');
    expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-lg', 'p-8');

    const errorCode = screen.getByText('404');
    expect(errorCode.tagName).toBe('H1');

    const title = screen.getByText('Page Not Found');
    expect(title.tagName).toBe('H2');
  });
});
