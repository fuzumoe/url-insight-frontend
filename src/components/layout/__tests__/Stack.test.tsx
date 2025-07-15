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

    expect(container.firstChild).toHaveClass(
      'flex',
      'flex-col',
      'space-y-4',
      'items-stretch'
    );
  });

  it('applies spacing classes correctly', () => {
    const spacingTests = [
      { spacing: 'none' as const, expectedClass: '' },
      { spacing: 'sm' as const, expectedClass: 'space-y-2' },
      { spacing: 'md' as const, expectedClass: 'space-y-4' },
      { spacing: 'lg' as const, expectedClass: 'space-y-6' },
      { spacing: 'xl' as const, expectedClass: 'space-y-8' },
    ];

    spacingTests.forEach(({ spacing, expectedClass }) => {
      const { container } = render(
        <Stack spacing={spacing}>
          <div>Test content</div>
        </Stack>
      );

      expect(container.firstChild).toHaveClass('flex', 'flex-col');

      if (expectedClass) {
        expect(container.firstChild).toHaveClass(expectedClass);
      } else {
        expect(container.firstChild).not.toHaveClass(
          'space-y-2',
          'space-y-4',
          'space-y-6',
          'space-y-8'
        );
      }
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

    expect(container.firstChild).toHaveClass(
      'flex',
      'flex-col',
      'space-y-6',
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
      'space-y-4',
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

    expect(classes).toEqual(['flex', 'flex-col', 'items-stretch']);
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
    });
  });

  it('handles single child correctly', () => {
    const { container } = render(
      <Stack spacing="lg">
        <div>Single child</div>
      </Stack>
    );

    expect(container.firstChild).toHaveClass('flex', 'flex-col', 'space-y-6');
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
    const classes = element.className.split(' ');

    expect(classes).toEqual([
      'flex',
      'flex-col',
      'space-y-8',
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
