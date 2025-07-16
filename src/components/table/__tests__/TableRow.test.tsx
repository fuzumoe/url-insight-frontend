import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import TableRow from '../TableRow';

describe('TableRow', () => {
  it('renders children correctly', () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </TableRow>
        </tbody>
      </table>
    );
    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const variants = [
      { prop: 'highlight', expected: 'bg-yellow-50' },
      { prop: 'selected', expected: 'bg-blue-50' },
      { prop: 'error', expected: 'bg-red-50' },
      { prop: 'success', expected: 'bg-green-50' },
      { prop: 'warning', expected: 'bg-orange-50' },
    ] as const;

    variants.forEach(({ prop, expected }) => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow variant={prop}>
              <td>Test</td>
            </TableRow>
          </tbody>
        </table>
      );
      const tr = container.querySelector('tr');
      expect(tr).toHaveClass(expected);
    });
  });

  it('applies hover class when hover is true', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow hover>
            <td>Test</td>
          </TableRow>
        </tbody>
      </table>
    );
    const tr = container.querySelector('tr');
    expect(tr).toHaveClass('hover:bg-gray-50');
    expect(tr).toHaveClass('cursor-pointer');
  });

  it('appends additional className', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow className="custom-class">
            <td>Test</td>
          </TableRow>
        </tbody>
      </table>
    );
    const tr = container.querySelector('tr');
    expect(tr).toHaveClass('custom-class');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(
      <table>
        <tbody>
          <TableRow onClick={handleClick} hover>
            <td>Clickable</td>
          </TableRow>
        </tbody>
      </table>
    );
    const tr = screen.getByText('Clickable').closest('tr');
    fireEvent.click(tr!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
