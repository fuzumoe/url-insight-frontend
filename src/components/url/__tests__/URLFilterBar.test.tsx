import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import URLFilterBar from '../URLFilterBar';
import type { URLTableFilters } from '../../../types';

vi.mock('..', () => ({
  Box: ({
    children,
    background,
    padding,
    className,
  }: {
    children?: React.ReactNode;
    background?: string;
    padding?: string;
    className?: string;
  }) => (
    <div
      className={`box ${background || ''} ${padding || ''} ${className || ''}`}
      data-testid="box-component"
    >
      {children}
    </div>
  ),
  Flex: ({
    children,
    direction,
    justify,
    wrap,
    gap,
    align,
    className,
  }: {
    children: React.ReactNode;
    direction?: string;
    justify?: string;
    wrap?: string;
    gap?: string;
    align?: string;
    className?: string;
  }) => (
    <div
      className={`flex ${direction || ''} ${justify || ''} ${wrap || ''} ${gap || ''} ${align || ''} ${className || ''}`}
      data-testid="flex-component"
    >
      {children}
    </div>
  ),
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
      data-testid="search-form"
      onSubmit={e => {
        e.preventDefault();
        onSearch('test-search');
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
        data-testid={id}
        value={value}
        onChange={e => onChange({ target: { value: e.target.value } })}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
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
        id={id}
        data-testid={id}
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  ),
}));

const defaultFilters: URLTableFilters = {
  status: undefined,
  hasLoginForm: undefined,
  hasBrokenLinks: undefined,
  latestOnly: undefined,
};

describe('URLFilterBar', () => {
  it('renders search bar, dropdowns and checkbox', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onFilterChange={() => {}}
        onSearch={() => {}}
      />
    );

    expect(screen.getByTestId('search-bar')).toBeTruthy();

    expect(screen.getByTestId('status-filter')).toBeTruthy();
    expect(screen.getByTestId('login-filter')).toBeTruthy();
    expect(screen.getByTestId('broken-filter')).toBeTruthy();

    expect(screen.getByTestId('latest-filter')).toBeTruthy();
  });

  it('calls onSearch when search form is submitted', () => {
    const onSearch = vi.fn();
    render(
      <URLFilterBar
        filters={defaultFilters}
        onFilterChange={() => {}}
        onSearch={onSearch}
      />
    );

    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);

    expect(onSearch).toHaveBeenCalledWith('test-search');
  });

  it('calls onFilterChange when status is changed', () => {
    const onFilterChange = vi.fn();
    render(
      <URLFilterBar
        filters={defaultFilters}
        onFilterChange={onFilterChange}
        onSearch={() => {}}
      />
    );

    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: 'done' } });

    expect(onFilterChange).toHaveBeenCalledWith({ status: 'done' });
  });

  it('calls onFilterChange when login form filter is changed', () => {
    const onFilterChange = vi.fn();
    render(
      <URLFilterBar
        filters={defaultFilters}
        onFilterChange={onFilterChange}
        onSearch={() => {}}
      />
    );

    const loginFilter = screen.getByTestId('login-filter');
    fireEvent.change(loginFilter, { target: { value: 'true' } });

    expect(onFilterChange).toHaveBeenCalledWith({ hasLoginForm: true });
  });

  it('calls onFilterChange when broken links filter is changed', () => {
    const onFilterChange = vi.fn();
    render(
      <URLFilterBar
        filters={defaultFilters}
        onFilterChange={onFilterChange}
        onSearch={() => {}}
      />
    );

    const brokenFilter = screen.getByTestId('broken-filter');
    fireEvent.change(brokenFilter, { target: { value: 'true' } });

    expect(onFilterChange).toHaveBeenCalledWith({ hasBrokenLinks: true });
  });

  it('calls onFilterChange when latest analysis checkbox is toggled', () => {
    const onFilterChange = vi.fn();
    render(
      <URLFilterBar
        filters={defaultFilters}
        onFilterChange={onFilterChange}
        onSearch={() => {}}
      />
    );

    const latestFilter = screen.getByTestId('latest-filter');
    fireEvent.click(latestFilter);

    expect(onFilterChange).toHaveBeenCalledWith({ latestOnly: true });
  });

  it('shows the correct initial state based on provided filters', () => {
    const filters: URLTableFilters = {
      status: 'done',
      hasLoginForm: true,
      hasBrokenLinks: false,
      latestOnly: true,
    };

    render(
      <URLFilterBar
        filters={filters}
        onFilterChange={() => {}}
        onSearch={() => {}}
      />
    );

    const statusFilter = screen.getByTestId(
      'status-filter'
    ) as HTMLSelectElement;
    expect(statusFilter.value).toBe('done');

    const loginFilter = screen.getByTestId('login-filter') as HTMLSelectElement;
    expect(loginFilter.value).toBe('true');

    const brokenFilter = screen.getByTestId(
      'broken-filter'
    ) as HTMLSelectElement;
    expect(brokenFilter.value).toBe('false');

    const latestFilter = screen.getByTestId(
      'latest-filter'
    ) as HTMLInputElement;
    expect(latestFilter.checked).toBe(true);
  });

  it('uses layout components correctly', () => {
    render(
      <URLFilterBar
        filters={defaultFilters}
        onFilterChange={() => {}}
        onSearch={() => {}}
      />
    );

    const boxComponents = screen.getAllByTestId('box-component');
    const flexComponents = screen.getAllByTestId('flex-component');

    expect(boxComponents.length).toBeGreaterThan(0);
    expect(flexComponents.length).toBeGreaterThan(0);
  });
});
