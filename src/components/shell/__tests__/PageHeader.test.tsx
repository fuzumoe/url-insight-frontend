import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import PageHeader from '../PageHeader';

import type { ReactNode } from 'react';

vi.mock('../../layout', () => ({
  Flex: ({ children, direction, justify, align, className }) => (
    <div
      data-testid="flex-mock"
      data-direction={direction}
      data-justify={justify}
      data-align={align}
      className={className}
    >
      {children}
    </div>
  ),
  Box: ({ children, className }) => (
    <div data-testid="box-mock" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('../../containers/Stack', () => ({
  default: ({ children, spacing }) => (
    <div data-testid="stack-mock" data-spacing={spacing}>
      {children}
    </div>
  ),
}));

vi.mock('../../common/Typography', () => ({
  default: ({
    children,
    variant,
    weight,
    color,
  }: {
    children: ReactNode;
    variant: string;
    weight?: string;
    color?: string;
  }) => {
    const Tag = variant === 'h3' ? 'h3' : 'p';
    return (
      <Tag
        data-testid={`typography-${variant}`}
        data-weight={weight}
        data-color={color}
      >
        {children}
      </Tag>
    );
  },
}));

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
    const actionsBox = screen.queryByTestId('box-mock');
    expect(actionsBox).not.toBeInTheDocument();
  });

  it('passes correct props to layout components', () => {
    render(<PageHeader title="Test Title" actions={<span>Actions</span>} />);
    const flex = screen.getByTestId('flex-mock');
    expect(flex).toHaveAttribute('data-direction', 'column');
    expect(flex).toHaveAttribute('data-justify', 'between');
    expect(flex).toHaveAttribute('data-align', 'start');
    expect(flex.className).toContain('md:flex-row');
    expect(flex.className).toContain('md:items-center');
    expect(flex.className).toContain('mb-6');

    const stack = screen.getByTestId('stack-mock');
    expect(stack).toHaveAttribute('data-spacing', 'sm');

    const box = screen.getByTestId('box-mock');
    expect(box.className).toContain('mt-4');
    expect(box.className).toContain('md:mt-0');
  });

  it('uses Typography with correct variants', () => {
    render(<PageHeader title="Test Title" subtitle="Subtitle" />);
    const title = screen.getByTestId('typography-h3');
    expect(title).toHaveAttribute('data-weight', 'bold');
    expect(title).toHaveTextContent('Test Title');

    const subtitle = screen.getByTestId('typography-body2');
    expect(subtitle).toHaveAttribute('data-color', 'secondary');
    expect(subtitle).toHaveTextContent('Subtitle');
  });

  it('applies custom className when provided', () => {
    render(<PageHeader title="Test Title" className="custom-class" />);
    const flex = screen.getByTestId('flex-mock');
    expect(flex.className).toContain('custom-class');
  });
});
