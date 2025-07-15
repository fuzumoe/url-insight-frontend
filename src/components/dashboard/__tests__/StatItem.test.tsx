import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StatItem from '../StatItem';

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
    const { container } = render(
      <StatItem label="Users" value={42} className="custom-class" />
    );
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv.className).toContain('custom-class');
  });

  it('has the correct default classes', () => {
    const { container } = render(<StatItem label="Users" value={42} />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv.className).toContain('flex');
    expect(mainDiv.className).toContain('items-center');
    expect(mainDiv.className).toContain('space-x-3');

    const valueElement = screen.getByText('42');
    expect(valueElement.className).toContain('text-lg');
    expect(valueElement.className).toContain('font-bold');

    const labelElement = screen.getByText('Users');
    expect(labelElement.className).toContain('text-gray-500');
    expect(labelElement.className).toContain('text-sm');
  });
});
