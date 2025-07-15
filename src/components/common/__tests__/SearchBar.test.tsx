import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renders with default placeholder', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Search URLs...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Find something...';
    render(<SearchBar onSearch={() => {}} placeholder={customPlaceholder} />);
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('updates input value when user types', () => {
    render(<SearchBar onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('Search URLs...');

    fireEvent.change(input, { target: { value: 'test query' } });

    expect(input).toHaveValue('test query');
  });

  it('calls onSearch with the input value when form is submitted', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('Search URLs...');
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.click(searchButton);

    expect(handleSearch).toHaveBeenCalledWith('test query');
  });

  it('calls onSearch when Enter key is pressed', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('Search URLs...');

    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.submit(input.closest('form')!);

    expect(handleSearch).toHaveBeenCalledWith('test query');
  });

  it('renders the search icon in the input', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('applies custom className to the form', () => {
    const { container } = render(
      <SearchBar onSearch={() => {}} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has responsive layout that stacks on mobile', () => {
    const { container } = render(<SearchBar onSearch={() => {}} />);
    const form = container.firstChild;
    expect(form).toHaveClass('flex-col');
    expect(form).toHaveClass('sm:flex-row');
  });

  it('shows icon-only button on mobile and text on larger screens', () => {
    render(<SearchBar onSearch={() => {}} />);

    const button = screen.getByRole('button', { name: /search/i });

    const buttonIcon = button.querySelector('svg');
    const { getByText } = within(button);
    const buttonText = getByText('Search');

    expect(buttonIcon).toHaveClass('sm:hidden');
    expect(buttonText).toHaveClass('hidden');
    expect(buttonText).toHaveClass('sm:inline');
  });
});
