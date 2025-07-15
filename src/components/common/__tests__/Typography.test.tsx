import { render, screen } from '@testing-library/react';
import Typography from '../Typography';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('Typography', () => {
  test('renders text content correctly', () => {
    render(<Typography>Hello World</Typography>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('renders with default props as a paragraph', () => {
    render(<Typography>Default Typography</Typography>);
    const element = screen.getByText('Default Typography');
    expect(element.tagName).toBe('P');
    expect(element).toHaveClass('text-sm', 'md:text-base', 'leading-relaxed');
    expect(element).toHaveClass('text-gray-900', 'font-normal', 'text-left');
  });

  test.each([
    ['h1', 'H1', ['text-3xl', 'md:text-4xl', 'lg:text-5xl', 'leading-tight']],
    ['h2', 'H2', ['text-2xl', 'md:text-3xl', 'lg:text-4xl', 'leading-tight']],
    ['h3', 'H3', ['text-xl', 'md:text-2xl', 'lg:text-3xl', 'leading-tight']],
    ['h4', 'H4', ['text-lg', 'md:text-xl', 'lg:text-2xl', 'leading-snug']],
    ['h5', 'H5', ['text-base', 'md:text-lg', 'lg:text-xl', 'leading-snug']],
    ['h6', 'H6', ['text-sm', 'md:text-base', 'lg:text-lg', 'leading-normal']],
    ['body1', 'P', ['text-sm', 'md:text-base', 'leading-relaxed']],
    ['body2', 'P', ['text-xs', 'md:text-sm', 'leading-relaxed']],
    ['caption', 'P', ['text-xs', 'leading-normal']],
  ])(
    'renders correct element and classes for variant %s',
    (variant, expectedTag, expectedClasses) => {
      render(
        <Typography
          variant={
            variant as
              | 'h1'
              | 'h2'
              | 'h3'
              | 'h4'
              | 'h5'
              | 'h6'
              | 'body1'
              | 'body2'
              | 'caption'
          }
        >
          Test
        </Typography>
      );
      const element = screen.getByText('Test');
      expect(element.tagName).toBe(expectedTag);

      // Check all expected classes are present
      expectedClasses.forEach(className => {
        expect(element).toHaveClass(className);
      });
    }
  );

  test.each([
    ['default', 'text-gray-900'],
    ['primary', 'text-blue-600'],
    ['secondary', 'text-gray-600'],
    ['error', 'text-red-600'],
    ['success', 'text-green-600'],
    ['warning', 'text-yellow-600'],
  ])('applies correct color class for %s', (color, expectedClass) => {
    render(
      <Typography
        color={
          color as
            | 'default'
            | 'primary'
            | 'secondary'
            | 'error'
            | 'success'
            | 'warning'
        }
      >
        Test
      </Typography>
    );
    expect(screen.getByText('Test')).toHaveClass(expectedClass);
  });

  test.each([
    ['normal', 'font-normal'],
    ['medium', 'font-medium'],
    ['semibold', 'font-semibold'],
    ['bold', 'font-bold'],
  ])('applies correct weight class for %s', (weight, expectedClass) => {
    render(
      <Typography weight={weight as 'normal' | 'medium' | 'semibold' | 'bold'}>
        Test
      </Typography>
    );
    expect(screen.getByText('Test')).toHaveClass(expectedClass);
  });

  test.each([
    ['left', 'text-left'],
    ['center', 'text-center'],
    ['right', 'text-right'],
  ])('applies correct alignment class for %s', (align, expectedClass) => {
    render(
      <Typography align={align as 'left' | 'center' | 'right'}>Test</Typography>
    );
    expect(screen.getByText('Test')).toHaveClass(expectedClass);
  });

  test('applies responsive gutterBottom classes when set', () => {
    render(<Typography gutterBottom>Test</Typography>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('mb-2');
    expect(element).toHaveClass('md:mb-3');
    expect(element).toHaveClass('lg:mb-4');
  });

  test('applies custom className', () => {
    render(<Typography className="custom-class">Test</Typography>);
    expect(screen.getByText('Test')).toHaveClass('custom-class');
  });

  test('renders with custom element type using "as" prop', () => {
    render(<Typography as="span">Test</Typography>);
    const element = screen.getByText('Test');
    expect(element.tagName).toBe('SPAN');
  });

  test('forwards additional props to the component', () => {
    render(<Typography data-testid="typography-test">Test</Typography>);
    expect(screen.getByTestId('typography-test')).toBeInTheDocument();
  });
});
