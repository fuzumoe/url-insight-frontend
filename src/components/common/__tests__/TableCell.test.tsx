import React from 'react';
import { render, screen } from '@testing-library/react';
import TableCell from '../TableCell';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

const renderInTable = (component: React.ReactElement) => {
  return render(
    <table>
      <tbody>
        <tr>{component}</tr>
      </tbody>
    </table>
  );
};

describe('TableCell', () => {
  it('renders children correctly', () => {
    renderInTable(<TableCell>Test Content</TableCell>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders icon if provided', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    renderInTable(<TableCell icon={<TestIcon />}>Content with Icon</TableCell>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Content with Icon')).toBeInTheDocument();
  });

  it('applies additional className to td element', () => {
    renderInTable(
      <TableCell className="custom-class">Styled Content</TableCell>
    );
    const tdElement = screen.getByText('Styled Content').closest('td');
    expect(tdElement).toHaveClass('custom-class');
  });
});
