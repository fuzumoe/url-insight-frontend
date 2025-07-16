import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import TableBody from '../TableBody';

describe('TableBody', () => {
  it('renders children correctly', () => {
    render(
      <table>
        <TableBody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
          <tr>
            <td>Cell 3</td>
            <td>Cell 4</td>
          </tr>
        </TableBody>
      </table>
    );
    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
    expect(screen.getByText('Cell 3')).toBeInTheDocument();
    expect(screen.getByText('Cell 4')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(
      <table>
        <TableBody>
          <tr>
            <td>Test</td>
          </tr>
        </TableBody>
      </table>
    );
    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    expect(tbody).toHaveClass('bg-white');
    expect(tbody).toHaveClass('divide-y');
    expect(tbody).toHaveClass('divide-gray-200');
  });

  it('applies correct background class based on background prop', () => {
    const backgrounds = [
      { prop: 'white', expected: 'bg-white' },
      { prop: 'gray', expected: 'bg-gray-50' },
      { prop: 'transparent', expected: 'bg-transparent' },
    ] as const;

    backgrounds.forEach(({ prop, expected }) => {
      const { container } = render(
        <table>
          <TableBody background={prop}>
            <tr>
              <td>Test</td>
            </tr>
          </TableBody>
        </table>
      );
      const tbody = container.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
      expect(tbody).toHaveClass(expected);
    });
  });

  it('handles divider options correctly', () => {
    // With dividers (default)
    const { container: withDividers } = render(
      <table>
        <TableBody>
          <tr>
            <td>Test</td>
          </tr>
        </TableBody>
      </table>
    );
    expect(withDividers.querySelector('tbody')).toHaveClass('divide-y');
    expect(withDividers.querySelector('tbody')).toHaveClass('divide-gray-200');

    // Without dividers
    const { container: withoutDividers } = render(
      <table>
        <TableBody divider={false}>
          <tr>
            <td>Test</td>
          </tr>
        </TableBody>
      </table>
    );
    expect(withoutDividers.querySelector('tbody')).not.toHaveClass('divide-y');
    expect(withoutDividers.querySelector('tbody')).not.toHaveClass(
      'divide-gray-200'
    );

    // Custom divider color
    const { container: customDivider } = render(
      <table>
        <TableBody dividerColor="gray-300">
          <tr>
            <td>Test</td>
          </tr>
        </TableBody>
      </table>
    );
    expect(customDivider.querySelector('tbody')).toHaveClass('divide-y');
    expect(customDivider.querySelector('tbody')).toHaveClass('divide-gray-300');
  });

  it('applies striped rows when enabled', () => {
    // Without stripes (default)
    const { container: withoutStripes } = render(
      <table>
        <TableBody>
          <tr>
            <td>Test</td>
          </tr>
        </TableBody>
      </table>
    );
    expect(withoutStripes.querySelector('tbody')).not.toHaveClass(
      'even:bg-gray-50'
    );
    expect(withoutStripes.querySelector('tbody')).not.toHaveClass(
      'even:bg-blue-50'
    );

    // With gray stripes
    const { container: withGrayStripes } = render(
      <table>
        <TableBody striped stripedColors="gray">
          <tr>
            <td>Test</td>
          </tr>
        </TableBody>
      </table>
    );
    expect(withGrayStripes.querySelector('tbody')).toHaveClass(
      'even:bg-gray-50'
    );

    // With blue stripes
    const { container: withBlueStripes } = render(
      <table>
        <TableBody striped stripedColors="blue">
          <tr>
            <td>Test</td>
          </tr>
        </TableBody>
      </table>
    );
    expect(withBlueStripes.querySelector('tbody')).toHaveClass(
      'even:bg-blue-50'
    );
  });

  it('combines options correctly', () => {
    // Striped with no dividers
    const { container } = render(
      <table>
        <TableBody striped divider={false}>
          <tr>
            <td>Test</td>
          </tr>
        </TableBody>
      </table>
    );
    const tbody = container.querySelector('tbody');
    expect(tbody).toHaveClass('bg-white');
    expect(tbody).toHaveClass('even:bg-gray-50');
    expect(tbody).not.toHaveClass('divide-y');
  });

  it('appends additional className when provided', () => {
    const { container } = render(
      <table>
        <TableBody className="custom-class">
          <tr>
            <td>Test</td>
          </tr>
        </TableBody>
      </table>
    );
    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    expect(tbody).toHaveClass('custom-class');
  });

  it('handles empty children', () => {
    const { container } = render(
      <table>
        <TableBody>{[]}</TableBody>
      </table>
    );
    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    expect(tbody).toHaveClass('bg-white');
  });
});
