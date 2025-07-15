import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import PageHeader from '../PageHeader';

describe('PageHeader', () => {
  it('renders the title correctly', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <PageHeader title="Test Title" subtitle="This is a test subtitle" />
    );
    expect(screen.getByText('This is a test subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<PageHeader title="Test Title" />);
    const subtitle = screen.queryByText(/subtitle/i);
    expect(subtitle).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <PageHeader
        title="Test Title"
        actions={<button data-testid="action-button">Action</button>}
      />
    );
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('does not render actions container when actions not provided', () => {
    render(<PageHeader title="Test Title" />);
    const actionsDiv = document.querySelector('.mt-4');
    expect(actionsDiv).not.toBeInTheDocument();
  });

  it('has the correct responsive layout classes', () => {
    render(<PageHeader title="Test Title" />);
    const header = screen.getByText('Test Title').closest('div')!.parentElement;
    expect(header).toHaveClass(
      'flex-col',
      'md:flex-row',
      'md:items-center',
      'md:justify-between'
    );
  });

  it('uses Typography with correct hierarchy', () => {
    render(<PageHeader title="Test Title" subtitle="Subtitle" />);

    const title = screen.getByText('Test Title');
    expect(title.tagName).toBe('H3');

    const subtitle = screen.getByText('Subtitle');
    expect(subtitle.tagName).toBe('P');
  });
});
