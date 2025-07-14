import { render, screen } from '@testing-library/react';
import TableCell from '../TableCell';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('TableCell', () => {
  it('renders its children correctly', () => {
    render(<TableCell>Test Content</TableCell>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies additional TD attributes such as colSpan', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell colSpan={3}>Cell with colSpan</TableCell>
          </tr>
        </tbody>
      </table>
    );
    const cell = screen.getByText('Cell with colSpan');
    expect(cell.tagName).toBe('TD');
    expect(cell).toHaveAttribute('colspan', '3');
  });

  it('renders an icon when provided', () => {
    render(
      <TableCell icon={<span data-testid="icon">Icon</span>}>
        Cell Content
      </TableCell>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<TableCell className="custom-class">Custom Cell</TableCell>);
    const cell = screen.getByText('Custom Cell');
    expect(cell).toHaveClass('custom-class');
  });
});
