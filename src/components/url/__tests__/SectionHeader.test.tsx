import { render, screen } from '@testing-library/react';
import SectionHeader from '../SectionHeader';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('SectionHeader', () => {
  it('renders the title correctly', () => {
    render(<SectionHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the actions when provided', () => {
    render(
      <SectionHeader title="Test Title" actions={<button>Click me</button>} />
    );
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument();
  });

  it('does not render an actions container when no actions provided', () => {
    render(<SectionHeader title="Test Title" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
