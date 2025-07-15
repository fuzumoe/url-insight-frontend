import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthLayout from '../AuthLayout';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../Footer', () => ({
  default: () => <div data-testid="footer-mock">Footer</div>,
}));

vi.mock('../Container', () => ({
  default: ({
    children,
    size,
    className,
  }: {
    children: React.ReactNode;
    size: string;
    className?: string;
  }) => (
    <div data-testid={`container-${size}`} className={className}>
      {children}
    </div>
  ),
}));

vi.mock('../Box', () => ({
  default: ({
    children,
    padding,
    background,
    shadow,
    rounded,
    className,
  }: {
    children: React.ReactNode;
    padding: string;
    background: string;
    shadow: string;
    rounded: string;
    className?: string;
  }) => (
    <div
      data-testid={`box-${padding}-${background}-${shadow}-${rounded}`}
      className={className}
    >
      {children}
    </div>
  ),
}));

vi.mock('../Flex', () => ({
  default: ({
    children,
    direction,
    justify,
    align,
    className,
  }: {
    children: React.ReactNode;
    direction: string;
    justify?: string;
    align?: string;
    className?: string;
  }) => (
    <div
      data-testid={`flex-${direction}-${justify}-${align}`}
      className={className}
    >
      {children}
    </div>
  ),
}));

vi.mock('../../common/Typography', () => ({
  default: ({
    children,
    variant,
    as: Component = 'span',
    className,
  }: {
    children: React.ReactNode;
    variant: string;
    as?: React.ElementType;
    className?: string;
  }) => (
    <Component data-testid={`typography-${variant}`} className={className}>
      {children}
    </Component>
  ),
}));

describe('AuthLayout', () => {
  it('renders the layout with app title and tagline', () => {
    render(
      <AuthLayout>
        <div>Test Child Content</div>
      </AuthLayout>
    );

    expect(screen.getByText('URL Insight')).toBeInTheDocument();
    expect(screen.getByText('Website Analysis Platform')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <AuthLayout>
        <div>Test Child Content</div>
      </AuthLayout>
    );

    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('includes the footer component', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
  });

  it('applies the correct styling classes', () => {
    const { container } = render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('min-h-screen');
    expect(mainContainer).toHaveClass('flex');
    expect(mainContainer).toHaveClass('flex-col');
    expect(mainContainer).toHaveClass('bg-gray-50');
  });

  it('renders with correct layout components', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    expect(screen.getByTestId('container-sm')).toBeInTheDocument();

    expect(screen.getByTestId('box-lg-white-lg-lg')).toBeInTheDocument();

    expect(screen.getByTestId('flex-column-center-center')).toBeInTheDocument();
    expect(
      screen.getByTestId('flex-column-undefined-center')
    ).toBeInTheDocument();
  });

  it('applies mobile-first responsive classes', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    const outerFlex = screen.getByTestId('flex-column-center-center');
    expect(outerFlex).toHaveClass('flex-grow');
    expect(outerFlex).toHaveClass('px-3');
    expect(outerFlex).toHaveClass('sm:px-4');
    expect(outerFlex).toHaveClass('py-8');
    expect(outerFlex).toHaveClass('sm:py-12');

    const innerFlex = screen.getByTestId('flex-column-undefined-center');
    expect(innerFlex).toHaveClass('w-full');

    const box = screen.getByTestId('box-lg-white-lg-lg');
    expect(box).toHaveClass('w-full');
  });

  it('renders Typography components with correct props', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    const title = screen.getByTestId('typography-h3');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-bold');
    expect(title).toHaveClass('text-blue-600');
    expect(title).toHaveClass('text-2xl');
    expect(title).toHaveClass('sm:text-3xl');
    expect(title.tagName).toBe('H1');

    const subtitle = screen.getByTestId('typography-body2');
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass('text-gray-600');
    expect(subtitle).toHaveClass('mt-1');
    expect(subtitle).toHaveClass('sm:mt-2');
  });

  it('has proper semantic structure', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('URL Insight');
  });

  it('centers content correctly', () => {
    render(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    );

    const headerDiv = screen.getByText('URL Insight').closest('div');
    expect(headerDiv).toHaveClass('text-center');
    expect(headerDiv).toHaveClass('mb-6');
    expect(headerDiv).toHaveClass('sm:mb-8');
  });

  it('maintains layout structure with complex children', () => {
    render(
      <AuthLayout>
        <form>
          <input placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      </AuthLayout>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByTestId('box-lg-white-lg-lg')).toBeInTheDocument();
  });
});
