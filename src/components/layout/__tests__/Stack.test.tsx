import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Stack from '../Stack';

describe('Stack', () => {
  it('renders children correctly', () => {
    render(
      <Stack>
        <div>Test content</div>
      </Stack>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(
      <Stack>
        <div>Test content</div>
      </Stack>
    );
    // Default: direction="column" -> 'flex-col',
    // spacing="md" -> 'gap-4',
    // align="stretch" -> 'items-stretch'
    expect(container.firstChild).toHaveClass(
      'flex',
      'flex-col',
      'gap-4',
      'items-stretch'
    );
  });

  it('applies spacing classes correctly', () => {
    const spacingTests = [
      { spacing: 'none' as const, expectedClass: 'gap-0' },
      { spacing: 'sm' as const, expectedClass: 'gap-2' },
      { spacing: 'md' as const, expectedClass: 'gap-4' },
      { spacing: 'lg' as const, expectedClass: 'gap-6' },
      { spacing: 'xl' as const, expectedClass: 'gap-8' },
    ];

    spacingTests.forEach(({ spacing, expectedClass }) => {
      const { container } = render(
        <Stack spacing={spacing}>
          <div>Test content</div>
        </Stack>
      );

      expect(container.firstChild).toHaveClass('flex', 'flex-col');
      // Check for the expected gap class
      expect(container.firstChild).toHaveClass(expectedClass);
    });
  });

  it('applies align classes correctly', () => {
    const alignTests = [
      { align: 'start' as const, expectedClass: 'items-start' },
      { align: 'center' as const, expectedClass: 'items-center' },
      { align: 'end' as const, expectedClass: 'items-end' },
      { align: 'stretch' as const, expectedClass: 'items-stretch' },
    ];

    alignTests.forEach(({ align, expectedClass }) => {
      const { container } = render(
        <Stack align={align}>
          <div>Test content</div>
        </Stack>
      );

      expect(container.firstChild).toHaveClass(expectedClass);
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <Stack className="custom-stack">
        <div>Test content</div>
      </Stack>
    );
    expect(container.firstChild).toHaveClass('custom-stack');
  });

  it('combines all props correctly', () => {
    const { container } = render(
      <Stack spacing="lg" align="center" className="custom-stack">
        <div>Test content</div>
      </Stack>
    );
    // spacing="lg" -> 'gap-6'
    expect(container.firstChild).toHaveClass(
      'flex',
      'flex-col',
      'gap-6',
      'items-center',
      'custom-stack'
    );
  });

  it('renders multiple children with proper spacing', () => {
    render(
      <Stack spacing="md">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Stack>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('handles empty className prop', () => {
    const { container } = render(
      <Stack className="">
        <div>Test content</div>
      </Stack>
    );
    expect(container.firstChild).toHaveClass(
      'flex',
      'flex-col',
      'gap-4',
      'items-stretch'
    );
  });

  it('filters out empty classes correctly', () => {
    const { container } = render(
      <Stack spacing="none" className="">
        <div>Test content</div>
      </Stack>
    );
    const element = container.firstChild as HTMLElement;
    const classes = element.className.split(' ').filter(Boolean);
    // Expected default classes with spacing "none" -> 'gap-0'
    expect(classes).toEqual(['flex', 'flex-col', 'gap-0', 'items-stretch']);
    expect(classes).not.toContain('');
  });

  it('works with complex children', () => {
    render(
      <Stack spacing="lg" align="center">
        <div>
          <h3>Title 1</h3>
          <p>Content 1</p>
        </div>
        <div>
          <h3>Title 2</h3>
          <p>Content 2</p>
        </div>
      </Stack>
    );
    expect(screen.getByText('Title 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Title 2')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('maintains flex column layout', () => {
    const { container } = render(
      <Stack>
        <div>First</div>
        <div>Second</div>
      </Stack>
    );
    expect(container.firstChild).toHaveClass('flex', 'flex-col');
  });

  it('applies all spacing options correctly', () => {
    const spacingOptions = ['none', 'sm', 'md', 'lg', 'xl'] as const;
    spacingOptions.forEach(spacing => {
      const { container } = render(
        <Stack spacing={spacing}>
          <div>Test</div>
        </Stack>
      );
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
      // Check that each expected gap class is present according to our mapping:
      const expectedMapping: Record<typeof spacing, string> = {
        none: 'gap-0',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
      };
      expect(container.firstChild).toHaveClass(expectedMapping[spacing]);
    });
  });

  it('applies all align options correctly', () => {
    const alignOptions = ['start', 'center', 'end', 'stretch'] as const;
    alignOptions.forEach(align => {
      const { container } = render(
        <Stack align={align}>
          <div>Test</div>
        </Stack>
      );
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
      const expectedMapping: Record<typeof align, string> = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      };
      expect(container.firstChild).toHaveClass(expectedMapping[align]);
    });
  });

  it('handles single child correctly', () => {
    const { container } = render(
      <Stack spacing="lg">
        <div>Single child</div>
      </Stack>
    );
    expect(container.firstChild).toHaveClass('flex', 'flex-col', 'gap-6');
    expect(screen.getByText('Single child')).toBeInTheDocument();
  });

  it('works with different HTML elements as children', () => {
    render(
      <Stack>
        <div>Div element</div>
        <p>Paragraph element</p>
        <span>Span element</span>
        <section>Section element</section>
      </Stack>
    );
    expect(screen.getByText('Div element')).toBeInTheDocument();
    expect(screen.getByText('Paragraph element')).toBeInTheDocument();
    expect(screen.getByText('Span element')).toBeInTheDocument();
    expect(screen.getByText('Section element')).toBeInTheDocument();
  });

  it('maintains proper CSS class order', () => {
    const { container } = render(
      <Stack spacing="xl" align="start" className="custom">
        <div>Test</div>
      </Stack>
    );
    const element = container.firstChild as HTMLElement;
    const classes = element.className.split(' ').filter(Boolean);
    // Expected order based on our component implementation:
    expect(classes).toEqual([
      'flex',
      'flex-col',
      'gap-8',
      'items-start',
      'custom',
    ]);
  });

  it('handles React fragments and arrays as children', () => {
    render(
      <Stack>
        <>
          <div>Fragment child 1</div>
          <div>Fragment child 2</div>
        </>
        <div>Regular child</div>
      </Stack>
    );
    expect(screen.getByText('Fragment child 1')).toBeInTheDocument();
    expect(screen.getByText('Fragment child 2')).toBeInTheDocument();
    expect(screen.getByText('Regular child')).toBeInTheDocument();
  });
});
