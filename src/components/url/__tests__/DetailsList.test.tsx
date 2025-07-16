import { render, screen } from '@testing-library/react';
import DetailsList from '../DetailsList';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

const items = [
  { label: 'Name', value: 'Adam' },
  { label: 'Role', value: 'Developer' },
];

describe('DetailsList', () => {
  it('renders all labels and values using Typography', () => {
    render(<DetailsList items={items} />);
    items.forEach(({ label, value }) => {
      const labelEl = screen.getByText(label);
      const valueEl = screen.getByText(value as string);
      expect(labelEl).toBeInTheDocument();
      expect(valueEl).toBeInTheDocument();
      expect(labelEl.tagName).toMatch(/SPAN|P|DIV/); // Typography may render span, p, or div
      expect(valueEl.tagName).toMatch(/SPAN|P|DIV/);
    });
  });

  it('applies custom class names to Grid, label, and value', () => {
    render(
      <DetailsList
        items={items}
        className="custom-grid"
        dtClassName="custom-label"
        ddClassName="custom-value"
      />
    );

    const grid = screen.getByText('Name').closest('.custom-grid');
    expect(grid).toBeTruthy();

    const labelEl = screen.getByText('Name');
    expect(labelEl).toHaveClass('custom-label');

    const valueEl = screen.getByText('Adam');
    expect(valueEl).toHaveClass('custom-value');
  });
});
