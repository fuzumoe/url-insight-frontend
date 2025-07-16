import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import TableHead from '../TableHead';

describe('TableHead', () => {
  it('renders children correctly', () => {
    render(
      <table>
        <TableHead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
        </TableHead>
      </table>
    );
    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Header 2')).toBeInTheDocument();
  });

  it('applies default background class', () => {
    const { container } = render(
      <table>
        <TableHead>
          <tr>
            <th>Test</th>
          </tr>
        </TableHead>
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
          <TableHead background={prop}>
            <tr>
              <th>Test</th>
            </tr>
          </TableHead>
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
        <TableHead className="custom-class">
          <tr>
            <th>Test</th>
          </tr>
        </TableHead>
      </table>
    );
    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();
    expect(thead).toHaveClass('bg-gray-50');
    expect(thead).toHaveClass('custom-class');
  });

  it('combines background and custom classes correctly', () => {
    const { container } = render(
      <table>
        <TableHead background="primary" className="custom-class">
          <tr>
            <th>Test</th>
          </tr>
        </TableHead>
      </table>
    );
    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();
    expect(thead).toHaveClass('bg-primary-50');
    expect(thead).toHaveClass('custom-class');
  });
});
