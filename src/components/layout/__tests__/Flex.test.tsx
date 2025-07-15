import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Flex from '../Flex';

describe('Flex', () => {
  it('renders children correctly', () => {
    render(
      <Flex>
        <div>Test content</div>
      </Flex>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies direction classes correctly', () => {
    const { container } = render(
      <Flex direction="column">
        <div>Test content</div>
      </Flex>
    );

    expect(container.firstChild).toHaveClass('flex', 'flex-col');
  });

  it('applies justify classes correctly', () => {
    const { container } = render(
      <Flex justify="center">
        <div>Test content</div>
      </Flex>
    );

    expect(container.firstChild).toHaveClass('flex', 'justify-center');
  });

  it('applies align classes correctly', () => {
    const { container } = render(
      <Flex align="center">
        <div>Test content</div>
      </Flex>
    );

    expect(container.firstChild).toHaveClass('flex', 'items-center');
  });

  it('applies gap classes correctly', () => {
    const { container } = render(
      <Flex gap="md">
        <div>Test content</div>
      </Flex>
    );

    expect(container.firstChild).toHaveClass('flex', 'gap-4');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Flex className="custom-class">
        <div>Test content</div>
      </Flex>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('combines multiple props correctly', () => {
    const { container } = render(
      <Flex
        direction="column"
        justify="center"
        align="center"
        gap="md"
        className="custom-class"
      >
        <div>Test content</div>
      </Flex>
    );

    expect(container.firstChild).toHaveClass(
      'flex',
      'flex-col',
      'justify-center',
      'items-center',
      'gap-4',
      'custom-class'
    );
  });
});
