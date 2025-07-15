import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthLayout from '../AuthLayout';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../Footer', () => ({
  default: () => <div data-testid="footer-mock">Footer</div>,
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

    const contentWrapper =
      screen.getByText('URL Insight').parentElement?.parentElement;
    expect(contentWrapper).toHaveClass('w-full');
    expect(contentWrapper).toHaveClass('max-w-md');

    const childElement = screen.getByText('Test Content');
    const formContainer = childElement.parentElement;
    expect(formContainer).toHaveClass('bg-white');
    expect(formContainer).toHaveClass('rounded-lg');
    expect(formContainer).toHaveClass('shadow-lg');
  });
});
