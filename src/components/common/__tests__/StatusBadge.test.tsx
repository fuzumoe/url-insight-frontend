import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import StatusBadge from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders queued status correctly', () => {
    render(<StatusBadge status="queued" />);
    const badge = screen.getByText('Queued');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-200');
    expect(badge).toHaveClass('text-gray-800');
  });

  it('renders running status correctly with animation', () => {
    render(<StatusBadge status="running" />);
    const badge = screen.getByText('Running');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-200');
    expect(badge).toHaveClass('text-blue-800');
    expect(badge).toHaveClass('animate-pulse');
  });

  it('renders done status correctly', () => {
    render(<StatusBadge status="done" />);
    const badge = screen.getByText('Done');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-200');
    expect(badge).toHaveClass('text-green-800');
  });

  it('renders error status correctly', () => {
    render(<StatusBadge status="error" />);
    const badge = screen.getByText('Error');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-200');
    expect(badge).toHaveClass('text-red-800');
  });

  it('renders stopped status correctly', () => {
    render(<StatusBadge status="stopped" />);
    const badge = screen.getByText('Stopped');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-200');
    expect(badge).toHaveClass('text-yellow-800');
  });

  it('capitalizes the first letter of the status', () => {
    render(<StatusBadge status="queued" />);
    expect(screen.getByText('Queued')).toBeInTheDocument();
    expect(screen.queryByText('queued')).not.toBeInTheDocument();
  });
});
