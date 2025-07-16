import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Container from '../Container';
import { describe, it, expect } from 'vitest';

describe('Container', () => {
  it('renders children content', () => {
    render(
      <Container>
        <div data-testid="child">Child Content</div>
      </Container>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('applies default container classes with full size', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );

    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveClass('container');
    expect(divElement).toHaveClass('mx-auto');
    expect(divElement).toHaveClass('px-4');
    expect(divElement).toHaveClass('py-6');
    expect(divElement).toHaveClass('max-w-full');
  });

  it('applies additional className', () => {
    const additionalClass = 'bg-red-500';
    const { container } = render(
      <Container className={additionalClass}>
        <div>Content</div>
      </Container>
    );

    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveClass('container');
    expect(divElement).toHaveClass('mx-auto');
    expect(divElement).toHaveClass('px-4');
    expect(divElement).toHaveClass('py-6');
    expect(divElement).toHaveClass('max-w-full');
    expect(divElement).toHaveClass(additionalClass);
  });

  it('applies size classes correctly', () => {
    const sizeTests = [
      { size: 'sm' as const, expectedClass: 'max-w-sm' },
      { size: 'md' as const, expectedClass: 'max-w-md' },
      { size: 'lg' as const, expectedClass: 'max-w-lg' },
      { size: 'xl' as const, expectedClass: 'max-w-xl' },
      { size: 'full' as const, expectedClass: 'max-w-full' },
    ];

    sizeTests.forEach(({ size, expectedClass }) => {
      const { container } = render(
        <Container size={size}>
          <div>Content</div>
        </Container>
      );

      const divElement = container.firstChild as HTMLElement;
      expect(divElement).toHaveClass(expectedClass);
    });
  });

  it('combines size and custom className correctly', () => {
    const { container } = render(
      <Container size="sm" className="custom-class">
        <div>Content</div>
      </Container>
    );

    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveClass('container');
    expect(divElement).toHaveClass('mx-auto');
    expect(divElement).toHaveClass('px-4');
    expect(divElement).toHaveClass('py-6');
    expect(divElement).toHaveClass('max-w-sm');
    expect(divElement).toHaveClass('custom-class');
  });

  it('filters out empty className', () => {
    const { container } = render(
      <Container className="">
        <div>Content</div>
      </Container>
    );

    const divElement = container.firstChild as HTMLElement;
    const classes = divElement.className.split(' ').filter(Boolean);

    expect(classes).toEqual([
      'container',
      'mx-auto',
      'px-4',
      'py-6',
      'max-w-full',
    ]);
    expect(classes).not.toContain('');
  });

  it('renders multiple children', () => {
    render(
      <Container>
        <div>First child</div>
        <div>Second child</div>
        <p>Third child</p>
      </Container>
    );

    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
    expect(screen.getByText('Third child')).toBeInTheDocument();
  });

  it('handles complex nested content', () => {
    render(
      <Container size="md">
        <div>
          <h1>Title</h1>
          <p>Description</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </Container>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('maintains proper CSS class order', () => {
    const { container } = render(
      <Container size="lg" className="custom">
        <div>Content</div>
      </Container>
    );

    const divElement = container.firstChild as HTMLElement;
    const classes = divElement.className.split(' ');

    expect(classes).toEqual([
      'container',
      'mx-auto',
      'px-4',
      'py-6',
      'max-w-lg',
      'custom',
    ]);
  });

  it('works with all size options', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;

    sizes.forEach(size => {
      const { container } = render(
        <Container size={size}>
          <div>Test content</div>
        </Container>
      );

      const divElement = container.firstChild as HTMLElement;
      expect(divElement).toHaveClass('container', 'mx-auto', 'px-4', 'py-6');
    });
  });
});
