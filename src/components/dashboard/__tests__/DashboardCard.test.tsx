import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import DashboardCard from '../DashboardCard';

describe('DashboardCard', () => {
  it('renders the title correctly', () => {
    render(<DashboardCard title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <DashboardCard
        title="Test Title"
        description="This is a test description"
      />
    );
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<DashboardCard title="Test Title" />);
    const description = screen.queryByText(/description/i);
    expect(description).toBeNull();
  });

  it('renders children correctly', () => {
    render(
      <DashboardCard title="Test Title">
        <div data-testid="child-element">Child Content</div>
      </DashboardCard>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('has the correct styling classes', () => {
    render(<DashboardCard title="Test Title" />);
    const card = screen.getByText('Test Title').closest('div');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('shadow');
    expect(card).toHaveClass('p-6');
  });

  it('uses Typography component with correct props', () => {
    render(<DashboardCard title="Test Title" />);
    const titleElement = screen.getByText('Test Title');

    expect(titleElement.tagName).toBe('H4');

    expect(titleElement).toHaveClass('text-lg');
    expect(titleElement).toHaveClass('md:text-xl');
  });
});
