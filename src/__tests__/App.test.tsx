import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Use text that actually exists in the component
    expect(screen.getByText(/vite \+ react/i)).toBeInTheDocument();
  });

  it('contains the main app container', () => {
    render(<App />);
    // Look for the card div instead of a banner
    const appElement = screen.getByText(/edit/i).closest('.card');
    expect(appElement).toBeInTheDocument();
  });

  it('has correct initial state', () => {
    render(<App />);
    // Check for the actual text in the footer
    expect(
      screen.getByText(/click on the vite and react logos to learn more/i)
    ).toBeInTheDocument();
    // Check the count button
    expect(screen.getByText(/count is 0/i)).toBeInTheDocument();
  });
});
