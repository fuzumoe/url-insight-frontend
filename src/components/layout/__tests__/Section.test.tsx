import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Section from '../Section';

vi.mock('../../common/Typography', () => ({
  default: vi.fn(
    ({ children, variant, as: Component = 'span', className, ...props }) => (
      <Component
        data-testid={`typography-${variant}`}
        className={className || ''}
        {...props}
      >
        {children}
      </Component>
    )
  ),
}));

describe('Section', () => {
  it('renders children correctly', () => {
    render(
      <Section>
        <div>Test content</div>
      </Section>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders as a section element', () => {
    const { container } = render(
      <Section>
        <div>Test content</div>
      </Section>
    );

    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('applies default spacing classes', () => {
    const { container } = render(
      <Section>
        <div>Test content</div>
      </Section>
    );

    expect(container.firstChild).toHaveClass('py-6', 'sm:py-8');
  });

  it('applies different spacing classes', () => {
    const spacingTests = [
      { spacing: 'none' as const, classes: [] },
      { spacing: 'sm' as const, classes: ['py-4', 'sm:py-6'] },
      { spacing: 'md' as const, classes: ['py-6', 'sm:py-8'] },
      { spacing: 'lg' as const, classes: ['py-8', 'sm:py-12'] },
      { spacing: 'xl' as const, classes: ['py-12', 'sm:py-16'] },
    ];

    spacingTests.forEach(({ spacing, classes }) => {
      const { container } = render(
        <Section spacing={spacing}>
          <div>Test content</div>
        </Section>
      );

      if (classes.length > 0) {
        expect(container.firstChild).toHaveClass(...classes);
      } else {
        expect(container.firstChild).not.toHaveClass(
          'py-4',
          'py-6',
          'py-8',
          'py-12'
        );
      }
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <Section className="custom-section">
        <div>Test content</div>
      </Section>
    );

    expect(container.firstChild).toHaveClass('custom-section');
  });

  it('renders title when provided', () => {
    render(
      <Section title="Test Title">
        <div>Test content</div>
      </Section>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('typography-h2')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <Section subtitle="Test Subtitle">
        <div>Test content</div>
      </Section>
    );

    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('typography-body1')).toBeInTheDocument();
  });

  it('renders both title and subtitle', () => {
    render(
      <Section title="Test Title" subtitle="Test Subtitle">
        <div>Test content</div>
      </Section>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('typography-h2')).toBeInTheDocument();
    expect(screen.getByTestId('typography-body1')).toBeInTheDocument();
  });

  it('does not render header container when no title or subtitle', () => {
    const { container } = render(
      <Section>
        <div>Test content</div>
      </Section>
    );
    const headerDiv = container.querySelector('.mb-4.sm\\:mb-6');
    expect(headerDiv).not.toBeInTheDocument();
  });

  it('renders header container when title is provided', () => {
    const { container } = render(
      <Section title="Test Title">
        <div>Test content</div>
      </Section>
    );

    const headerDiv = container.querySelector('.mb-4');
    expect(headerDiv).toBeInTheDocument();
    expect(headerDiv).toHaveClass('mb-4', 'sm:mb-6');
  });

  it('renders header container when subtitle is provided', () => {
    const { container } = render(
      <Section subtitle="Test Subtitle">
        <div>Test content</div>
      </Section>
    );

    const headerDiv = container.querySelector('.mb-4');
    expect(headerDiv).toBeInTheDocument();
    expect(headerDiv).toHaveClass('mb-4', 'sm:mb-6');
  });

  it('applies correct Typography props for title', () => {
    render(
      <Section title="Test Title">
        <div>Test content</div>
      </Section>
    );

    const titleElement = screen.getByTestId('typography-h2');
    expect(titleElement).toHaveClass('text-gray-900', 'font-bold', 'mb-2');
    expect(titleElement.tagName).toBe('H2');
  });

  it('applies correct Typography props for subtitle', () => {
    render(
      <Section subtitle="Test Subtitle">
        <div>Test content</div>
      </Section>
    );

    const subtitleElement = screen.getByTestId('typography-body1');
    expect(subtitleElement).toHaveClass('text-gray-600');
  });

  it('combines spacing and custom className correctly', () => {
    const { container } = render(
      <Section spacing="lg" className="custom-section">
        <div>Test content</div>
      </Section>
    );

    expect(container.firstChild).toHaveClass(
      'py-8',
      'sm:py-12',
      'custom-section'
    );
  });

  it('renders complex children content', () => {
    render(
      <Section title="Complex Section">
        <div>
          <h3>Subsection</h3>
          <p>Paragraph content</p>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
          </ul>
        </div>
      </Section>
    );

    expect(screen.getByText('Complex Section')).toBeInTheDocument();
    expect(screen.getByText('Subsection')).toBeInTheDocument();
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('List item 2')).toBeInTheDocument();
  });

  it('handles empty strings for title and subtitle', () => {
    const { container } = render(
      <Section title="" subtitle="">
        <div>Test content</div>
      </Section>
    );

    const headerDiv = container.querySelector('.mb-4.sm\\:mb-6');
    expect(headerDiv).not.toBeInTheDocument();
  });

  it('maintains semantic structure', () => {
    render(
      <Section title="Main Title" subtitle="Supporting text">
        <div>Section content</div>
      </Section>
    );

    const section = screen.getByText('Section content').closest('section');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');

    const heading = screen.getByRole('heading', { name: 'Main Title' });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('works with different content types', () => {
    render(
      <Section title="Mixed Content">
        <p>Paragraph</p>
        <div>Div content</div>
        <span>Span content</span>
      </Section>
    );

    expect(screen.getByText('Mixed Content')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByText('Div content')).toBeInTheDocument();
    expect(screen.getByText('Span content')).toBeInTheDocument();
  });

  it('applies mobile-first responsive design', () => {
    const { container } = render(
      <Section spacing="lg" title="Responsive Section">
        <div>Test content</div>
      </Section>
    );

    expect(container.firstChild).toHaveClass('py-8', 'sm:py-12');

    const headerDiv = container.querySelector('.mb-4');
    expect(headerDiv).toHaveClass('mb-4', 'sm:mb-6');
  });
});
