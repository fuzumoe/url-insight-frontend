import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Box from '../Box';

describe('Box', () => {
  it('renders children correctly', () => {
    render(
      <Box>
        <div>Test content</div>
      </Box>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders without children', () => {
    const { container } = render(<Box className="test-box" />);

    expect(container.firstChild).toHaveClass('test-box');
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders as div by default', () => {
    const { container } = render(
      <Box>
        <div>Test content</div>
      </Box>
    );

    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('renders as specified element when as prop is provided', () => {
    const { container } = render(
      <Box as="main">
        <div>Test content</div>
      </Box>
    );

    expect(container.firstChild?.nodeName).toBe('MAIN');
  });

  it('renders as section element', () => {
    const { container } = render(
      <Box as="section">
        <div>Test content</div>
      </Box>
    );

    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('handles onClick events', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Box onClick={handleClick}>
        <div>Test content</div>
      </Box>
    );

    fireEvent.click(container.firstChild as HTMLElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('works without onClick prop', () => {
    const { container } = render(
      <Box>
        <div>Test content</div>
      </Box>
    );

    expect(() => {
      fireEvent.click(container.firstChild as HTMLElement);
    }).not.toThrow();
  });

  it('applies padding classes correctly', () => {
    const { container } = render(
      <Box padding="lg">
        <div>Test content</div>
      </Box>
    );

    expect(container.firstChild).toHaveClass('p-4', 'sm:p-6');
  });

  it('applies background classes correctly', () => {
    const { container } = render(
      <Box background="white">
        <div>Test content</div>
      </Box>
    );

    expect(container.firstChild).toHaveClass('bg-white');
  });

  it('applies shadow classes correctly', () => {
    const { container } = render(
      <Box shadow="lg">
        <div>Test content</div>
      </Box>
    );

    expect(container.firstChild).toHaveClass('shadow-lg');
  });

  it('applies rounded classes correctly', () => {
    const { container } = render(
      <Box rounded="lg">
        <div>Test content</div>
      </Box>
    );

    expect(container.firstChild).toHaveClass('rounded-lg');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Box className="custom-class">
        <div>Test content</div>
      </Box>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('combines multiple props correctly', () => {
    const { container } = render(
      <Box
        padding="lg"
        background="white"
        shadow="lg"
        rounded="lg"
        className="w-full"
      >
        <div>Test content</div>
      </Box>
    );

    expect(container.firstChild).toHaveClass(
      'p-4',
      'sm:p-6',
      'bg-white',
      'shadow-lg',
      'rounded-lg',
      'w-full'
    );
  });

  it('combines as prop with other styling props', () => {
    const { container } = render(
      <Box
        as="article"
        padding="sm"
        background="blue-50"
        shadow="md"
        rounded="full"
        className="max-w-md"
      >
        <div>Test content</div>
      </Box>
    );

    expect(container.firstChild?.nodeName).toBe('ARTICLE');
    expect(container.firstChild).toHaveClass(
      'p-2',
      'sm:p-3',
      'bg-blue-50',
      'shadow-md',
      'rounded-full',
      'max-w-md'
    );
  });

  it('combines onClick with other props', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Box
        as="button"
        padding="sm"
        background="white"
        shadow="md"
        rounded="lg"
        onClick={handleClick}
        className="cursor-pointer"
      >
        <span>Click me</span>
      </Box>
    );

    expect(container.firstChild?.nodeName).toBe('BUTTON');
    expect(container.firstChild).toHaveClass(
      'p-2',
      'sm:p-3',
      'bg-white',
      'shadow-md',
      'rounded-lg',
      'cursor-pointer'
    );

    fireEvent.click(container.firstChild as HTMLElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles all padding options correctly', () => {
    const paddingTests = [
      { padding: 'none', expectedClasses: [] },
      { padding: 'sm', expectedClasses: ['p-2', 'sm:p-3'] },
      { padding: 'md', expectedClasses: ['p-3', 'sm:p-4'] },
      { padding: 'lg', expectedClasses: ['p-4', 'sm:p-6'] },
      { padding: 'xl', expectedClasses: ['p-6', 'sm:p-8'] },
    ];

    paddingTests.forEach(({ padding, expectedClasses }) => {
      const { container } = render(
        <Box padding={padding as 'none' | 'sm' | 'md' | 'lg' | 'xl'}>
          <div>Test</div>
        </Box>
      );

      if (expectedClasses.length > 0) {
        expect(container.firstChild).toHaveClass(...expectedClasses);
      } else {
        expect((container.firstChild as HTMLElement)?.className).not.toMatch(
          /p-\d/
        );
      }
    });
  });

  it('handles all background options correctly', () => {
    const backgroundTests = [
      { background: 'transparent', expectedClass: 'bg-transparent' },
      { background: 'white', expectedClass: 'bg-white' },
      { background: 'gray-50', expectedClass: 'bg-gray-50' },
      { background: 'gray-100', expectedClass: 'bg-gray-100' },
      { background: 'blue-50', expectedClass: 'bg-blue-50' },
    ];

    backgroundTests.forEach(({ background, expectedClass }) => {
      const { container } = render(
        <Box
          background={
            background as
              | 'transparent'
              | 'white'
              | 'gray-50'
              | 'gray-100'
              | 'blue-50'
          }
        >
          <div>Test</div>
        </Box>
      );

      expect(container.firstChild).toHaveClass(expectedClass);
    });
  });

  it('handles all shadow options correctly', () => {
    const shadowTests = [
      { shadow: 'none', expectedClass: '' },
      { shadow: 'sm', expectedClass: 'shadow-sm' },
      { shadow: 'md', expectedClass: 'shadow-md' },
      { shadow: 'lg', expectedClass: 'shadow-lg' },
      { shadow: 'xl', expectedClass: 'shadow-xl' },
    ];

    shadowTests.forEach(({ shadow, expectedClass }) => {
      const { container } = render(
        <Box shadow={shadow as 'none' | 'sm' | 'md' | 'lg' | 'xl'}>
          <div>Test</div>
        </Box>
      );

      if (expectedClass) {
        expect(container.firstChild).toHaveClass(expectedClass);
      } else {
        expect((container.firstChild as HTMLElement)?.className).not.toMatch(
          /shadow-\w+/
        );
      }
    });
  });

  it('handles all rounded options correctly', () => {
    const roundedTests = [
      { rounded: 'none', expectedClass: '' },
      { rounded: 'sm', expectedClass: 'rounded-sm' },
      { rounded: 'md', expectedClass: 'rounded-md' },
      { rounded: 'lg', expectedClass: 'rounded-lg' },
      { rounded: 'xl', expectedClass: 'rounded-xl' },
      { rounded: 'full', expectedClass: 'rounded-full' },
    ];

    roundedTests.forEach(({ rounded, expectedClass }) => {
      const { container } = render(
        <Box rounded={rounded as 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'}>
          <div>Test</div>
        </Box>
      );

      if (expectedClass) {
        expect(container.firstChild).toHaveClass(expectedClass);
      } else {
        expect((container.firstChild as HTMLElement)?.className).not.toMatch(
          /rounded-\w+/
        );
      }
    });
  });
  it('renders as a form element when as="form"', () => {
    const { container } = render(
      <Box as="form">
        <input type="text" />
      </Box>
    );

    expect(container.firstChild?.nodeName).toBe('FORM');
  });

  it('handles form submission events', () => {
    const handleSubmit = vi.fn(e => {
      e.preventDefault(); // Prevent actual form submission
    });

    const { container } = render(
      <Box as="form" onSubmit={handleSubmit}>
        <input type="text" data-testid="input" />
        <button type="submit">Submit</button>
      </Box>
    );

    // Use container.querySelector instead of getByRole
    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('passes through form attributes correctly', () => {
    const { container } = render(
      <Box
        as="form"
        action="/submit"
        method="post"
        encType="multipart/form-data"
        noValidate
      >
        <input type="text" />
      </Box>
    );

    const form = container.firstChild as HTMLFormElement;
    expect(form.action).toContain('/submit');
    expect(form.method).toBe('post');
    expect(form.enctype).toBe('multipart/form-data');
    expect(form.noValidate).toBe(true);
  });
});
