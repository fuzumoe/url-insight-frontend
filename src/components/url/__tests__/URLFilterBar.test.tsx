import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import URLFilterBar from '../URLFilterBar';
import type { URLTableFilters } from '../../../types';

// Mock layout components
vi.mock('../../layout', () => ({
  Box: ({
    children,
    className,
    background,
    padding,
  }: {
    children: React.ReactNode;
    className?: string;
    background?: string;
    padding?: string;
  }) => (
    <div
      data-testid="mock-box"
      data-background={background}
      data-padding={padding}
      className={className}
    >
      {children}
    </div>
  ),
  Flex: ({
    children,
    className,
    direction,
    justify,
    align,
    gap,
    wrap,
  }: {
    children: React.ReactNode;
    className?: string;
    direction?: string;
    justify?: string;
    align?: string;
    gap?: string;
    wrap?: string;
  }) => (
    <div
      data-testid="mock-flex"
      data-direction={direction}
      data-justify={justify}
      data-align={align}
      data-gap={gap}
      data-wrap={wrap}
      className={className}
    >
      {children}
    </div>
  ),
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-container">{children}</div>
  ),
}));

// Mock SearchBar component
vi.mock('../../common', () => ({
  SearchBar: ({
    onSearch,
    placeholder,
    className,
  }: {
    onSearch: (searchTerm: string) => void;
    placeholder: string;
    className?: string;
  }) => (
    <form
      onSubmit={e => {
        e.preventDefault();
        const value = (
          (e.target as HTMLFormElement).elements.namedItem(
            'search'
          ) as HTMLInputElement
        ).value;
        onSearch(value);
      }}
    >
      <input
        data-testid="search-bar"
        name="search"
        placeholder={placeholder}
        className={className}
      />
      <button type="submit">Search</button>
    </form>
  ),

  // Mock SelectInput component
  SelectInput: ({
    id,
    label,
    value,
    options,
    onChange,
  }: {
    id: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (e: { target: { value: string } }) => void;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={e => onChange({ target: { value: e.target.value } })}
        data-testid={id}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),

  // Mock Checkbox component with label support
  Checkbox: ({
    id,
    checked,
    onChange,
    label,
  }: {
    id: string;
    checked?: boolean;
    onChange: (value: boolean) => void;
    label?: string;
  }) => (
    <div className="checkbox-wrapper">
      <input
        data-testid={id}
        id={id}
        type="checkbox"
        checked={checked}
        aria-label={label}
        onChange={() => onChange(!checked)}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  ),
}));

describe('URLFilterBar', () => {
  const mockOnSearch = vi.fn();
  const mockOnFilterChange = vi.fn();
  const defaultFilters: URLTableFilters = {
    status: undefined,
    hasLoginForm: undefined,
    hasBrokenLinks: undefined,
    latestOnly: undefined,
  };

  beforeEach(() => {
    mockOnSearch.mockReset();
    mockOnFilterChange.mockReset();
  });

  it('renders search bar, dropdowns and checkbox', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByPlaceholderText('Search URLs...')).toBeInTheDocument();

    expect(screen.getByLabelText(/Filter by Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by Login Form/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Filter by Broken Links/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /Latest analysis only/i })
    ).toBeInTheDocument();
  });

  it('calls onSearch when search form is submitted', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    const searchInput = screen.getByPlaceholderText('Search URLs...');
    fireEvent.change(searchInput, { target: { value: 'example.com' } });
    fireEvent.submit(searchInput.closest('form')!);
    expect(mockOnSearch).toHaveBeenCalledWith('example.com');
  });

  it('calls onFilterChange when status is changed', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    const statusSelect = screen.getByLabelText(
      /Filter by Status/i
    ) as HTMLSelectElement;
    fireEvent.change(statusSelect, { target: { value: 'error' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: 'error' });

    fireEvent.change(statusSelect, { target: { value: 'all' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: undefined });
  });

  it('calls onFilterChange when login form filter is changed', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    const loginSelect = screen.getByLabelText(
      /Filter by Login Form/i
    ) as HTMLSelectElement;
    fireEvent.change(loginSelect, { target: { value: 'true' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ hasLoginForm: true });

    fireEvent.change(loginSelect, { target: { value: 'false' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ hasLoginForm: false });

    fireEvent.change(loginSelect, { target: { value: 'all' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      hasLoginForm: undefined,
    });
  });

  it('calls onFilterChange when broken links filter is changed', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    const brokenLinksSelect = screen.getByLabelText(
      /Filter by Broken Links/i
    ) as HTMLSelectElement;
    fireEvent.change(brokenLinksSelect, { target: { value: 'true' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ hasBrokenLinks: true });

    fireEvent.change(brokenLinksSelect, { target: { value: 'false' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ hasBrokenLinks: false });

    fireEvent.change(brokenLinksSelect, { target: { value: 'all' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      hasBrokenLinks: undefined,
    });
  });

  it('calls onFilterChange when latest analysis checkbox is toggled', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    const checkbox = screen.getByRole('checkbox', {
      name: /Latest analysis only/i,
    }) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ latestOnly: true });
    mockOnFilterChange.mockClear();
    fireEvent.click(checkbox);
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('shows the correct initial state based on provided filters', () => {
    const activeFilters: URLTableFilters = {
      status: 'error',
      hasLoginForm: true,
      hasBrokenLinks: false,
      latestOnly: true,
    };

    render(
      <URLFilterBar
        filters={activeFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    const statusSelect = screen.getByLabelText(
      /Filter by Status/i
    ) as HTMLSelectElement;
    expect(statusSelect.value).toBe('error');

    const loginSelect = screen.getByLabelText(
      /Filter by Login Form/i
    ) as HTMLSelectElement;
    expect(loginSelect.value).toBe('true');

    const brokenLinksSelect = screen.getByLabelText(
      /Filter by Broken Links/i
    ) as HTMLSelectElement;
    expect(brokenLinksSelect.value).toBe('false');

    const checkbox = screen.getByRole('checkbox', {
      name: /Latest analysis only/i,
    }) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('uses layout components correctly', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Check for Box with white background
    const boxes = screen.getAllByTestId('mock-box');
    expect(boxes.length).toBeGreaterThan(0);
    expect(boxes[0]).toHaveAttribute('data-background', 'white');

    // Check for Flex with proper attributes
    const flexes = screen.getAllByTestId('mock-flex');
    expect(flexes.length).toBeGreaterThan(0);

    // Verify the main flex container has column direction
    expect(flexes[0]).toHaveAttribute('data-direction', 'column');

    // Verify there's a flex with wrap
    const wrapFlex = flexes.find(
      flex => flex.getAttribute('data-wrap') === 'wrap'
    );
    expect(wrapFlex).toBeInTheDocument();
  });
});
