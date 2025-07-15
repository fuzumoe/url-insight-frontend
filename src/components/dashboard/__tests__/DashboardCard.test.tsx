import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DashboardCard from '../DashboardCard';

describe('DashboardCard', () => {
  it('renders the title correctly', () => {
    render(<DashboardCard title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeDefined();
  });

  it('renders description when provided', () => {
    render(
      <DashboardCard
        title="Test Title"
        description="This is a test description"
      />
    );
    expect(screen.getByText('This is a test description')).toBeDefined();
  });

  it('does not render description when not provided', () => {
    render(<DashboardCard title="Test Title" />);
    // Using a query instead of getBy because we expect it not to exist
    const description = screen.queryByText(/description/i);
    expect(description).toBeNull();
  });

  it('renders children correctly', () => {
    render(
      <DashboardCard title="Test Title">
        <div data-testid="child-element">Child Content</div>
      </DashboardCard>
    );
    expect(screen.getByTestId('child-element')).toBeDefined();
    expect(screen.getByText('Child Content')).toBeDefined();
  });

  it('has the correct styling classes', () => {
    render(<DashboardCard title="Test Title" />);
    const card = screen.getByText('Test Title').closest('div');

    // Check individual classes are present in the className string
    expect(card?.className).toContain('bg-white');
    expect(card?.className).toContain('rounded-lg');
    expect(card?.className).toContain('shadow');
    expect(card?.className).toContain('p-6');
  });
});
