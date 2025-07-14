import { render, screen } from '@testing-library/react';
import ChartPanel from '../ChartPanel';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('ChartPanel', () => {
  it('renders the title and children', () => {
    render(
      <ChartPanel title="Test Chart Panel">
        <div data-testid="child-content">Chart Content</div>
      </ChartPanel>
    );
    expect(screen.getByText('Test Chart Panel')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toHaveTextContent(
      'Chart Content'
    );
  });

  it('applies custom class names', () => {
    render(
      <ChartPanel
        title="Custom Class Chart"
        className="custom-panel"
        titleClassName="custom-title"
      >
        <div>Dummy</div>
      </ChartPanel>
    );
    const titleElement = screen.getByText('Custom Class Chart');
    expect(titleElement).toHaveClass('custom-title');

    const panelElement = titleElement.closest('div');
    expect(panelElement).toHaveClass('custom-panel');
  });
});
