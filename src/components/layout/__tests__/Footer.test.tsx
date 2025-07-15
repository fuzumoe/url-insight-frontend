import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../Footer';
import { describe, it, expect, vi } from 'vitest';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

vi.mock('../Container', () => ({
  default: ({ children, className }: ContainerProps) => (
    <div data-testid="container" className={className}>
      {children}
    </div>
  ),
}));

interface BoxProps {
  children: React.ReactNode;
  background?: string;
  shadow?: string;
  padding?: string;
  className?: string;
}

vi.mock('../Box', () => ({
  default: ({ children, background, shadow, padding, className }: BoxProps) => (
    <div
      data-testid={`box-${background}-${shadow}-${padding}`}
      className={className}
    >
      {children}
    </div>
  ),
}));

interface FlexProps {
  children: React.ReactNode;
  direction?: string;
  justify?: string;
  align?: string;
  gap?: string;
  className?: string;
}

vi.mock('../Flex', () => ({
  default: ({
    children,
    direction,
    justify,
    align,
    gap,
    className,
  }: FlexProps) => (
    <div
      data-testid={`flex-${direction || 'row'}-${justify || 'start'}-${align || 'start'}-${gap || 'none'}`}
      className={className}
    >
      {children}
    </div>
  ),
}));

interface TypographyProps {
  children: React.ReactNode;
  variant: string;
  className?: string;
}

vi.mock('../../common/Typography', () => ({
  default: ({ children, variant, className }: TypographyProps) => (
    <span data-testid={`typography-${variant}`} className={className}>
      {children}
    </span>
  ),
}));

describe('Footer', () => {
  it('renders footer with correct content', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();

    expect(
      screen.getByText(
        new RegExp(
          `© ${currentYear} URL Insight\\. All rights reserved\\.`,
          'i'
        )
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
  });

  it('applies additional className if provided', () => {
    const { container } = render(<Footer className="test-class" />);

    const footerElement = container.querySelector('.test-class');
    expect(footerElement).toBeInTheDocument();
  });

  it('renders with correct layout components', () => {
    render(<Footer />);

    expect(screen.getByTestId('container')).toBeInTheDocument();

    expect(screen.getByTestId('box-white-md-lg')).toBeInTheDocument();

    expect(
      screen.getByTestId('flex-column-between-center-none')
    ).toBeInTheDocument();
    expect(screen.getByTestId('flex-row-start-start-md')).toBeInTheDocument();
  });

  it('applies mobile-first responsive classes', () => {
    render(<Footer />);

    const mainFlex = screen.getByTestId('flex-column-between-center-none');
    expect(mainFlex).toHaveClass('md:flex-row');

    const copyrightBox = screen.getByTestId(
      'box-undefined-undefined-undefined'
    );
    expect(copyrightBox).toHaveClass('mb-4', 'md:mb-0');

    const linksFlex = screen.getByTestId('flex-row-start-start-md');
    expect(linksFlex).toHaveClass('flex-wrap');
  });

  it('renders Typography components with correct props', () => {
    render(<Footer />);

    const typographyElements = screen.getAllByTestId('typography-body2');
    expect(typographyElements).toHaveLength(4);

    const copyrightText = screen.getByText(/© \d{4} URL Insight/);
    expect(copyrightText).toHaveClass('text-gray-600');
  });

  it('renders all navigation links with correct styling', () => {
    render(<Footer />);

    const links = [
      screen.getByText('Privacy Policy'),
      screen.getByText('Terms of Service'),
      screen.getByText('Contact Us'),
    ];

    links.forEach(link => {
      const linkElement = link.closest('a');
      expect(linkElement).toHaveClass(
        'text-gray-500',
        'hover:text-blue-600',
        'transition-colors'
      );
      expect(linkElement).toHaveAttribute('href', '#');
    });
  });

  it('displays current year dynamically', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} URL Insight. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('maintains semantic structure', () => {
    render(<Footer />);

    expect(screen.getByTestId('box-white-md-lg')).toBeInTheDocument();

    const boxElement = screen.getByTestId('box-white-md-lg');
    expect(boxElement).toHaveClass('mt-auto');
  });

  it('combines custom className with default classes', () => {
    render(<Footer className="custom-footer" />);

    const boxElement = screen.getByTestId('box-white-md-lg');
    expect(boxElement).toHaveClass('mt-auto', 'custom-footer');
  });
});
