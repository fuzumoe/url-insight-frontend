import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainLayout from '../MainLayout';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../Header', () => ({
  default: (props: { toggleSidebar: () => void }) => (
    <div data-testid="header" onClick={props.toggleSidebar}>
      Header
    </div>
  ),
}));
vi.mock('../Sidebar', () => ({
  default: (props: { isOpen: boolean; onClose: () => void }) => (
    <div data-testid="sidebar">{props.isOpen ? 'Open' : 'Closed'}</div>
  ),
}));
vi.mock('../Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

describe('MainLayout', () => {
  it('renders layout structure and children correctly', () => {
    render(
      <MainLayout>
        <div data-testid="child">Main Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toHaveTextContent('Closed');
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    const mainContainer = screen.getByTestId('child').closest('main');
    expect(mainContainer).toHaveClass('flex-grow');
  });

  it('toggles sidebar open when header is clicked', () => {
    render(
      <MainLayout>
        <div>Main Content</div>
      </MainLayout>
    );

    const header = screen.getByTestId('header');
    const sidebar = screen.getByTestId('sidebar');

    expect(sidebar).toHaveTextContent('Closed');
    fireEvent.click(header);
    expect(sidebar).toHaveTextContent('Open');
  });
});
