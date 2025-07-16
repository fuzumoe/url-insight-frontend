import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../Footer';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
// Mocks for Typography are working - keep these
vi.mock('../../common/Typography', () => ({
  default: ({
    children,
    variant,
    className,
  }: {
    children: React.ReactNode;
    variant: string;
    className?: string;
  }) => (
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

  // Fixed test - using direct DOM selection instead of test IDs
  it('renders with correct layout components', () => {
    render(<Footer />);

    // Check for container element
    const containerElement = screen
      .getByRole('contentinfo')
      .querySelector('.container');
    expect(containerElement).toBeInTheDocument();
    expect(containerElement).toHaveClass(
      'mx-auto',
      'px-4',
      'py-6',
      'max-w-full'
    );

    // Check for flex container
    const flexContainer = screen
      .getByRole('contentinfo')
      .querySelector('.flex.flex-col');
    expect(flexContainer).toBeInTheDocument();
    expect(flexContainer).toHaveClass('justify-between', 'items-center');
  });

  // Fixed test - using direct DOM selection instead of test IDs
  it('applies mobile-first responsive classes', () => {
    render(<Footer />);

    // Find main flex container by its classes
    const mainFlex = screen
      .getByRole('contentinfo')
      .querySelector('.flex.flex-col.justify-between');
    expect(mainFlex).toHaveClass('md:flex-row');

    // Find copyright box
    const copyRightContainer = screen
      .getByText(/URL Insight\. All rights reserved/)
      .closest('div');
    expect(copyRightContainer).toHaveClass('mb-4', 'md:mb-0');

    // Find links container
    const linksContainer = screen.getByText('Privacy Policy').closest('div');
    expect(linksContainer).toHaveClass('flex', 'flex-wrap');
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

    // Check for the footer element directly instead of looking for a specific test ID
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveClass('mt-auto');
  });

  it('combines custom className with default classes', () => {
    render(<Footer className="custom-footer" />);

    // Look for the footer element with the custom class
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass('mt-auto', 'custom-footer');
  });
});
