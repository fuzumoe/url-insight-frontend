import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableHeaderCell from '../TableHeaderCell';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';

describe('TableHeaderCell', () => {
  const renderInTable = (component: React.ReactElement) => {
    return render(
      <table>
        <tbody>
          <tr>{component}</tr>
        </tbody>
      </table>
    );
  };

  it('renders children correctly', () => {
    renderInTable(<TableHeaderCell>Test Header</TableHeaderCell>);
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('renders icon if provided', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    renderInTable(
      <TableHeaderCell icon={<TestIcon />}>Header with Icon</TableHeaderCell>
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Header with Icon')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const onClick = vi.fn();
    renderInTable(
      <TableHeaderCell onClick={onClick}>Clickable Header</TableHeaderCell>
    );
    fireEvent.click(screen.getByText('Clickable Header'));
    expect(onClick).toHaveBeenCalled();
  });

  it('applies mobile-first responsive padding', () => {
    renderInTable(<TableHeaderCell>Responsive Header</TableHeaderCell>);
    const headerCell = screen.getByText('Responsive Header').closest('th');
    expect(headerCell).toHaveClass('px-2');
    expect(headerCell).toHaveClass('py-1.5');
    expect(headerCell).toHaveClass('sm:px-6');
    expect(headerCell).toHaveClass('sm:py-3');
  });

  it('applies mobile-first responsive text sizing', () => {
    renderInTable(<TableHeaderCell>Text Sizing</TableHeaderCell>);
    const headerCell = screen.getByText('Text Sizing').closest('th');
    expect(headerCell).toHaveClass('text-xs');
    expect(headerCell).toHaveClass('sm:text-sm');
  });

  it('uses mobile-first responsive min-height', () => {
    renderInTable(<TableHeaderCell>Min Height</TableHeaderCell>);
    const container = screen.getByText('Min Height').closest('div');
    expect(container).toHaveClass('min-h-[32px]');
    expect(container).toHaveClass('sm:min-h-[40px]');
  });

  it('applies mobile-first icon sizing and spacing', () => {
    const iconElement = <span data-testid="test-icon">Icon</span>;

    renderInTable(
      <TableHeaderCell icon={iconElement}>Icon Sizing</TableHeaderCell>
    );

    const iconContainer = screen
      .getByTestId('test-icon')
      .closest('span')!.parentElement;
    expect(iconContainer).toHaveClass('ml-1');
    expect(iconContainer).toHaveClass('sm:ml-2');

    const icon = screen.getByTestId('test-icon');
    expect(icon).toHaveClass('w-3.5');
    expect(icon).toHaveClass('h-3.5');
    expect(icon).toHaveClass('sm:w-4');
    expect(icon).toHaveClass('sm:h-4');
  });

  it('applies cursor-pointer class when onClick is provided', () => {
    const onClick = vi.fn();
    renderInTable(
      <TableHeaderCell onClick={onClick}>Clickable Header</TableHeaderCell>
    );
    const headerCell = screen.getByText('Clickable Header').closest('th');
    expect(headerCell).toHaveClass('cursor-pointer');
  });

  it('does not apply cursor-pointer class when onClick is not provided', () => {
    renderInTable(<TableHeaderCell>Non-Clickable Header</TableHeaderCell>);
    const headerCell = screen.getByText('Non-Clickable Header').closest('th');
    expect(headerCell).not.toHaveClass('cursor-pointer');
  });
});
