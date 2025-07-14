import { render, screen } from '@testing-library/react';
import ChartPanel from '../ChartPanel';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('ChartPanel', () => {
  it('renders the title and children', () => {
    render(
      <ChartPanel title="Test Panel">
        <div data-testid="child">Child Content</div>
      </ChartPanel>
    );

    const titleElement = screen.getByText('Test Panel');

    expect(titleElement).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
  });

  it('applies custom class names', () => {
    render(
      <ChartPanel
        title="Custom Panel"
        className="custom-class"
        titleClassName="custom-title"
      >
        <div>Dummy Content</div>
      </ChartPanel>
    );

    const titleElement = screen.getByText('Custom Panel');
    expect(titleElement).toHaveClass('custom-title');

    const panelElement = titleElement.closest('div');
    expect(panelElement).toHaveClass('custom-class');
  });
});
