import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '../Card';
import { describe, it, expect } from 'vitest';

describe('Card', () => {
  it('renders with required props only', () => {
    render(<Card title="Test Card" />);

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Test Card').tagName).toBe('H4');
  });

  it('renders with description', () => {
    render(<Card title="Test Card" description="This is a description" />);

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('renders with prominentText', () => {
    render(<Card title="Error Card" prominentText="404" />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('404').tagName).toBe('H1');
  });

  it('renders children content', () => {
    render(
      <Card title="Card with Children">
        <div data-testid="child-content">Child Content</div>
      </Card>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('applies different padding classes', () => {
    const { rerender } = render(<Card title="Small Padding" padding="small" />);

    let container = screen.getByText('Small Padding').closest('div');
    expect(container).toHaveClass('p-3', 'sm:p-4');

    rerender(<Card title="Medium Padding" padding="medium" />);
    container = screen.getByText('Medium Padding').closest('div');
    expect(container).toHaveClass('p-4', 'sm:p-5', 'md:p-6');

    rerender(<Card title="Large Padding" padding="large" />);
    container = screen.getByText('Large Padding').closest('div');
    expect(container).toHaveClass('p-6', 'sm:p-7', 'md:p-8');
  });

  it('applies different alignment classes', () => {
    const { rerender } = render(<Card title="Left Align" align="left" />);

    let container = screen.getByText('Left Align').closest('div');
    expect(container).toHaveClass('text-left');

    rerender(<Card title="Center Align" align="center" />);
    container = screen.getByText('Center Align').closest('div');
    expect(container).toHaveClass('text-center');

    rerender(<Card title="Right Align" align="right" />);
    container = screen.getByText('Right Align').closest('div');
    expect(container).toHaveClass('text-right');
  });

  it('applies different max-width classes', () => {
    const { rerender } = render(<Card title="No Max Width" maxWidth="none" />);

    let container = screen.getByText('No Max Width').closest('div');
    expect(container).not.toHaveClass(
      'max-w-sm',
      'max-w-md',
      'max-w-lg',
      'max-w-xl'
    );

    rerender(<Card title="Small Max Width" maxWidth="sm" />);
    container = screen.getByText('Small Max Width').closest('div');
    expect(container).toHaveClass('max-w-sm');

    rerender(<Card title="Medium Max Width" maxWidth="md" />);
    container = screen.getByText('Medium Max Width').closest('div');
    expect(container).toHaveClass('max-w-md');

    rerender(<Card title="Large Max Width" maxWidth="lg" />);
    container = screen.getByText('Large Max Width').closest('div');
    expect(container).toHaveClass('max-w-lg');

    rerender(<Card title="XL Max Width" maxWidth="xl" />);
    container = screen.getByText('XL Max Width').closest('div');
    expect(container).toHaveClass('max-w-xl');
  });

  it('applies custom className', () => {
    render(<Card title="Custom Class" className="custom-class" />);

    const container = screen.getByText('Custom Class').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('applies different typography variants for title', () => {
    const { rerender } = render(<Card title="H2 Title" titleVariant="h2" />);

    expect(screen.getByText('H2 Title').tagName).toBe('H2');

    rerender(<Card title="H3 Title" titleVariant="h3" />);
    expect(screen.getByText('H3 Title').tagName).toBe('H3');
  });

  it('applies typography weight for title', () => {
    render(<Card title="Bold Title" titleWeight="bold" />);

    const title = screen.getByText('Bold Title');
    expect(title).toHaveClass('font-bold');
  });

  it('applies typography color for title and description', () => {
    render(
      <Card
        title="Colored Title"
        description="Colored Description"
        titleColor="primary"
        descriptionColor="error"
      />
    );

    const title = screen.getByText('Colored Title');
    const description = screen.getByText('Colored Description');

    expect(title).toHaveClass('text-blue-600');
    expect(description).toHaveClass('text-red-600');
  });

  it('renders an error card with all relevant props', () => {
    render(
      <Card
        prominentText="404"
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        align="center"
        padding="large"
        maxWidth="md"
      >
        <button data-testid="home-button">Go to Home</button>
      </Card>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(
      screen.getByText("The page you're looking for doesn't exist.")
    ).toBeInTheDocument();
    expect(screen.getByTestId('home-button')).toBeInTheDocument();

    const container = screen.getByText('404').closest('div');
    expect(container).toHaveClass('text-center', 'max-w-md', 'p-6');
  });

  it('renders a dashboard card with all relevant props', () => {
    render(
      <Card
        title="Recent Activity"
        description="Your activity from the past 30 days"
        padding="medium"
      >
        <div data-testid="activity-list">Activity content</div>
      </Card>
    );

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(
      screen.getByText('Your activity from the past 30 days')
    ).toBeInTheDocument();
    expect(screen.getByTestId('activity-list')).toBeInTheDocument();

    const container = screen.getByText('Recent Activity').closest('div');
    expect(container).toHaveClass('p-4', 'sm:p-5', 'md:p-6');
  });
});
