import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PageHeader from '../PageHeader';

describe('PageHeader', () => {
  it('renders the title correctly', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeDefined();
  });

  it('renders subtitle when provided', () => {
    render(
      <PageHeader title="Test Title" subtitle="This is a test subtitle" />
    );
    expect(screen.getByText('This is a test subtitle')).toBeDefined();
  });

  it('does not render subtitle when not provided', () => {
    render(<PageHeader title="Test Title" />);
    const subtitle = screen.queryByText(/subtitle/i);
    expect(subtitle).toBeNull();
  });

  it('renders actions when provided', () => {
    render(
      <PageHeader
        title="Test Title"
        actions={<button data-testid="action-button">Action</button>}
      />
    );
    expect(screen.getByTestId('action-button')).toBeDefined();
    expect(screen.getByText('Action')).toBeDefined();
  });

  it('does not render actions container when actions not provided', () => {
    render(<PageHeader title="Test Title" />);
    const actionsDiv = document.querySelector('.mt-4');
    expect(actionsDiv).toBeNull();
  });

  it('has the correct responsive layout classes', () => {
    render(<PageHeader title="Test Title" />);
    const header = screen.getByText('Test Title').closest('div')!.parentElement;
    expect(header?.className).toContain('flex-col');
    expect(header?.className).toContain('md:flex-row');
    expect(header?.className).toContain('md:items-center');
    expect(header?.className).toContain('md:justify-between');
  });
});
