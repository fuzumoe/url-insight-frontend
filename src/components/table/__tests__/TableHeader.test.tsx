import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import TableHeader from '../TableHeader';

describe('TableHeader', () => {
  it('renders children correctly', () => {
    render(
      <table>
        <TableHeader>
          <th>Header 1</th>
          <th>Header 2</th>
        </TableHeader>
      </table>
    );
    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Header 2')).toBeInTheDocument();
  });

  it('applies default background class', () => {
    const { container } = render(
      <table>
        <TableHeader>
          <th>Test</th>
        </TableHeader>
      </table>
    );
    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();
    expect(thead).toHaveClass('bg-gray-50');
  });

  it('applies correct background class based on background prop', () => {
    const backgrounds = [
      { prop: 'primary', expected: 'bg-primary-50' },
      { prop: 'secondary', expected: 'bg-secondary-50' },
      { prop: 'gray', expected: 'bg-gray-50' },
      { prop: 'white', expected: 'bg-white' },
      { prop: 'transparent', expected: 'bg-transparent' },
    ] as const;

    backgrounds.forEach(({ prop, expected }) => {
      const { container } = render(
        <table>
          <TableHeader background={prop}>
            <th>Test</th>
          </TableHeader>
        </table>
      );
      const thead = container.querySelector('thead');
      expect(thead).toBeInTheDocument();
      expect(thead).toHaveClass(expected);
    });
  });

  it('appends additional className when provided', () => {
    const { container } = render(
      <table>
        <TableHeader className="custom-class">
          <th>Test</th>
        </TableHeader>
      </table>
    );
    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();
    expect(thead).toHaveClass('bg-gray-50');
    expect(thead).toHaveClass('custom-class');
  });

  it('applies rowClassName to the tr element', () => {
    const { container } = render(
      <table>
        <TableHeader rowClassName="row-custom-class">
          <th>Test</th>
        </TableHeader>
      </table>
    );
    const tr = container.querySelector('tr');
    expect(tr).toBeInTheDocument();
    expect(tr).toHaveClass('row-custom-class');
  });

  it('combines background and custom classes correctly', () => {
    const { container } = render(
      <table>
        <TableHeader background="primary" className="custom-class">
          <th>Test</th>
        </TableHeader>
      </table>
    );
    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();
    expect(thead).toHaveClass('bg-primary-50');
    expect(thead).toHaveClass('custom-class');
  });

  it('combines all props correctly', () => {
    const { container } = render(
      <table>
        <TableHeader
          background="secondary"
          className="custom-class"
          rowClassName="row-class"
        >
          <th>Test</th>
        </TableHeader>
      </table>
    );
    const thead = container.querySelector('thead');
    const tr = container.querySelector('tr');
    expect(thead).toHaveClass('bg-secondary-50');
    expect(thead).toHaveClass('custom-class');
    expect(tr).toHaveClass('row-class');
  });
});
