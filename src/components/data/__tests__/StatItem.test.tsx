import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import StatItem from '../StatItem';

vi.mock('../../../components/layout', () => ({
  Flex: ({
    children,
    align,
    gap,
    className,
  }: {
    children: React.ReactNode;
    align?: string;
    gap?: string;
    className?: string;
  }) => (
    <div
      data-testid="flex-mock"
      data-align={align}
      data-gap={gap}
      className={className}
    >
      {children}
    </div>
  ),
}));

describe('StatItem', () => {
  it('renders label and value correctly', () => {
    render(<StatItem label="Users" value={42} />);
    expect(screen.getByText('Users')).toBeDefined();
    expect(screen.getByText('42')).toBeDefined();
  });

  it('renders string values correctly', () => {
    render(<StatItem label="Status" value="Active" />);
    expect(screen.getByText('Status')).toBeDefined();
    expect(screen.getByText('Active')).toBeDefined();
  });

  it('renders icon when provided', () => {
    render(
      <StatItem
        label="Users"
        value={42}
        icon={<span data-testid="test-icon">🧑</span>}
      />
    );
    expect(screen.getByTestId('test-icon')).toBeDefined();
  });

  it('does not render icon container when icon not provided', () => {
    render(<StatItem label="Users" value={42} />);
    const iconSpan = screen.queryByText('🧑');
    expect(iconSpan).toBeNull();
  });

  it('applies custom className when provided', () => {
    render(<StatItem label="Users" value={42} className="custom-class" />);
    const flexComponent = screen.getByTestId('flex-mock');
    // Use className property instead of getAttribute('className')
    expect(flexComponent.className).toBe('custom-class');
  });

  it('passes correct props to Flex component', () => {
    render(<StatItem label="Users" value={42} />);

    const flexComponent = screen.getByTestId('flex-mock');
    expect(flexComponent.getAttribute('data-align')).toBe('center');
    expect(flexComponent.getAttribute('data-gap')).toBe('sm');
  });

  it('applies responsive typography classes to value and label', () => {
    render(<StatItem label="Users" value={42} />);

    const valueElement = screen.getByText('42');
    const valueClasses = valueElement.className || '';
    expect(valueClasses.includes('text-base')).toBe(true);
    expect(valueClasses.includes('sm:text-lg')).toBe(true);
    expect(valueClasses.includes('font-bold')).toBe(true);

    const labelElement = screen.getByText('Users');
    const labelClasses = labelElement.className || '';
    expect(labelClasses.includes('text-gray-500')).toBe(true);
    expect(labelClasses.includes('text-xs')).toBe(true);
    expect(labelClasses.includes('sm:text-sm')).toBe(true);
  });

  it('applies responsive typography classes to icon when provided', () => {
    render(
      <StatItem
        label="Users"
        value={42}
        icon={<span data-testid="test-icon">🧑</span>}
      />
    );

    const iconContainer = screen.getByTestId('test-icon').parentElement;
    if (!iconContainer) throw new Error('Icon container not found');

    const iconClasses = iconContainer.className || '';
    expect(iconClasses.includes('text-xl')).toBe(true);
    expect(iconClasses.includes('sm:text-2xl')).toBe(true);
    expect(iconClasses.includes('text-gray-600')).toBe(true);
  });
});
