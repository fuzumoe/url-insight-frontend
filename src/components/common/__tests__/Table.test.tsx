import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Table from '../Table';

describe('Table', () => {
  it('renders children correctly', () => {
    render(
      <Table>
        <thead>
          <tr>
            <th>Header</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data</td>
          </tr>
        </tbody>
      </Table>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(
      <Table>
        <tbody>
          <tr>
            <td>Test</td>
          </tr>
        </tbody>
      </Table>
    );
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('min-w-full');
    expect(table).toHaveClass('divide-y');
    expect(table).toHaveClass('divide-gray-200');
  });

  it('appends additional className when provided', () => {
    const { container } = render(
      <Table className="custom-class">
        <tbody>
          <tr>
            <td>Test</td>
          </tr>
        </tbody>
      </Table>
    );
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('custom-class');
  });
});
