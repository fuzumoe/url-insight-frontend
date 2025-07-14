import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableHeaderCell from '../TableHeaderCell';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';

describe('TableHeaderCell', () => {
  // Wrap in table and tr elements since th must be within a table row.
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
});
