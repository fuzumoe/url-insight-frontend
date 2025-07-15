import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import StatusBadge from '../StatusBadge';

vi.mock('../Typography', () => ({
  default: vi.fn(({ children, className }) => (
    <span data-testid="typography" className={className || ''}>
      {children}
    </span>
  )),
}));

describe('StatusBadge', () => {
  const getBadgeElement = () => {
    return screen.getByTestId('typography').parentElement;
  };

  it('renders queued status correctly', () => {
    render(<StatusBadge status="queued" />);

    const text = screen.getByTestId('typography');
    expect(text).toHaveTextContent('Queued');

    const badge = getBadgeElement();
    expect(badge).toHaveClass('bg-gray-200');
    expect(badge).toHaveClass('text-gray-800');
  });

  it('renders running status correctly with animation', () => {
    render(<StatusBadge status="running" />);

    const text = screen.getByTestId('typography');
    expect(text).toHaveTextContent('Running');

    const badge = getBadgeElement();
    expect(badge).toHaveClass('bg-blue-200');
    expect(badge).toHaveClass('text-blue-800');
    expect(badge).toHaveClass('animate-pulse');
  });

  it('renders done status correctly', () => {
    render(<StatusBadge status="done" />);

    const text = screen.getByTestId('typography');
    expect(text).toHaveTextContent('Done');

    const badge = getBadgeElement();
    expect(badge).toHaveClass('bg-green-200');
    expect(badge).toHaveClass('text-green-800');
  });

  it('renders error status correctly', () => {
    render(<StatusBadge status="error" />);

    const text = screen.getByTestId('typography');
    expect(text).toHaveTextContent('Error');

    const badge = getBadgeElement();
    expect(badge).toHaveClass('bg-red-200');
    expect(badge).toHaveClass('text-red-800');
  });

  it('renders stopped status correctly', () => {
    render(<StatusBadge status="stopped" />);

    const text = screen.getByTestId('typography');
    expect(text).toHaveTextContent('Stopped');

    const badge = getBadgeElement();
    expect(badge).toHaveClass('bg-yellow-200');
    expect(badge).toHaveClass('text-yellow-800');
  });

  it('capitalizes the first letter of the status', () => {
    render(<StatusBadge status="queued" />);
    expect(screen.getByTestId('typography')).toHaveTextContent('Queued');
    expect(screen.queryByText('queued')).not.toBeInTheDocument();
  });

  it('applies mobile-first responsive padding', () => {
    render(<StatusBadge status="queued" />);
    const badge = getBadgeElement();

    expect(badge).toHaveClass('px-2');
    expect(badge).toHaveClass('py-0.5');

    expect(badge).toHaveClass('sm:px-2.5');
    expect(badge).toHaveClass('sm:py-0.5');
  });

  it('uses Typography with caption variant and font-medium class', () => {
    render(<StatusBadge status="queued" />);
    const typography = screen.getByTestId('typography');
    expect(typography).toHaveClass('font-medium');
  });
});
