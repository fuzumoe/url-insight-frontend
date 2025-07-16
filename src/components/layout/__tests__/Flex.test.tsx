import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Flex from '../Flex';

describe('Flex', () => {
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
    expect(container.firstChild).toHaveClass('inline-flex');
    expect(container.firstChild).toHaveClass('flex-col');
    expect(container.firstChild).toHaveClass('justify-center');
    expect(container.firstChild).toHaveClass('items-center');
    expect(container.firstChild).toHaveClass('gap-4');
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).not.toHaveClass('flex');
  });

  it('applies correct padding classes when padding prop is provided', () => {
    const { container } = render(
      <Flex padding="lg">
        <div>Test content</div>
      </Flex>
    );
    expect((container.firstChild as HTMLElement)?.className).toContain('p-4');
    expect((container.firstChild as HTMLElement)?.className).toContain(
      'sm:p-6'
    );
  });
});
