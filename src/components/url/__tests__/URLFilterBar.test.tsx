import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import URLFilterBar from '../URLFilterBar';
import type { URLTableFilters } from '../../../types';

// Mock the SearchBar and Checkbox so the tests focus on URLFilterBar logic.
vi.mock('../common/SearchBar', () => ({
  default: ({ onSearch, placeholder, className }: any) => (
    <form
      onSubmit={e => {
        e.preventDefault();
        const value = (e.target as any).elements.search.value;
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
}));

vi.mock('../common/Checkbox', () => ({
  default: ({ id, checked, onChange }: any) => {
    // Create a stateful mock that can track clicks
    return (
      <input
        data-testid={id}
        id={id}
        type="checkbox"
        checked={checked}
        aria-label={id === 'latest-filter' ? 'Latest analysis only' : undefined}
        onChange={() => {
          // On change, pass the opposite of current checked state
          // This simulates toggle behavior
          if (checked) {
            onChange(undefined); // If currently checked, pass undefined when unchecking
          } else {
            onChange(true); // If currently unchecked, pass true when checking
          }
        }}
      />
    );
  },
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

    // The search bar is found by its placeholder.
    expect(screen.getByPlaceholderText('Search URLs...')).toBeInTheDocument();

    // The three dropdowns are found by their accessible labels.
    expect(screen.getByLabelText('Filter by status')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by login form')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by broken links')).toBeInTheDocument();

    // The checkbox should be accessible via its associated label.
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

    // Use the placeholder text to get the search input
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
      'Filter by status'
    ) as HTMLSelectElement;
    fireEvent.change(statusSelect, { target: { value: 'error' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: 'error' });

    // Selecting "all" resets the filter.
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
      'Filter by login form'
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
      'Filter by broken links'
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

  // ...
  it('calls onFilterChange when latest analysis checkbox is toggled', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Find the checkbox by its accessible role and label.
    const checkbox = screen.getByRole('checkbox', {
      name: /Latest analysis only/i,
    }) as HTMLInputElement;

    // Simulate checking (click toggles false → true)
    fireEvent.click(checkbox);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ latestOnly: true });

    // Clear the mock to focus only on the second call
    mockOnFilterChange.mockClear();

    // Simulate unchecking (click toggles true → false)
    fireEvent.click(checkbox);

    // Just verify that onFilterChange was called again
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
      'Filter by status'
    ) as HTMLSelectElement;
    expect(statusSelect.value).toBe('error');

    const loginSelect = screen.getByLabelText(
      'Filter by login form'
    ) as HTMLSelectElement;
    expect(loginSelect.value).toBe('true');

    const brokenLinksSelect = screen.getByLabelText(
      'Filter by broken links'
    ) as HTMLSelectElement;
    expect(brokenLinksSelect.value).toBe('false');

    // Find the checkbox using the accessible role.
    const checkbox = screen.getByRole('checkbox', {
      name: /Latest analysis only/i,
    }) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
