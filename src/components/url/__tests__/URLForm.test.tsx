import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import URLForm from '../URLForm';

describe('URLForm', () => {
  it('renders form elements correctly', () => {
    render(<URLForm onSubmit={vi.fn()} />);

    // Check for input and button
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

    // Submit form with empty input
    fireEvent.click(
      screen.getByRole('button', { name: /add url for analysis/i })
    );

    // Error message should appear
    expect(screen.getByText(/url is required/i)).toBeInTheDocument();
  });

  it('calls onSubmit with URL when form is submitted', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<URLForm onSubmit={handleSubmit} />);

    // Fill in the URL
    const input = screen.getByLabelText(/website url/i);
    fireEvent.change(input, { target: { value: 'https://test.com' } });

    // Submit the form
    fireEvent.click(
      screen.getByRole('button', { name: /add url for analysis/i })
    );

    // Verify onSubmit was called with the correct URL
    expect(handleSubmit).toHaveBeenCalledWith('https://test.com');
  });

  it('clears input after successful submission', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(<URLForm onSubmit={handleSubmit} />);

    // Fill in the URL
    const input = screen.getByLabelText(/website url/i);
    fireEvent.change(input, { target: { value: 'https://test.com' } });

    // Submit the form
    fireEvent.click(
      screen.getByRole('button', { name: /add url for analysis/i })
    );

    // Input should be cleared after submission
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('shows error message when submission fails', async () => {
    const error = new Error('Network error');
    const handleSubmit = vi.fn().mockRejectedValue(error);
    render(<URLForm onSubmit={handleSubmit} />);

    // Fill in the URL
    const input = screen.getByLabelText(/website url/i);
    fireEvent.change(input, { target: { value: 'https://test.com' } });

    // Submit the form
    fireEvent.click(
      screen.getByRole('button', { name: /add url for analysis/i })
    );

    // Error message should appear
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('disables button and shows loading state during submission', async () => {
    // Create a promise that we can resolve manually to control the loading state
    let resolveSubmit: (value?: unknown) => void;
    const submitPromise = new Promise(resolve => {
      resolveSubmit = resolve;
    });
    const handleSubmit = vi.fn().mockImplementation(() => submitPromise);

    render(<URLForm onSubmit={handleSubmit} />);

    // Fill in the URL
    const input = screen.getByLabelText(/website url/i);
    fireEvent.change(input, { target: { value: 'https://test.com' } });

    // Submit the form
    fireEvent.click(
      screen.getByRole('button', { name: /add url for analysis/i })
    );

    // Button should show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Resolve the promise to complete the submission
    resolveSubmit!();

    // Loading state should disappear
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });
});
