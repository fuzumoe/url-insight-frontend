import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Pagination from '../Pagination';

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('disables Previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );
    const prevButton = screen.getByRole('button', { name: 'Previous' });
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />
    );
    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeDisabled();
  });

  it('highlights the current page', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />
    );

    const currentPageButton = screen.getByRole('button', { name: '3' });
    const otherPageButton = screen.getByRole('button', { name: '2' });

    expect(currentPageButton.className).toContain('bg-blue-600');
    expect(otherPageButton.className).toContain('bg-gray-200');
  });

  it('calls onPageChange with the correct page number when page is clicked', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '4' }));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange when Previous button is clicked', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when Next button is clicked', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('shows ellipsis when needed for large page ranges', () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />
    );
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  it('shows first and last page when current page is in the middle', () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />
    );
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('does not show ellipsis for small page ranges', () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={() => {}} />
    );
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('always shows at least 5 page numbers if possible', () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
    );
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
  });

  it('uses sm size for buttons', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button.className).toContain('sm');
    });
  });
});
