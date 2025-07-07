import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/learn react/i)).toBeInTheDocument();
  });

  it('contains the main app container', () => {
    render(<App />);
    const appElement =
      screen.getByRole('banner') ||
      screen.getByText(/learn react/i).closest('div');
    expect(appElement).toBeInTheDocument();
  });

  it('has correct initial state', () => {
    render(<App />);
    // Check that the Learn React link is present
    expect(screen.getByText('Learn React')).toBeInTheDocument();
  });
});
