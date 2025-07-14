import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import URLForm from '../URLForm';

describe('URLForm', () => {
  it('renders form elements correctly', () => {
    render(<URLForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/website url/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/https:\/\/example.com/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add url for analysis/i })
    ).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<URLForm onSubmit={vi.fn()} />);
    const input = screen.getByLabelText(/website url/i);
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    expect(input).toHaveValue('https://test.com');
  });

  it('shows error when submitting empty URL', async () => {
    render(<URLForm onSubmit={vi.fn()} />);
    fireEvent.click(
      screen.getByRole('button', { name: /add url for analysis/i })
    );
    expect(screen.getByText(/url is required/i)).toBeInTheDocument();
  });

  it('calls onSubmit with URL when form is submitted', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<URLForm onSubmit={handleSubmit} />);
    const input = screen.getByLabelText(/website url/i);
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    fireEvent.click(
      screen.getByRole('button', { name: /add url for analysis/i })
    );
    expect(handleSubmit).toHaveBeenCalledWith('https://test.com');
  });

  it('clears input after successful submission', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<URLForm onSubmit={handleSubmit} />);
    const input = screen.getByLabelText(/website url/i);
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    fireEvent.click(
      screen.getByRole('button', { name: /add url for analysis/i })
    );
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('shows error message when submission fails', async () => {
    const error = new Error('Network error');
    const handleSubmit = vi.fn().mockRejectedValue(error);
    render(<URLForm onSubmit={handleSubmit} />);
    const input = screen.getByLabelText(/website url/i);
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    fireEvent.click(
      screen.getByRole('button', { name: /add url for analysis/i })
    );
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('disables button and shows loading state during submission', async () => {
    let resolveSubmit: (value?: unknown) => void;
    const submitPromise = new Promise(resolve => {
      resolveSubmit = resolve;
    });
    const handleSubmit = vi.fn().mockImplementation(() => submitPromise);

    render(<URLForm onSubmit={handleSubmit} />);
    const input = screen.getByLabelText(/website url/i);
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    fireEvent.click(
      screen.getByRole('button', { name: /add url for analysis/i })
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolveSubmit!();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });
});
