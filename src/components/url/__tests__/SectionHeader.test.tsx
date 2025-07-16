import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import SectionHeader from '../SectionHeader';
describe('SectionHeader', () => {
  it('renders the title as an h2 with correct class', () => {
    render(<SectionHeader title="Test Title" titleClassName="custom-title" />);
    const titleEl = screen.getByText('Test Title');
    expect(titleEl).toBeInTheDocument();
    expect(titleEl.tagName).toBe('H2');
    expect(titleEl).toHaveClass('custom-title');
  });

  it('renders the actions when provided with correct class', () => {
    render(
      <SectionHeader
        title="Test Title"
        actions={<button>Click me</button>}
        actionsClassName="custom-actions"
      />
    );
    const actionsContainer = screen.getByRole('button', {
      name: /click me/i,
    }).parentElement;
    expect(actionsContainer).toHaveClass('custom-actions');
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument();
  });

  it('does not render an actions container when no actions provided', () => {
    render(<SectionHeader title="Test Title" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies custom className to Flex container', () => {
    render(<SectionHeader title="Test Title" className="custom-flex" />);
    const flexContainer = screen.getByText('Test Title').closest('div');
    expect(flexContainer).toHaveClass('custom-flex');
  });
});
