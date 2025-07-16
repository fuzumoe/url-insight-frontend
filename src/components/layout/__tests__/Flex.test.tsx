import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Flex from '../Flex';

describe('Flex', () => {
  // Keep existing tests unchanged

  // Add new test for inline property
  it('applies inline-flex when inline prop is true', () => {
    const { container } = render(
      <Flex inline>
        <div>Test content</div>
      </Flex>
    );

    expect(container.firstChild).toHaveClass('inline-flex');
    expect(container.firstChild).not.toHaveClass('flex');
  });

  it('applies flex when inline prop is false', () => {
    const { container } = render(
      <Flex inline={false}>
        <div>Test content</div>
      </Flex>
    );

    expect(container.firstChild).toHaveClass('flex');
    expect(container.firstChild).not.toHaveClass('inline-flex');
  });

  it('applies flex by default when inline prop is not provided', () => {
    const { container } = render(
      <Flex>
        <div>Test content</div>
      </Flex>
    );

    expect(container.firstChild).toHaveClass('flex');
    expect(container.firstChild).not.toHaveClass('inline-flex');
  });

  it('combines inline with other props correctly', () => {
    const { container } = render(
      <Flex
        inline
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
      'inline-flex',
      'flex-col',
      'justify-center',
      'items-center',
      'gap-4',
      'custom-class'
    );
    expect(container.firstChild).not.toHaveClass('flex');
  });
});
