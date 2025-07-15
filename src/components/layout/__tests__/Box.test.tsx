import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
});
