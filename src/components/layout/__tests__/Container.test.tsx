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

  it('applies default container classes and additional className', () => {
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
    expect(divElement).toHaveClass(additionalClass);
  });
});
