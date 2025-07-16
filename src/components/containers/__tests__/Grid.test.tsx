import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Grid from '../Grid';

describe('Grid', () => {
  it('renders children correctly', () => {
    render(
      <Grid>
        <div>Test content</div>
      </Grid>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies default grid classes', () => {
    const { container } = render(
      <Grid>
        <div>Test content</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass('grid', 'grid-cols-1', 'gap-4');
  });

  it('applies cols classes correctly', () => {
    const { container } = render(
      <Grid cols={3}>
        <div>Test content</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass('grid-cols-3');
  });

  it('applies gap classes correctly', () => {
    const { container } = render(
      <Grid gap="lg">
        <div>Test content</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass('gap-6');
  });

  it('applies no gap when gap is none', () => {
    const { container } = render(
      <Grid gap="none">
        <div>Test content</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass('grid');
    expect(container.firstChild).not.toHaveClass('gap-4');
    expect(container.firstChild).not.toHaveClass('gap-2');
    expect(container.firstChild).not.toHaveClass('gap-6');
    expect(container.firstChild).not.toHaveClass('gap-8');
  });

  it('applies responsive classes correctly', () => {
    const { container } = render(
      <Grid cols={1} responsive={{ sm: 2, md: 3, lg: 4, xl: 6 }}>
        <div>Test content</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass(
      'grid-cols-1',
      'sm:grid-cols-2',
      'md:grid-cols-3',
      'lg:grid-cols-4',
      'xl:grid-cols-6'
    );
  });

  it('applies partial responsive classes', () => {
    const { container } = render(
      <Grid cols={1} responsive={{ sm: 2, lg: 4 }}>
        <div>Test content</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass(
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-4'
    );
    expect(container.firstChild).not.toHaveClass('md:grid-cols-3');
    expect(container.firstChild).not.toHaveClass('xl:grid-cols-6');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Grid className="custom-class">
        <div>Test content</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles all gap sizes', () => {
    const gapSizes = ['none', 'sm', 'md', 'lg', 'xl'] as const;
    const expectedClasses = ['', 'gap-2', 'gap-4', 'gap-6', 'gap-8'];

    gapSizes.forEach((gap, index) => {
      const { container } = render(
        <Grid gap={gap}>
          <div>Test content</div>
        </Grid>
      );

      if (gap === 'none') {
        expect(container.firstChild).not.toHaveClass(
          'gap-2',
          'gap-4',
          'gap-6',
          'gap-8'
        );
      } else {
        expect(container.firstChild).toHaveClass(expectedClasses[index]);
      }
    });
  });

  it('handles all column sizes', () => {
    const colSizes = [1, 2, 3, 4, 5, 6, 12] as const;
    const expectedClasses = [
      'grid-cols-1',
      'grid-cols-2',
      'grid-cols-3',
      'grid-cols-4',
      'grid-cols-5',
      'grid-cols-6',
      'grid-cols-12',
    ];

    colSizes.forEach((cols, index) => {
      const { container } = render(
        <Grid cols={cols}>
          <div>Test content</div>
        </Grid>
      );

      expect(container.firstChild).toHaveClass(expectedClasses[index]);
    });
  });

  it('renders multiple children', () => {
    render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Grid>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('combines all props correctly', () => {
    const { container } = render(
      <Grid
        cols={2}
        gap="xl"
        responsive={{ sm: 3, md: 4 }}
        className="custom-grid"
      >
        <div>Test content</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass(
      'grid',
      'grid-cols-2',
      'gap-8',
      'sm:grid-cols-3',
      'md:grid-cols-4',
      'custom-grid'
    );
  });

  it('works without responsive prop', () => {
    const { container } = render(
      <Grid cols={3} gap="lg">
        <div>Test content</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass('grid', 'grid-cols-3', 'gap-6');
  });

  it('handles empty responsive object', () => {
    const { container } = render(
      <Grid cols={2} responsive={{}}>
        <div>Test content</div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass('grid', 'grid-cols-2');
    expect(container.firstChild).not.toHaveClass('sm:grid-cols-2');
  });

  it('maintains grid structure with complex content', () => {
    const { container } = render(
      <Grid cols={2} gap="md">
        <div>
          <h3>Card 1</h3>
          <p>Content 1</p>
        </div>
        <div>
          <h3>Card 2</h3>
          <p>Content 2</p>
        </div>
      </Grid>
    );

    expect(container.firstChild).toHaveClass('grid', 'grid-cols-2', 'gap-4');
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });
});
