import { render, screen } from '@testing-library/react';
import TableCell from '../TableCell';
import Typography from '../../common/Typography';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
  ReactNode,
  ReactPortal,
  ReactElement,
  JSXElementConstructor,
} from 'react';
import type { JSX } from 'react/jsx-runtime';

vi.mock('../../common/Typography', () => ({
  default: vi.fn(
    ({
      children,
      className,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }) => (
      <p
        data-testid="typography"
        className={`text-sm md:text-base leading-relaxed text-${props.color || 'gray-900'} font-normal text-left ${className || ''}`}
        {...props}
      >
        {children}
      </p>
    )
  ),
}));

const renderTableCell = (
  cellContent:
    | string
    | number
    | bigint
    | boolean
    | Iterable<ReactNode>
    | Promise<
        | string
        | number
        | bigint
        | boolean
        | ReactPortal
        | ReactElement<unknown, string | JSXElementConstructor<object>>
        | Iterable<ReactNode>
        | null
        | undefined
      >
    | JSX.Element
    | null
    | undefined
) => {
  return render(
    <table>
      <tbody>
        <tr>{cellContent}</tr>
      </tbody>
    </table>
  );
};

describe('TableCell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders its children correctly', () => {
    renderTableCell(<TableCell>Test Content</TableCell>);
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
    const cell = screen.getByText('Cell with colSpan').closest('td');
    expect(cell).toHaveAttribute('colspan', '3');
  });

  it('renders an icon when provided', () => {
    renderTableCell(
      <TableCell icon={<span data-testid="icon">Icon</span>}>
        Cell Content
      </TableCell>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies mobile-first responsive classes to the icon', () => {
    renderTableCell(
      <TableCell icon={<span data-testid="icon">Icon</span>}>
        Cell Content
      </TableCell>
    );
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('w-3.5');
    expect(icon).toHaveClass('h-3.5');
    expect(icon).toHaveClass('sm:w-4');
    expect(icon).toHaveClass('sm:h-4');
  });

  it('applies custom className', () => {
    renderTableCell(
      <TableCell className="custom-class">Custom Cell</TableCell>
    );
    const cell = screen.getByText('Custom Cell').closest('td');
    expect(cell).toHaveClass('custom-class');
  });

  it('applies mobile-first responsive padding', () => {
    renderTableCell(<TableCell>Responsive Cell</TableCell>);
    const cell = screen.getByText('Responsive Cell').closest('td');
    expect(cell).toHaveClass('px-2');
    expect(cell).toHaveClass('py-1.5');
    expect(cell).toHaveClass('sm:px-4');
    expect(cell).toHaveClass('sm:py-2');
  });

  it('uses Typography component when typographyProps is provided', () => {
    vi.clearAllMocks();

    renderTableCell(
      <TableCell typographyProps={{ variant: 'body1', color: 'primary' }}>
        Typography Text
      </TableCell>
    );

    expect(screen.getByTestId('typography')).toBeInTheDocument();
    expect(screen.getByTestId('typography')).toHaveTextContent(
      'Typography Text'
    );

    expect(Typography).toHaveBeenCalled();

    const typographyProps = vi.mocked(Typography).mock.calls[0][0];
    expect(typographyProps.variant).toBe('body1');
    expect(typographyProps.color).toBe('primary');
    expect(typographyProps.children).toBe('Typography Text');
  });

  it('applies truncate class when truncate prop is true', () => {
    renderTableCell(<TableCell truncate>Truncated Text</TableCell>);
    const span = screen.getByText('Truncated Text');
    expect(span).toHaveClass('truncate');
    expect(span).toHaveClass('block');
  });

  it('applies truncate to Typography when both truncate and typographyProps are provided', () => {
    renderTableCell(
      <TableCell truncate typographyProps={{ className: 'test-class' }}>
        Truncated Typography
      </TableCell>
    );
    const typography = screen.getByTestId('typography');
    expect(typography).toHaveClass('truncate');
    expect(typography).toHaveClass('test-class');
  });
});
