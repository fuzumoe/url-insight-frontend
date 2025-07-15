import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../Footer';
import { describe, it, expect } from 'vitest';

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
    render(<Footer className="test-class" />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass('test-class');
  });
});
